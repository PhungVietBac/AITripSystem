from pydantic import BaseModel

class NotificationBase(BaseModel):
    content: str
    isRead: bool

class NotificationResponse(NotificationBase):
    idNotify: str
    idUser: str

    class Config:
        from_attributes = True

class NotificationCreate(NotificationBase):
    idUser: str
    IsRead: bool | None = False

class NotificationUpdate(NotificationBase):
    content: str | None = None