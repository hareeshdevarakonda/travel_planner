# backend/app/main.py
import os
from dotenv import load_dotenv

# Load backend/.env BEFORE importing anything that reads env vars
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.session import engine, Base
from app.routers import users
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.auth import create_access_token, verify_token

app = FastAPI()

# Fake database (for now)
fake_users = {
    "admin": "1234"
}

class LoginData(BaseModel):
    username: str
    password: str


@app.post("/login")
def login(data: LoginData):
    if data.username not in fake_users:
        raise HTTPException(status_code=400, detail="User not found")

    if fake_users[data.username] != data.password:
        raise HTTPException(status_code=400, detail="Invalid password")

    token = create_access_token({"sub": data.username})

    return {
        "access_token": token,
        "token_type": "bearer"
    }

from ai_layer.api import router as ai_router
from ai_layer.maps_api import router as maps_router
from ai_layer.images_api import router as images_router

app = FastAPI(title="Travel Planner API")
# JWT Protection
security = HTTPBearer()

@app.get("/protected")
def protected_route(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = verify_token(token)

    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid token")

    return {
        "message": "You are authorized",
        "user": payload["sub"]
    }
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# Routers
app.include_router(users.router)     # keep existing user routes
app.include_router(ai_router)        # /ai/*
app.include_router(maps_router)      # /maps/*
app.include_router(images_router)    # /images/*

# CORS (dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    # Allow running AI-only without DB
    db_enabled = os.getenv("DB_ENABLED", "true").lower() in ("1", "true", "yes")
    if db_enabled and engine is not None:
        Base.metadata.create_all(bind=engine)

@app.get("/")
def health():
    return {
        "status": "API Running 🚀",
        "db_enabled": os.getenv("DB_ENABLED", "true"),
        "routes_enabled": ["users", "ai", "maps", "images"],
    }
@app.get("/__routes")
def __routes():
    return sorted([f"{r.path} [{','.join(sorted(r.methods or []))}]" for r in app.router.routes])
