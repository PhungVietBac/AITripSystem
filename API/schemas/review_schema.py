from pydantic import BaseModel

class ReviewBase(BaseModel):
    idTrip: str
    idUser: str
    comment: str
    rating: int  

class ReviewResponse(ReviewBase):
    idReview: str
    
    class Config:
        from_attributes = True
class ReviewCreate(ReviewBase):
    comment: str | None = None

class ReviewUpdate(ReviewBase):
    comment: str | None = None
    rating: int | None = None
