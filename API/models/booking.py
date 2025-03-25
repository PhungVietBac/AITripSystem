from sqlalchemy import Column, String, DateTime, PrimaryKeyConstraint
from database import Base

class Booking(Base):
    # Table name
    __tablename__ = "Booking"

    idBooking = Column(String)
    idPlace = Column(String)
    idUser = Column(String)
    date = Column(DateTime)
    status = Column(String)

    # primary key = idbooking, idplace, iduser
    __table_args__ = (
        PrimaryKeyConstraint('idBooking', 'idPlace', 'idUser'),
    )