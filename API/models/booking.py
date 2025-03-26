from sqlalchemy import Column, String, DateTime, PrimaryKeyConstraint
from database import Base

class Booking(Base):
    # Table name
    __tablename__ = "Bookings"

    idBooking = Column(String(6), index=True)
    idPlace = Column(String(6), index=True)
    idUser = Column(String(6), index=True)
    date = Column(DateTime, index=True)
    status = Column(String(100))

    # primary key = idbooking, idplace, iduser
    __table_args__ = (
        PrimaryKeyConstraint('idBooking', 'idUser'),
    )