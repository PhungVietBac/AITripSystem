from pydantic import BaseModel

class UserBase(BaseModel):
    name: str
    username: str
    gender: int
    email: str
    phone: str
    avatar: str
    theme: int = 0
    language: int = 0

class UserResponse(UserBase):
    idUser: str
    
    class Config:
        from_attributes = True

class UserCreate(UserBase):
    gender: int | None = None
    avatar: str | None = None
    language: int | None = None
    password: str

class UserUpdate(UserBase):
    name: str | None = None
    username: str | None = None
    email: str | None = None
    phone: str | None = None
    gender: int | None = None
    avatar: str | None = None
    theme: int | None = None
    language: int | None = None
    password: str | None = None