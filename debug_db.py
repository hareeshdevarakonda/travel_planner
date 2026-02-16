import os
from dotenv import load_dotenv

print("STEP 1: Loading .env")
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

print("STEP 2: DATABASE_URL =", DATABASE_URL)


print("STEP 3: Testing SQLAlchemy connection")

from sqlalchemy import create_engine

engine = create_engine(DATABASE_URL)

try:
    connection = engine.connect()
    print("SUCCESS: Database connected")
    connection.close()
except Exception as e:
    print("ERROR:", e)


print("STEP 4: Importing Base and User model")

from app.core.database import Base
from app.models.user import User

print("SUCCESS: Model imported")


print("STEP 5: Creating tables")

Base.metadata.create_all(bind=engine)

print("SUCCESS: Tables created")
