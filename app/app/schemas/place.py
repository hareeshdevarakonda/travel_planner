from pydantic import BaseModel
from typing import List, Optional


class PlaceMediaResponse(BaseModel):
    id: int
    url: str

    class Config:
        from_attributes = True


class PlaceCreate(BaseModel):
    name: str
    description: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    city_id: Optional[int] = None
    media: List[str] = []


class PlaceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    city_id: Optional[int] = None
    is_active: Optional[bool] = None


class PlaceResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    city_id: Optional[int] = None
    is_active: bool
    media: List[PlaceMediaResponse] = []

    class Config:
        from_attributes = True
