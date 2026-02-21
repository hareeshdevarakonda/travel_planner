from sqlalchemy import Column, Integer, String, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship

from app.core.database import Base


class ItineraryItem(Base):
    __tablename__ = "itinerary_items"

    id = Column(Integer, primary_key=True)
    itinerary_id = Column(Integer, ForeignKey("itineraries.id"))
    place_id = Column(Integer, ForeignKey("places.id"))
    day = Column(Integer, nullable=True)
    order = Column(Integer, nullable=True)
    note = Column(Text)
    is_active = Column(Boolean, default=True)

    itinerary = relationship("Itinerary", back_populates="items")
    place = relationship("Place")
