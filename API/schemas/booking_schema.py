from pydantic import BaseModel
from datetime import datetime

class BookingBase(BaseModel):
    idPlace: str
    date: datetime
    status: int = 0 # 0: Pending, 1: Success, 2: Failed

class BookingResponse(BookingBase):
    idBooking: str

    class Config:
        from_attributes = True

class BookingCreate(BookingBase):
    pass

class BookingUpdate(BookingBase):
    pass