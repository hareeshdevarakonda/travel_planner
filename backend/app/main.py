from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from auth import create_access_token, verify_token

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

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
