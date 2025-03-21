from sqlalchemy import Column, String, DateTime
from sqlalchemy.orm import relationship 
from database import Base

class Trip(Base):
    __tablename__ = "Trips"

    idTrip = Column(String(6), primary_key=True, index=True)
    Name = Column(String(50), nullable=False)
    StartDate = Column(DateTime, nullable=False)
    EndDate = Column(DateTime, nullable=True)

    users = relationship("User", secondary="TripMembers", back_populates="trips")
    reviews = relationship("Review", back_populates="trip")  
