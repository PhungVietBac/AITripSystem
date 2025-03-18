from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import schemas.user_schema as user_schema
import repositories.user_repo as user_repo
from database import get_db

router = APIRouter()

# Post a new user
@router.post("/users/", response_model=user_schema.UserResponse)
def create_user(user: user_schema.UserCreate, db: Session = Depends(get_db)):
    return user_repo.create_user(db=db, user=user)

# Get all users
@router.get("/users/", response_model=list[user_schema.UserResponse])
def get_users(db: Session = Depends(get_db)):
    return user_repo.get_users(db)

# Get a user by
@router.get("/users/{select}", response_model=user_schema.UserResponse)
def get_user_by(select: str, lookup: str, db: Session = Depends(get_db)):
    user = user_repo.get_user_by(db=db, select=select, lookup=lookup)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user

# Post a new user
@router.post("/users/", response_model=user_schema.UserResponse)
def create_user(user: user_schema.UserCreate, db: Session = Depends(get_db)):
    user = user_repo.create_user(db=db, user=user)
    if user is None:
        raise HTTPException(status_code=422, detail="User already exists")
    
    return user

# Update a user
@router.put("/users/{select}", response_model=user_schema.UserResponse)
def update_user(idUser: str, user: user_schema.UserUpdate, db: Session = Depends(get_db)):
    user = user_repo.get_user_by(db=db, select="idUser", lookup=idUser)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    afterUsers = [
        user_repo.get_user_by(db=db, select="username", lookup=user.username),
        user_repo.get_user_by(db=db, select="email", lookup=user.email),
        user_repo.get_user_by(db=db, select="phone", lookup=user.phone)
    ]
    
    for afterUser in afterUsers:
        if afterUser and afterUser.idUser != idUser:
            raise HTTPException(status_code=422, detail="User already exists")
    
    return user_repo.update_user(db=db, user=user, user_update=user)

# Delete a user
@router.delete("/users/{select}", response_model=user_schema.UserResponse)
def delete_user(idUser: str, db: Session = Depends(get_db)):
    user = user_repo.get_user_by(db=db, select="idUser", lookup=idUser)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user_repo.delete_user(db=db, user=user)