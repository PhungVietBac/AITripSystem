from sqlalchemy import Column, String, Integer, ForeignKey
from ..database import Base

class Review(Base):
    __tablename__ = "Reviews"

    idReview = Column(String, primary_key=True, index=True)
    idTrip = Column(String, ForeignKey("Trips.IDTrip"))
    idUser = Column(String, ForeignKey("Users.IDUser"))
    comment = Column(String)
    rating = Column(Integer)