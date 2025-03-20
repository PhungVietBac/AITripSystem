from pydantic import BaseModel

class FriendBase(BaseModel):
    idSelf: str
    idFriend: str
    isAccept: bool

class FriendResponse(FriendBase):
    class Config:
        from_attributes = True

class FriendCreate(FriendBase):
    isAccept: bool = False