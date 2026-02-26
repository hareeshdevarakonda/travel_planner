# ai_layer/auth_api.py
import csv
import os
import time
from datetime import datetime, timedelta, timezone
from threading import Lock
from typing import Optional, Dict, Any

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import jwt, JWTError
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr, Field

router = APIRouter(prefix="/auth", tags=["Auth"])

# ---- Config (env) ----
JWT_SECRET = os.getenv("JWT_SECRET", "change-me-in-backend-env")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "120"))

AUTH_CSV_PATH = os.getenv("AUTH_CSV_PATH", os.path.join("data", "users.csv"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
csv_lock = Lock()
security = HTTPBearer()

# ---- Models ----
from pydantic import BaseModel, EmailStr, Field, field_validator

class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=80)
    email: EmailStr
    password: str = Field(..., min_length=4, max_length=72)

    @field_validator("password")
    @classmethod
    def validate_password_bytes(cls, v: str):
        if len(v.encode("utf-8")) > 72:
            raise ValueError("Password too long (bcrypt supports max 72 bytes).")
        return v

class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=4, max_length=72)

    @field_validator("password")
    @classmethod
    def validate_password_bytes(cls, v: str):
        if len(v.encode("utf-8")) > 72:
            raise ValueError("Password too long (bcrypt supports max 72 bytes).")
        return v

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class MeResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    created_at: str

# ---- Helpers ----
def _ensure_csv_exists():
    os.makedirs(os.path.dirname(AUTH_CSV_PATH), exist_ok=True)
    if not os.path.exists(AUTH_CSV_PATH):
        with open(AUTH_CSV_PATH, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(
                f, fieldnames=["id", "name", "email", "password_hash", "created_at"]
            )
            writer.writeheader()

def _read_all_users() -> list[dict[str, str]]:
    _ensure_csv_exists()
    with open(AUTH_CSV_PATH, "r", newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))

def _write_all_users(rows: list[dict[str, str]]):
    _ensure_csv_exists()
    with open(AUTH_CSV_PATH, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(
            f, fieldnames=["id", "name", "email", "password_hash", "created_at"]
        )
        writer.writeheader()
        writer.writerows(rows)

def _find_user_by_email(email: str) -> Optional[dict[str, str]]:
    users = _read_all_users()
    for u in users:
        if u["email"].lower() == email.lower():
            return u
    return None

def _create_access_token(payload: Dict[str, Any]) -> str:
    now = datetime.now(timezone.utc)
    exp = now + timedelta(minutes=JWT_EXPIRE_MINUTES)
    to_encode = {
        **payload,
        "iat": int(now.timestamp()),
        "exp": int(exp.timestamp()),
    }
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

def _get_current_user(creds: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    token = creds.credentials
    try:
        decoded = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    email = decoded.get("sub")
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    user = _find_user_by_email(email)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user

# compatibility alias for imports expecting `get_current_user`
get_current_user = _get_current_user

# ---- Routes ----
@router.post("/register", response_model=TokenResponse)
def register(req: RegisterRequest):
    with csv_lock:
        existing = _find_user_by_email(req.email)
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")

        users = _read_all_users()
        user_id = str(int(time.time() * 1000))  # simple unique id
        created_at = datetime.now(timezone.utc).isoformat()

        users.append({
            "id": user_id,
            "name": req.name,
            "email": req.email,
            "password_hash": pwd_context.hash(req.password),
            "created_at": created_at,
        })
        _write_all_users(users)
        
        # Create user data folder for itineraries
        from ai_layer.config import ITIN_STORAGE_DIR
        os.makedirs(ITIN_STORAGE_DIR, exist_ok=True)

    token = _create_access_token({"sub": req.email, "name": req.name, "uid": user_id})
    return TokenResponse(access_token=token)

@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest):
    user = _find_user_by_email(req.email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not pwd_context.verify(req.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = _create_access_token({"sub": user["email"], "name": user["name"], "uid": user["id"]})
    return TokenResponse(access_token=token)

@router.get("/me", response_model=MeResponse)
def me(user: dict = Depends(_get_current_user)):
    return MeResponse(
        id=user["id"],
        name=user["name"],
        email=user["email"],
        created_at=user["created_at"],
    )