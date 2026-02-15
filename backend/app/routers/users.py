from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.schemas.user import UserCreate, UserOut
from app.models.user import User

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.post("/", response_model=UserOut)
def create_user(user: UserCreate, db: Session = Depends(get_db)):

    db_user = User(
        name=user.name,
        email=user.email,
        password=user.password  # hash later
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user
