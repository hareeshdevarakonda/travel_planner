from sqlalchemy import Column, Integer, String, ForeignKey, Table, Date
from sqlalchemy.orm import relationship

from app.core.database import Base


# association table for itinerary co-travellers
itinerary_travelers = Table(
    "itinerary_travelers",
    Base.metadata,
    Column("itinerary_id", ForeignKey("itineraries.id"), primary_key=True),
    Column("user_id", ForeignKey("users.id"), primary_key=True),
)


class Itinerary(Base):
    __tablename__ = "itineraries"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"))
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)

    owner = relationship("User")
    co_travellers = relationship("User", secondary=itinerary_travelers)
    items = relationship("ItineraryItem", back_populates="itinerary")
