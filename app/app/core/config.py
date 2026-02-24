from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    DATABASE_URL: str

    SECRET_KEY: str

    ALGORITHM: str

    REDIS_HOST: str
    REDIS_PORT: int

    AI_SERVICE_URL: str

    COUNTRIESNOW_API: str

    OPENTRIPMAP_API: str
    OPENTRIPMAP_KEY: str

    class Config:
        env_file = ".env"


settings = Settings()
