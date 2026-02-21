from pydantic import BaseModel, EmailStr


# Used for public registration
class UserCreate(BaseModel):

    name: str
    email: EmailStr
    password: str


# Used for login
class UserLogin(BaseModel):

    email: EmailStr
    password: str


# Used for admin creation (same fields, separate schema for clarity & security)
class AdminCreate(BaseModel):

    name: str
    email: EmailStr
    password: str


# Used for returning user data
class UserResponse(BaseModel):

    id: int
    name: str
    email: str

    class Config:
        from_attributes = True


# Admin/User-management view (includes flags)
class UserAdminResponse(UserResponse):

    is_admin: bool
    is_active: bool


class UserFlagsUpdate(BaseModel):
    """Update admin/active flags. Use null/omit to keep unchanged."""

    is_admin: bool | None = None
    is_active: bool | None = None


class UserCreateByAdmin(UserCreate):
    """Admin can create users and optionally set flags."""

    is_admin: bool = False
    is_active: bool = True
