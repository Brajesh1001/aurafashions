from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List
from functools import lru_cache


class Settings(BaseSettings):
    # App Settings
    PROJECT_NAME: str = "AuraFashions API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database (SQLite for local dev, PostgreSQL for production)
    DATABASE_URL: str = "sqlite:///./ekart.db"
    
    # JWT
    SECRET_KEY: str = "change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Google OAuth
    GOOGLE_CLIENT_ID: str = ""
    
    # CORS Configuration
    # Use a comma-separated string in .env and split it
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://aurafashions-844d1.web.app",
        "https://aurafashions-844d1.firebaseapp.com"
    ]
    
    # Development Mode - Set to True to bypass Google OAuth
    DEV_MODE: bool = False
    
    model_config = SettingsConfigDict(
        env_file=(".env", ".env.local"),
        case_sensitive=True,
        extra="ignore"
    )


@lru_cache()
def get_settings():
    return Settings()


settings = get_settings()

