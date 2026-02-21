from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.country import Country
from app.models.state import State
from app.models.city import City

router = APIRouter(
    prefix="/location-sync",
    tags=["Location Sync"],
    # Require login for every endpoint in this router
    dependencies=[Depends(get_current_user)],
)


# Test endpoint
@router.get("/test")
def test():
    return {"message": "location sync working"}


# Add country manually
@router.post("/countries")
def create_country(name: str, db: Session = Depends(get_db)):

    existing = db.query(Country).filter(Country.name == name).first()

    if existing:
        return {"message": "Country already exists"}

    country = Country(name=name)

    db.add(country)
    db.commit()
    db.refresh(country)

    return {
        "message": "Country created",
        "id": country.id,
        "name": country.name
    }


# Get all countries
@router.get("/countries")
def get_countries(db: Session = Depends(get_db)):

    countries = db.query(Country).all()

    return countries


# Add state
@router.post("/states")
def create_state(name: str, country_id: int, db: Session = Depends(get_db)):

    state = State(
        name=name,
        country_id=country_id
    )

    db.add(state)
    db.commit()
    db.refresh(state)

    return state


# Add city
@router.post("/cities")
def create_city(name: str, state_id: int, db: Session = Depends(get_db)):

    city = City(
        name=name,
        state_id=state_id
    )

    db.add(city)
    db.commit()
    db.refresh(city)

    return city


# Get all cities
@router.get("/cities")
def get_cities(db: Session = Depends(get_db)):

    return db.query(City).all()
