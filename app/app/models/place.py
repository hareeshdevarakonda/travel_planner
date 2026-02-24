from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
# from app.models.city import City

from app.core.database import Base


class Place(Base):
    __tablename__ = "places"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    description = Column(Text)

    latitude = Column(Float)

    longitude = Column(Float)

    city_id = Column(Integer, ForeignKey("cities.id"))

    city = relationship("City", back_populates="places")

    media = relationship("PlaceMedia", back_populates="place")
    is_active = Column(Boolean, default=True)
