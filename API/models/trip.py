from sqlalchemy import Column, String, DateTime
from ..database import Base

class Trip(Base):
    __tablename__ = "Trips"

    idTrip = Column(String, primary_key=True, index=True)
    name = Column(String)
    startDate = Column(DateTime, index=True)
    endDate = Column(DateTime)