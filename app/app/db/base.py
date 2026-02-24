from app.core.database import Base

# Import ALL models here so SQLAlchemy registers them

from app.models.country import Country
from app.models.state import State
from app.models.city import City
from app.models.place import Place
from app.models.place_media import PlaceMedia
