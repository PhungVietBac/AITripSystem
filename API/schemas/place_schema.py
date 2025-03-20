from pydantic import BaseModel

class PlaceBase(BaseModel):
    name: str
    country: str
    city: str
    address: str
    description: str
    image: str
    rating: int
    placeType: int

class PlaceResponse(PlaceBase):
    idPlace: str

    class Config:
        from_attributes = True

class PlaceCreate(PlaceBase):
    description: str | None
    image: str | None

class PlaceUpdate(PlaceBase):
    name: str | None = None
    country: str | None = None
    city: str | None = None
    address: str | None = None
    description: str | None = None
    image: str | None = None
    rating: int | None = None
    placeType: int | None = None