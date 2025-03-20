from pydantic import BaseModel
from datetime import datetime

class BookingBase(BaseModel):
    idUser: str
    idPlace: str
    date: datetime
    status: int = 0 #Pending, success, failed

class BookingResponse(BookingBase):
    idBooking: str

    class Config:
        from_attributes = True

class BookingCreate(BookingBase):
    pass

class BookingUpdate(BookingBase):
    pass