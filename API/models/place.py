from sqlalchemy import Column, String, Integer
from database import Base

class Place(Base):
    # Table name
    __tablename__ = "Places"

    idPlace = Column(String, primary_key=True, index=True)
    Name = Column(String)
    Country = Column(String)
    City = Column(String)
    Address = Column(String)
    Description = Column(String)
    Image = Column(String)  # URL
    Rating = Column(Integer)
    Type = Column(Integer)