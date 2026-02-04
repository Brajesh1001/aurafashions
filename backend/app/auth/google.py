import requests as req
from google.oauth2 import id_token
from google.auth.transport import requests
from fastapi import HTTPException, status
from app.core.config import settings
from google.auth import jwt as auth_jwt

# Key URLs
FIREBASE_CERTS_URL = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"
GOOGLE_CERTS_URL = "https://www.googleapis.com/oauth2/v1/certs"

def verify_google_token(token: str) -> dict:
    """
    Verify Google or Firebase OAuth token and return user info.
    Tries both standard Google and Firebase certificates.
    """
    print(f"DEBUG: Verifying token (first 10 chars): {token[:10]}...")
    idinfo = None
    firebase_project_id = "aurafashions-844d1"
    
    # List of possible audiences (Google Client ID and Firebase Project ID)
    audiences = [settings.GOOGLE_CLIENT_ID, firebase_project_id]
    
    # List of certificate sources to try
    cert_urls = [GOOGLE_CERTS_URL, FIREBASE_CERTS_URL]

    # Try every combination of certificates and audiences until one works
    for cert_url in cert_urls:
        try:
            # Fetch certs for this attempt
            certs_resp = req.get(cert_url)
            certs = certs_resp.json()
            
            # Try to decode with current certs
            # We first check if the audience in the token is something we expect
            unverified_claims = auth_jwt.decode(token, verify=False)
            token_aud = unverified_claims.get('aud')
            
            if token_aud in audiences:
                # Verify using the specific certs and the audience from the token
                idinfo = auth_jwt.decode(
                    token, 
                    certs=certs, 
                    audience=token_aud
                )
                if idinfo:
                    break
        except Exception:
            continue

    if idinfo:
        return {
            "email": idinfo.get("email"),
            "name": idinfo.get("name") or idinfo.get("email", "").split("@")[0],
            "picture": idinfo.get("picture"),
            "google_id": idinfo.get("sub")
        }
    
    # Final fallback: Access Token check
    try:
        response = req.get(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            headers={'Authorization': f'Bearer {token}'}
        )
        if response.status_code == 200:
            userinfo = response.json()
            return {
                "email": userinfo.get("email"),
                "name": userinfo.get("name"),
                "picture": userinfo.get("picture"),
                "google_id": userinfo.get("sub")
            }
    except Exception:
        pass

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Unauthorized: Token verification failed"
    )
