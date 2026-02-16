from fastapi import FastAPI

from app.core.database import engine, Base
from app.api.auth import router as auth_router
from app.models import user

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Travel Planner API"
)

# Include authentication routes
app.include_router(auth_router)


@app.get("/")
def root():
    return {"message": "Travel Planner API Running"}
