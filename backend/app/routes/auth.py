from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from pydantic import BaseModel
from typing import Optional
from app.database import get_db
from app.models import User
from app.schemas import GoogleAuthRequest, TokenResponse, UserResponse
from app.auth.google import verify_google_token
from app.auth.jwt import create_access_token, get_current_user
from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])


class DevLoginRequest(BaseModel):
    """Request model for dev login"""
    name: str = "Dev User"
    email: str = "dev@aurafashions.com"
    is_admin: bool = False


@router.post("/google", response_model=TokenResponse)
async def google_auth(request: GoogleAuthRequest, db: Session = Depends(get_db)):
    """
    Authenticate user via Google OAuth
    - Verifies Google ID token
    - Creates user if not exists
    - Returns JWT access token
    """
    # In DEV_MODE, accept any token and create a dev user
    if settings.DEV_MODE:
        # Use token as email or default
        email = "dev@aurafashions.com"
        name = "Dev User"
        
        user = db.query(User).filter(User.email == email).first()
        if not user:
            user = User(
                email=email,
                name=name,
                picture=None,
                role="admin"  # Make dev user admin by default
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        
        access_token = create_access_token(
            data={"sub": str(user.id), "email": user.email},
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user=UserResponse.model_validate(user)
        )
    
    # Production: Verify Google token
    google_user = verify_google_token(request.token)
    
    # Check if user exists
    user = db.query(User).filter(User.email == google_user["email"]).first()
    
    if not user:
        # Create new user
        user = User(
            email=google_user["email"],
            name=google_user["name"],
            picture=google_user.get("picture"),
            role="user"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        # Update user info if changed
        if user.name != google_user["name"] or user.picture != google_user.get("picture"):
            user.name = google_user["name"]
            user.picture = google_user.get("picture")
            db.commit()
            db.refresh(user)
    
    # Create access token
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )


@router.post("/dev-login", response_model=TokenResponse)
async def dev_login(request: DevLoginRequest = DevLoginRequest(), db: Session = Depends(get_db)):
    """
    Development-only login endpoint.
    Allows login without Google OAuth for testing purposes.
    Only works when DEV_MODE=True
    """
    if not settings.DEV_MODE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Dev login is only available in development mode"
        )
    
    # Check if user exists
    user = db.query(User).filter(User.email == request.email).first()
    
    if not user:
        # Create new user
        user = User(
            email=request.email,
            name=request.name,
            picture=None,
            role="admin" if request.is_admin else "user"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    elif request.is_admin and user.role != "admin":
        # Update to admin if requested
        user.role = "admin"
        db.commit()
        db.refresh(user)
    
    # Create access token
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )


@router.get("/dev-mode")
async def check_dev_mode():
    """Check if dev mode is enabled"""
    return {"dev_mode": settings.DEV_MODE}


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current authenticated user info"""
    return current_user

