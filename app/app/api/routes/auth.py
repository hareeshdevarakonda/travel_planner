from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.user import UserCreate, UserLogin, UserResponse
from app.models.user import User
from app.core import security


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# ----------------------------
# Register Normal User
# ----------------------------
@router.post("/register", response_model=UserResponse)
def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    existing = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed = security.hash_password(user.password)

    db_user = User(
        name=user.name,
        email=user.email,
        password=hashed,
        is_admin=False,
        is_active=True
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


# ----------------------------
# Login
# ----------------------------
@router.post("/login")
def login(
    credentials: UserLogin,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.email == credentials.email
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    if not security.verify_password(
        credentials.password,
        user.password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    token = security.create_access_token({
        "user_id": user.id,
        "is_admin": user.is_admin
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }


# ----------------------------
# Get Current User
# ----------------------------
@router.get(
    "/me",
    response_model=UserResponse
)
def get_me(
    current_user: User = Depends(
        security.get_current_user
    )
):

    return current_user


# ----------------------------
# Create Admin (Admin Only)
# ----------------------------
@router.post(
    "/create-admin",
    response_model=UserResponse
)
def create_admin(
    user: UserCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(
        security.get_current_admin
    )
):

    existing = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed = security.hash_password(user.password)

    new_admin = User(
        name=user.name,
        email=user.email,
        password=hashed,
        is_admin=True,
        is_active=True
    )

    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)

    return new_admin
