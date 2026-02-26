# backend/app/main.py
import os
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Make sure repo root is importable so `import ai_layer` works even when running from backend/
import sys
from pathlib import Path
REPO_ROOT = Path(__file__).resolve().parents[2]  # .../backend/app/main.py -> repo root
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from ai_layer.api import router as ai_router
from ai_layer.maps_api import router as maps_router
from ai_layer.images_api import router as images_router
from ai_layer.auth_api import router as auth_router
from ai_layer.itinerary_api import router as itineraries_router

app = FastAPI(title="Travel Planner API")

# Routers
app.include_router(auth_router)         # /auth/*
app.include_router(ai_router)           # /ai/*
app.include_router(maps_router)         # /maps/*
app.include_router(images_router)       # /images/*
app.include_router(itineraries_router)  # /itineraries/*

# CORS (dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health():
    return {"status": "API Running 🚀"}

@app.get("/__routes")
def __routes():
    return sorted([f"{r.path} [{','.join(sorted(r.methods or []))}]" for r in app.router.routes])