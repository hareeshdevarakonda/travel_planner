from fastapi import APIRouter, Depends
from app.core.security import get_current_admin
from app.models.user import User


router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
    # Require admin login for every endpoint in this router
    dependencies=[Depends(get_current_admin)],
)


@router.get("/health")
def admin_health(admin: User = Depends(get_current_admin)):
    return {"ok": True, "admin_id": admin.id}


"""Admin router.

User-management endpoints were moved under the "Users" section as requested.
"""
