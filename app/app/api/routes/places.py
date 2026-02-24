
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.place import Place
from app.models.place_media import PlaceMedia
from app.models.city import City
from app.services.opentripmap_service import fetch_places_for_city
from app.core.security import get_current_admin, get_current_user
from app.schemas.place import PlaceCreate, PlaceUpdate, PlaceResponse, PlaceMediaResponse
from app.services.google_drive_service import upload_file, file_id_to_view_link
import os


router = APIRouter(
    prefix="/places",
    tags=["Places"],
    # Require login for every endpoint in this router
    dependencies=[Depends(get_current_user)],
)


@router.get("/", response_model=List[PlaceResponse])
def list_places(city_id: Optional[int] = None, active_only: bool = True, db: Session = Depends(get_db)):
    q = db.query(Place)
    if city_id:
        q = q.filter(Place.city_id == city_id)
    if active_only:
        q = q.filter(Place.is_active == True)  # noqa: E712
    return q.all()


@router.get("/{place_id}", response_model=PlaceResponse)
def get_place(place_id: int, db: Session = Depends(get_db)):
    place = db.get(Place, place_id)
    if not place:
        raise HTTPException(status_code=404, detail="Place not found")
    return place


@router.post("/", response_model=PlaceResponse)
def create_place(payload: PlaceCreate, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    """Admin-only create endpoint."""
    place = Place(
        name=payload.name,
        description=payload.description,
        latitude=payload.latitude,
        longitude=payload.longitude,
        city_id=payload.city_id,
    )
    db.add(place)
    db.commit()
    db.refresh(place)

    for url in payload.media or []:
        pm = PlaceMedia(url=url, place_id=place.id)
        db.add(pm)

    db.commit()

    return place


@router.put("/{place_id}", response_model=PlaceResponse)
def update_place(place_id: int, payload: PlaceUpdate, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    place = db.get(Place, place_id)
    if not place:
        raise HTTPException(status_code=404, detail="Place not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(place, field, value)

    db.add(place)
    db.commit()
    db.refresh(place)
    return place


@router.get("/{place_id}/media", response_model=List[PlaceMediaResponse])
def list_place_media(place_id: int, db: Session = Depends(get_db)):
    place = db.get(Place, place_id)
    if not place:
        raise HTTPException(status_code=404, detail="Place not found")
    return place.media


@router.post("/{place_id}/media")
def add_place_media_by_url(place_id: int, payload: dict, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    url = payload.get("url")
    if not url:
        raise HTTPException(status_code=400, detail="Missing url")
    place = db.get(Place, place_id)
    if not place:
        raise HTTPException(status_code=404, detail="Place not found")
    pm = PlaceMedia(url=url, place_id=place.id)
    db.add(pm)
    db.commit()
    db.refresh(pm)
    return pm


@router.post("/{place_id}/media/upload")
async def upload_place_media(place_id: int, file: UploadFile = File(...), db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    """Admin-only: upload an image/file to Google Drive and attach it to a Place."""
    place = db.get(Place, place_id)
    if not place:
        raise HTTPException(status_code=404, detail="Place not found")

    tmp_dir = os.getenv("TMP", "/tmp")
    local_path = os.path.join(tmp_dir, file.filename)
    with open(local_path, "wb") as f:
        f.write(await file.read())

    credentials = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    meta = upload_file(local_path, credentials_json=credentials)
    link = meta.get("webViewLink") or file_id_to_view_link(meta.get("id"))

    pm = PlaceMedia(url=link, place_id=place.id)
    db.add(pm)
    db.commit()
    db.refresh(pm)
    return {"media_id": pm.id, "url": pm.url, "drive_file_id": meta.get("id")}


@router.post("/populate_from_opentripmap")
async def populate_from_opentripmap(city_name: str, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    """Fetch places from OpenTripMap for a city and insert into DB.

    Requires `OPENTRIPMAP_KEY` configured. This will create Place and PlaceMedia
    records when available. Limit defaults to 20.
    """
    places = await fetch_places_for_city(city_name)
    inserted = 0
    for p in places:
        # Expect p keys: name, lat, lon, description, media (list of urls)
        if not p.get("name"):
            continue
        place = Place(
            name=p.get("name"),
            description=p.get("description"),
            latitude=p.get("lat"),
            longitude=p.get("lon"),
            city_id=None
        )
        db.add(place)
        db.commit()
        db.refresh(place)

        for url in p.get("media", []):
            pm = PlaceMedia(url=url, place_id=place.id)
            db.add(pm)

        db.commit()
        inserted += 1

    return {"inserted": inserted}


@router.post("/{place_id}/toggle")
def toggle_place(place_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    place = db.get(Place, place_id)
    if not place:
        raise HTTPException(status_code=404, detail="Place not found")
    place.is_active = not bool(place.is_active)
    db.add(place)
    db.commit()
    return {"id": place.id, "is_active": place.is_active}
