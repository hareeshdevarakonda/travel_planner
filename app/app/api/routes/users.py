from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core import security
from app.models.user import User
from app.schemas.user import (
    UserAdminResponse,
    UserFlagsUpdate,
    UserCreateByAdmin,
)


router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.get("/me", response_model=UserAdminResponse)
def me(current_user: User = Depends(security.get_current_user)):
    return current_user


@router.get("/", response_model=List[UserAdminResponse])
def list_users(
    db: Session = Depends(get_db),
    _admin: User = Depends(security.get_current_admin),
):
    return db.query(User).order_by(User.id.desc()).all()


@router.get("/{user_id}", response_model=UserAdminResponse)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(security.get_current_admin),
):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/", response_model=UserAdminResponse)
def create_user_by_admin(
    payload: UserCreateByAdmin,
    db: Session = Depends(get_db),
    _admin: User = Depends(security.get_current_admin),
):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = security.hash_password(payload.password)
    user = User(
        name=payload.name,
        email=payload.email,
        password=hashed,
        is_admin=bool(payload.is_admin),
        is_active=bool(payload.is_active),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.patch("/{user_id}/flags", response_model=UserAdminResponse)
def update_user_flags(
    user_id: int,
    payload: UserFlagsUpdate,
    db: Session = Depends(get_db),
    _admin: User = Depends(security.get_current_admin),
):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if payload.is_admin is not None:
        user.is_admin = bool(payload.is_admin)
    if payload.is_active is not None:
        user.is_active = bool(payload.is_active)

    db.add(user)
    db.commit()
    db.refresh(user)
    return user
