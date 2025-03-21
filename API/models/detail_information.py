from fastapi import FastAPI
from sqlalchemy import Column, String, DateTime
from database import Base

class DetailInformation(Base):
    # Table name
    __tablename__ = "DetailInformation"

    idDetail = Column(String, primary_key=True, index=True)
    idPlace = Column(String) # Foreign key
    idTrip = Column(String) # Foreign key
    startTime = Column(DateTime)
    endTime = Column(DateTime)
    note = Column(String)
    