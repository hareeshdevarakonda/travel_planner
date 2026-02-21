from sqlalchemy import Column, Integer, ForeignKey

from app.core.database import Base


class CoTraveller(Base):
    __tablename__ = "co_travellers"

    id = Column(Integer, primary_key=True, index=True)

    itinerary_id = Column(Integer, ForeignKey("itineraries.id"))

    user_id = Column(Integer, ForeignKey("users.id"))
