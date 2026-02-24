from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.itinerary import Itinerary
from app.models.itinerary_item import ItineraryItem
from app.models.user import User
from app.schemas.itinerary import (
    ItineraryCreate,
    ItineraryResponse,
    ItineraryItemCreate,
    ItineraryItemResponse,
)
from app.core.security import get_current_user
from app.core.security import get_current_admin



router = APIRouter(
    prefix="/itineraries",
    # Show itinerary APIs under "Users" section in Swagger as requested.
    tags=["Users"]
)


@router.get("/user")
def itinerary_user(current_user: User = Depends(get_current_user)):
    """Return the currently authenticated user (helps FE know who owns new itineraries)."""
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "is_admin": bool(current_user.is_admin),
        "is_active": bool(current_user.is_active),
    }


@router.post("/", response_model=ItineraryResponse)
def create_itinerary(payload: ItineraryCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    it = Itinerary(name=payload.name, owner_id=current_user.id, start_date=payload.start_date, end_date=payload.end_date)
    db.add(it)
    db.commit()
    db.refresh(it)
    return it


@router.get("/", response_model=List[ItineraryResponse])
def list_my_itineraries(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Itinerary).filter(Itinerary.owner_id == current_user.id).order_by(Itinerary.id.desc()).all()


@router.get("/{itinerary_id}")
def get_itinerary(itinerary_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    it = db.get(Itinerary, itinerary_id)
    if not it:
        raise HTTPException(status_code=404, detail="Itinerary not found")

    is_participant = (it.owner_id == current_user.id) or (current_user in it.co_travellers) or current_user.is_admin
    if not is_participant:
        raise HTTPException(status_code=403, detail="Not allowed")

    return {
        "id": it.id,
        "name": it.name,
        "start_date": it.start_date,
        "end_date": it.end_date,
        "owner_id": it.owner_id,
        "co_travellers": [u.id for u in it.co_travellers],
        "items": it.items,
    }


@router.put("/{itinerary_id}", response_model=ItineraryResponse)
def update_itinerary(itinerary_id: int, payload: ItineraryCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    it = db.get(Itinerary, itinerary_id)
    if not it:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    if it.owner_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Only owner or admin can update itinerary")

    it.name = payload.name
    it.start_date = payload.start_date
    it.end_date = payload.end_date
    db.add(it)
    db.commit()
    db.refresh(it)
    return it


@router.delete("/{itinerary_id}")
def delete_itinerary(itinerary_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    it = db.get(Itinerary, itinerary_id)
    if not it:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    if it.owner_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Only owner or admin can delete itinerary")

    db.delete(it)
    db.commit()
    return {"ok": True}


@router.post("/{itinerary_id}/co_travellers")
def add_co_traveller(itinerary_id: int, payload: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # payload: {"user_email": "..."} or {"user_id": ..}
    it = db.get(Itinerary, itinerary_id)
    if not it:
        raise HTTPException(status_code=404, detail="Itinerary not found")

    if it.owner_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Only owner or admin can add co-travellers")

    user = None
    if payload.get("user_id"):
        user = db.get(User, payload.get("user_id"))
    elif payload.get("user_email"):
        user = db.query(User).filter(User.email == payload.get("user_email")).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    it.co_travellers.append(user)
    db.add(it)
    db.commit()
    return {"ok": True}


@router.delete("/{itinerary_id}/co_travellers/{user_id}")
def remove_co_traveller(itinerary_id: int, user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    it = db.get(Itinerary, itinerary_id)
    if not it:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    if it.owner_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Only owner or admin can remove co-travellers")

    user = db.get(User, user_id)
    if not user or user not in it.co_travellers:
        raise HTTPException(status_code=404, detail="Co-traveller not found")

    it.co_travellers.remove(user)
    db.add(it)
    db.commit()
    return {"ok": True}


@router.post("/{itinerary_id}/items")
def add_itinerary_item(itinerary_id: int, payload: ItineraryItemCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    it = db.get(Itinerary, itinerary_id)
    if not it:
        raise HTTPException(status_code=404, detail="Itinerary not found")

    # only owner or admin
    if it.owner_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Only owner or admin can add items")

    item = ItineraryItem(itinerary_id=it.id, place_id=payload.place_id, day=payload.day, order=payload.order, note=payload.note)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.get("/{itinerary_id}/items", response_model=List[ItineraryItemResponse])
def list_itinerary_items(itinerary_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    it = db.get(Itinerary, itinerary_id)
    if not it:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    is_participant = (it.owner_id == current_user.id) or (current_user in it.co_travellers) or current_user.is_admin
    if not is_participant:
        raise HTTPException(status_code=403, detail="Not allowed")
    return db.query(ItineraryItem).filter(ItineraryItem.itinerary_id == itinerary_id, ItineraryItem.is_active == True).order_by(ItineraryItem.day.asc(), ItineraryItem.order.asc()).all()  # noqa: E712


@router.delete("/{itinerary_id}/items/{item_id}")
def remove_itinerary_item(itinerary_id: int, item_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    it = db.get(Itinerary, itinerary_id)
    if not it:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    if it.owner_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Only owner or admin can remove items")

    item = db.get(ItineraryItem, item_id)
    if not item or item.itinerary_id != itinerary_id:
        raise HTTPException(status_code=404, detail="Item not found")

    # soft delete
    item.is_active = False
    db.add(item)
    db.commit()
    return {"ok": True}
