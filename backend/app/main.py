# backend/app/main.py
import os
from dotenv import load_dotenv

# Load backend/.env BEFORE importing anything that reads env vars
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.session import engine, Base
from app.routers import users

from ai_layer.api import router as ai_router
from ai_layer.maps_api import router as maps_router
from ai_layer.images_api import router as images_router

app = FastAPI(title="Travel Planner API")

# Routers
app.include_router(users.router)     # keep existing user routes
app.include_router(ai_router)        # /ai/*
app.include_router(maps_router)      # /maps/*
app.include_router(images_router)    # /images/*

# CORS (dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
