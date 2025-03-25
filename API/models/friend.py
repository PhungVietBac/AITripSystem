from sqlalchemy import Column, String, Boolean, ForeignKey
from database import Base

class Friend(Base):
    __tablename__ = "Friends"

    idSelf = Column(String, ForeignKey("Users.idUser"), primary_key=True)
    idFriend = Column(String, ForeignKey("Users.idUser"), primary_key=True)
    isAccept = Column(Boolean)