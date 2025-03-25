from fastapi import FastAPI
from sqlalchemy import Column, String, DateTime, ForeignKey
from database import Base

class DetailInformation(Base):
    # Table name
    __tablename__ = "DetailInformations"

    idDetail = Column(String, primary_key=True, index=True)
    idPlace = Column(String, ForeignKey("Places.idPlace")) # Foreign key
    idTrip = Column(String, ForeignKey("Trips.idTrip")) # Foreign key
    startTime = Column(DateTime)
    endTime = Column(DateTime)
    note = Column(String)
    