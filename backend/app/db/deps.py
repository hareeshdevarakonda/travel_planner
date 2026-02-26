from fastapi import HTTPException
from app.db.session import SessionLocal


def get_db():
    if SessionLocal is None:
        raise HTTPException(
            status_code=503,
            detail="Database is not configured. Set DATABASE_URL and DB_ENABLED=true"
        )
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
