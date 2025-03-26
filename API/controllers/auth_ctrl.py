from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from jose import jwt
from database import get_db
from models.token import Token
import auth

router = APIRouter()

# Config security with OAuth2
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/login")

# API register user
@router.post("/register")
def register(username: str, password: str, db: Session = Depends(get_db)):
    existing_user = db.query(Token).filter(Token.username == username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_pw = auth.hash_password(password)
    user = Token(username=username, hashed_password=hashed_pw)
    db.add(user)
    db.commit()
    return {"message": "User registered successfully"}

# API login user
@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(Token).filter(Token.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    access_token = auth.create_access_token({"sub": user.username}, timedelta(minutes=30))
    return {"access_token": access_token, "token_type": "bearer"}

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except jwt.JWTError:
        raise credentials_exception
    
    user = db.query(Token).filter(Token.username == username).first()
    if user is None:
        raise credentials_exception
    
    return user
    