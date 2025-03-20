from pydantic import BaseModel
from datetime import datetime

class DetailInformationBase(BaseModel):
    idTrip: str
    idPlace: str
    startTime: datetime
    endTime: datetime
    note: str

class DetailResponse(DetailInformationBase):
    idDetail: str

    class Config:
        from_attributes = True

class DetailCreate(DetailInformationBase):
    note: str | None = None

class DetailUpdate(DetailInformationBase):
    startTime: datetime | None = None
    endTime: datetime | None = None
    note: str | None = None