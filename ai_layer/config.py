import os

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

ITIN_GROQ_API_KEY = os.getenv("ITIN_GROQ_API_KEY", "")
ITIN_GROQ_MODEL = os.getenv("ITIN_GROQ_MODEL", "llama-3.3-70b-versatile")
ITIN_TEMPERATURE = float(os.getenv("ITIN_TEMPERATURE", "0.5"))
ITIN_MAX_ITEMS_PER_DAY = int(os.getenv("ITIN_MAX_ITEMS_PER_DAY", "6"))

JWT_SECRET = os.getenv("JWT_SECRET", "change-me")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "120"))

AUTH_CSV_PATH = os.getenv("AUTH_CSV_PATH", "data/users.csv")
ITIN_STORAGE_DIR = os.getenv("ITIN_STORAGE_DIR", "data/itineraries")

MMS_MODEL = os.getenv("MMS_MODEL", "facebook/mms-1b-all")
FFMPEG_PATH = os.getenv("FFMPEG_PATH", "")