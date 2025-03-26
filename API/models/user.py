from sqlalchemy import Column, String, Integer, LargeBinary
from sqlalchemy.orm import relationship 
from database import Base

class User(Base):
    __tablename__ = "Users"

    idUser = Column(String(6), primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    username = Column(String(50), unique=True, nullable=False, index=True)
    password = Column(String(200), nullable=False)
    gender = Column(Integer, nullable=True)
    email = Column(String(50), unique=True, nullable=True, index=True)
    phoneNumber = Column(String(10), nullable=True, index=True)
    avatar = Column(LargeBinary, nullable=True)
    theme = Column(Integer, nullable=True)
    language = Column(Integer, nullable=True)

