from pydantic import BaseModel
from typing import List, Optional
import datetime


class ItineraryCreate(BaseModel):
    name: str
    start_date: Optional[datetime.date]
    end_date: Optional[datetime.date]


class ItineraryResponse(BaseModel):
    id: int
    name: str
    start_date: Optional[datetime.date]
    end_date: Optional[datetime.date]

    class Config:
        from_attributes = True


class ItineraryItemCreate(BaseModel):
    place_id: int
    day: Optional[int]
    order: Optional[int]
    note: Optional[str]


class ItineraryItemResponse(BaseModel):
    id: int
    itinerary_id: int
    place_id: int
    day: Optional[int]
    order: Optional[int]
    note: Optional[str]
    is_active: bool

    class Config:
        from_attributes = True


class ItineraryDetailResponse(ItineraryResponse):
    owner_id: int
    co_travellers: List[int] = []
    items: List[ItineraryItemResponse] = []

