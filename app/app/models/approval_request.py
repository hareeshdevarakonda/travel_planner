from sqlalchemy import Column, Integer, String, Boolean

from app.core.database import Base


class ApprovalRequest(Base):

    __tablename__ = "approval_requests"

    id = Column(Integer, primary_key=True)

    type = Column(String)

    data = Column(String)

    status = Column(String, default="PENDING")
