from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.country import Country
from app.models.state import State
from app.models.city import City
from app.services.countriesnow_service import fetch_countries, fetch_states, fetch_cities


router = APIRouter(
    prefix="/locations",
    tags=["Locations"],
    # Require login for every endpoint in this router
    dependencies=[Depends(get_current_user)],
)


@router.get("/countries")
def list_countries(db: Session = Depends(get_db)):
    return db.query(Country).all()


@router.post("/countries/populate")
async def populate_countries(db: Session = Depends(get_db)):
    data = await fetch_countries()
    inserted = 0
    for item in data:
        name = item.get("name") or item.get("country")
        if not name:
            continue
        existing = db.query(Country).filter(Country.name == name).first()
        if existing:
            continue
        db.add(Country(name=name))
        inserted += 1

    db.commit()

    return {"inserted": inserted}


@router.get("/countries/{country_id}/states")
def list_states(country_id: int, db: Session = Depends(get_db)):
    country = db.get(Country, country_id)
    if not country:
        raise HTTPException(status_code=404, detail="Country not found")
    return country.states


@router.post("/countries/{country_name}/states/populate")
async def populate_states(country_name: str, db: Session = Depends(get_db)):
    country = db.query(Country).filter(Country.name == country_name).first()
    if not country:
        raise HTTPException(status_code=404, detail="Country not found")

    states = await fetch_states(country_name)
    inserted = 0
    for s in states:
        name = s.get("name") if isinstance(s, dict) else s
        if not name:
            continue
        existing = db.query(State).filter(State.name == name, State.country_id == country.id).first()
        if existing:
            continue
        db.add(State(name=name, country_id=country.id))
        inserted += 1

    db.commit()
    return {"inserted": inserted}


@router.post("/countries/{country_name}/states/{state_name}/cities/populate")
async def populate_cities(country_name: str, state_name: str, db: Session = Depends(get_db)):
    country = db.query(Country).filter(Country.name == country_name).first()
    if not country:
        raise HTTPException(status_code=404, detail="Country not found")

    state = db.query(State).filter(State.name == state_name, State.country_id == country.id).first()
    if not state:
        raise HTTPException(status_code=404, detail="State not found")

    cities = await fetch_cities(country_name, state_name)
    inserted = 0
    for c in cities:
        name = c if isinstance(c, str) else c.get("name")
        if not name:
            continue
        existing = db.query(City).filter(City.name == name, City.state_id == state.id).first()
        if existing:
            continue
        db.add(City(name=name, state_id=state.id))
        inserted += 1

    db.commit()
    return {"inserted": inserted}


@router.get("/states/{state_id}/cities")
def list_cities(state_id: int, db: Session = Depends(get_db)):
    state = db.get(State, state_id)
    if not state:
        raise HTTPException(status_code=404, detail="State not found")
    return state.cities
