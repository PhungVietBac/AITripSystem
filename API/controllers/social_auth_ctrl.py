from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from pydantic import BaseModel
from database import get_db
from models.token import Token
import auth
import requests

router = APIRouter()

class SocialLoginRequest(BaseModel):
    provider: str
    token: str
    email: str = None
    name: str = None

@router.post("/social-login")
async def social_login(request: SocialLoginRequest, db: Session = Depends(get_db)):
    """
    Handle social login from Google or Facebook
    """
    if request.provider not in ["google", "facebook"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported provider"
        )
    
    # Verify token with provider
    user_data = None
    if request.provider == "google":
        user_data = verify_google_token(request.token)
    
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid social token"
        )
    
    # Get email from token verification or request
    email = user_data.get("email") or request.email
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is required"
        )
    
    # Check if user exists
    user = db.query(Token).filter(Token.username == email).first()
    
    # If user doesn't exist, create a new one
    if not user:
        # Generate a random password for the user
        import secrets
        random_password = secrets.token_hex(16)
        hashed_password = auth.hash_password(random_password)
        
        user = Token(username=email, hashed_password=hashed_password)
        db.add(user)
        db.commit()
    
    # Generate access token
    access_token = auth.create_access_token(
        {"sub": user.username}, 
        timedelta(minutes=30)
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

def verify_google_token(token: str):
    """
    Verify Google token with Google API
    """
    try:
        response = requests.get(
            f"https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={token}"
        )
        if response.status_code == 200:
            return response.json()
            
        response = requests.get(
            f"https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {token}"}
        )
        if response.status_code == 200:
            return response.json()
            
        return None
    except Exception as e:
        print(f"Error verifying Google token: {e}")
        return None

