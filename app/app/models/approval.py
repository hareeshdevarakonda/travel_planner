from sqlalchemy import Column, Integer, String, JSON, DateTime, Boolean
from datetime import datetime

from app.core.database import Base


class Approval(Base):
    __tablename__ = "approvals"

    id = Column(Integer, primary_key=True, index=True)

    type = Column(String, nullable=False)  
    # example: place_create, place_update

    data = Column(JSON, nullable=False)

    status = Column(String, default="pending")  
    # pending, approved, rejected

    created_at = Column(DateTime, default=datetime.utcnow)

    reviewed_at = Column(DateTime, nullable=True)

    is_active = Column(Boolean, default=True)
