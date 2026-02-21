from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base


class PlaceMedia(Base):
    __tablename__ = "place_media"

    id = Column(Integer, primary_key=True, index=True)

    url = Column(String, nullable=False)

    place_id = Column(Integer, ForeignKey("places.id"))

    place = relationship("Place", back_populates="media")
