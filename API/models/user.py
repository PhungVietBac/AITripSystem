from sqlalchemy import Column, String, Integer, Text
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "Users"

    idUser = Column(String(6), primary_key=True, index=True)
    Name = Column(String(50), nullable=False)
    Username = Column(String(50), unique=True, nullable=False)
    Password = Column(String(200), nullable=False)
    Gender = Column(Integer, nullable=True)
    Email = Column(String(50), unique=True, nullable=True)
    PhoneNumber = Column(String(10), nullable=True)
    Avatar = Column(Text, nullable=True)
    Theme = Column(Integer, nullable=True)
    Language = Column(Integer, nullable=True)

    trips = relationship("Trip", secondary="TripMembers", back_populates="users")
    reviews = relationship("Review", back_populates="user")