from sqlalchemy import Column, String, DateTime
from sqlalchemy.orm import relationship 
from database import Base

class Trip(Base):
    __tablename__ = "Trips"

    idTrip = Column(String(6), primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    startDate = Column(DateTime, nullable=False, index=True)
    endDate = Column(DateTime, nullable=True, index=True)
