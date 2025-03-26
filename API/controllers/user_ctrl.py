from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from schemas import user_schema
from repositories import user_repo
from database import get_db
from controllers.auth_ctrl import get_current_user

router = APIRouter()

# Get all users
@router.get("/users/", response_model=list[user_schema.UserResponse])
def get_users(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    return user_repo.get_users(db)

# Get a user by
@router.get("/users/{select}", response_model=user_schema.UserResponse)
def get_user_by(select: str, lookup: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    user = user_repo.get_user_by(db=db, select=select, lookup=lookup)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user

# Post a new user
@router.post("/users/", response_model=user_schema.UserResponse)
def create_user(user: user_schema.UserCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    return user_repo.create_user(db=db, user=user)

# Update a user
@router.put("/users/{idUser}", response_model=user_schema.UserResponse)
def update_user(idUser: str, user: user_schema.UserUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    return user_repo.update_user(db=db, idUser=idUser, user=user)

# Delete a user
@router.delete("/users/{idUser}", response_model=user_schema.UserResponse)
def delete_user(idUser: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    return user_repo.delete_user(db=db, idUser=idUser)