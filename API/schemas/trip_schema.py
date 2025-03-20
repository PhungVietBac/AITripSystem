from datetime import datetime
from pydantic import BaseModel

class TripBase(BaseModel):
    name: str
    startDate: datetime
    endDate: datetime
    
class TripResponse(TripBase):
    idTrip: str

    class Config:
        from_attributes = True

class TripCreate(TripBase):
    pass

class TripUpdate(TripBase):
    name: str | None = None
    startDate: datetime | None = None
    endDate: datetime | None = None