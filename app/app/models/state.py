from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base


class State(Base):
    __tablename__ = "states"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    country_id = Column(Integer, ForeignKey("countries.id"))

    country = relationship("Country", back_populates="states")

    cities = relationship("City", back_populates="state")
