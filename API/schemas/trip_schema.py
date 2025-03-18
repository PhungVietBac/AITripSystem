from datetime import datetime
from pydantic import BaseModel

class TripBase(BaseModel):
    idTrip: str
    name: str
    startDate: datetime
    endDate: datetime
    
class TripCreate(TripBase):
    pass

class TripResponse(TripBase):
    pass