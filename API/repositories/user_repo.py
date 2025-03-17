from sqlalchemy.orm import Session
from models.user import User
from schemas.user_schema import UserCreate, UserUpdate
import random

# Get all users
def get_users(db: Session):
    return db.query(User)

# Get a user by
def get_user_by(db: Session, select: str, lookup: str):
    if select == "idUser":
        return db.query(User).filter(User.idUser == lookup).first()
    elif select == "username":
        return db.query(User).filter(User.username == lookup).first()
    elif select == "email":
        return db.query(User).filter(User.email == lookup).first()
    elif select == "phone":
        return db.query(User).filter(User.phone == lookup).first()
    else:
        return None

# Post a new user
def create_user(db: Session, user: UserCreate):
    # Check if the user already exists
    _user = get_users(db).filter(User.username == user.username or User.email == user.email or User.phone == user.phone).first()
    if _user:
        return None
    
    # If the user does not exist, create a new user    
    idUser = ""
    while not idUser or get_user_by(db, "idUser", idUser):
        temp = random.randint(0, 9999)
        if temp < 10:
            idUser = "US000" + temp
        elif temp < 100:
            idUser = "US00" + temp
        elif temp < 1000:
            idUser = "US0" + temp
        else:
            idUser = "US" + temp
    
    db_user = User(idUser=idUser, name = user.name, username=user.username, password=user.password, gender = user.gender, email = user.email, phone = user.phone, avatar = user.avatar, theme = 0, language = 0)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Update a user
def update_user(db: Session, idUser: str, user: UserUpdate):
    db_user = get_user_by(db, "idUser", idUser)
    if not db_user:
        return None
    
    for key, value in user.dict(exclude_unset=True).items():
        if value:
            setattr(db_user, key, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user

# Delete a user
def delete_user(db: Session, idUser: str):
    db_user = get_user_by(db, "idUser", idUser)
    if not db_user:
        return None
    
    db.delete(db_user)
    db.commit()
    return db_user