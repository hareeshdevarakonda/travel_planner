import os
from dotenv import load_dotenv

load_dotenv()

class AISettings:
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
    REQUEST_TIMEOUT_SEC: int = int(os.getenv("AI_TIMEOUT_SEC", "60"))

    MMS_MODEL: str = os.getenv("MMS_MODEL", "facebook/mms-1b-all")

settings = AISettings()
