import requests as req
from google.oauth2 import id_token
from google.auth.transport import requests
from fastapi import HTTPException, status
from app.core.config import settings


def verify_google_token(token: str) -> dict:
    """
    Verify Google OAuth token and return user info.
    Supports both ID tokens and access tokens.
    
    Returns:
        dict with keys: email, name, picture, google_id
    """
    # First, try to verify as an ID token
    try:
        idinfo = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            settings.GOOGLE_CLIENT_ID
        )
        
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Invalid issuer')
        
        return {
            "email": idinfo.get("email"),
            "name": idinfo.get("name"),
            "picture": idinfo.get("picture"),
            "google_id": idinfo.get("sub")
        }
    except Exception:
        pass
    
    # If ID token verification fails, try as an access token
    try:
        # Use the access token to get user info from Google
        response = req.get(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            headers={'Authorization': f'Bearer {token}'}
        )
        
        if response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Google token"
            )
        
        userinfo = response.json()
        
        return {
            "email": userinfo.get("email"),
            "name": userinfo.get("name"),
            "picture": userinfo.get("picture"),
            "google_id": userinfo.get("sub")
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Failed to verify Google token: {str(e)}"
        )

