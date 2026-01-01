from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Database (SQLite for local dev, PostgreSQL for production)
    DATABASE_URL: str = "sqlite:///./ekart.db"
    
    # JWT
    SECRET_KEY: str = "your-super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Google OAuth
    GOOGLE_CLIENT_ID: str = ""
    
    # CORS
    FRONTEND_URL: str = "http://localhost:5173"
    
    # Development Mode - Set to True to bypass Google OAuth
    DEV_MODE: bool = True
    
    class Config:
        env_file = ".env"


@lru_cache()
def get_settings():
    return Settings()


settings = get_settings()

