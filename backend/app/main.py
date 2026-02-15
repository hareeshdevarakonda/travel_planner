from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.db.session import engine, Base
from app.models import user
from app.routers import users


app = FastAPI(title="Travel Planner API")
app.include_router(users.router)
load_dotenv()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)


@app.get("/")
def health():
    return {"status": "DB Connected 🚀"}
