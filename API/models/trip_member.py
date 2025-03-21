from sqlalchemy import Column, String, ForeignKey
from database import Base

class TripMember(Base):
    __tablename__ = "TripMembers"

    idUser = Column(String(6), ForeignKey("Users.IDUser"), primary_key=True)
    idTrip = Column(String(6), ForeignKey("Trips.IDTrip"), primary_key=True)