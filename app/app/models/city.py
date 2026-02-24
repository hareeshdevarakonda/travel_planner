from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
# from app.models.place import Place

from app.core.database import Base


class City(Base):
    __tablename__ = "cities"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    state_id = Column(Integer, ForeignKey("states.id"))

    state = relationship("State", back_populates="cities")

    places = relationship("Place", back_populates="city")
