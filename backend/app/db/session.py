import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

Base = declarative_base()

DB_ENABLED = os.getenv("DB_ENABLED", "true").lower() in ("1", "true", "yes")

DATABASE_URL = os.getenv("DATABASE_URL")

engine = None
SessionLocal = None

if DB_ENABLED:
    if not DATABASE_URL:
        raise RuntimeError("DATABASE_URL is not set but DB_ENABLED=true")
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
