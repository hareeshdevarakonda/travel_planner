from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Routers
from app.api.routes.location_sync import router as location_sync_router
from app.api.routes.auth import router as auth_router
from app.api.routes.countries import router as locations_router
from app.api.routes.places import router as places_router
from app.api.routes.approvals import router as approvals_router
from app.api.routes.admin import router as admin_router
from app.api.routes.drive import router as drive_router
from app.api.routes.itineraries import router as itineraries_router
from app.api.routes.users import router as users_router

# Ensure services are imported (so any module-level setup runs)
import app.services.approval_service  # noqa: F401
import app.services.countriesnow_service  # noqa: F401
import app.services.google_drive_service  # noqa: F401
import app.services.opentripmap_service  # noqa: F401


app = FastAPI(
    title="Travel Planner API",
    version="0.1.0",
)

# Allow the local API tester / frontend during development.
# Adjust origins for production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "http://127.0.0.1:5173",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(location_sync_router)
app.include_router(auth_router)
app.include_router(locations_router)
app.include_router(places_router)
app.include_router(approvals_router)
app.include_router(admin_router)
app.include_router(drive_router)
app.include_router(itineraries_router)
app.include_router(users_router)

# Static files
# NOTE: When running from D:\backend\backend\app, this relative path works.
app.mount("/static", StaticFiles(directory="app/static"), name="static")


@app.get("/", tags=["default"])
def root():
    return {"message": "API working"}


@app.get("/health", tags=["default"])
def health():
    return {"status": "ok"}
