from sqlalchemy import Column, String, Boolean, ForeignKey
from database import Base

class Notification(Base):
    __tablename__ = "Notifications"

    idNotf = Column(String, primary_key=True, index=True)
    idUser = Column(String, ForeignKey("Users.IDUser"))
    content = Column(String)
    isRead = Column(Boolean)