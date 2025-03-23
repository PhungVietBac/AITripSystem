from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemas import friend_schema as friend_schema
from repositories import friend_repo as friend_repo
from models.user import User

router = APIRouter()

@router.get("/friends/{user_id}", response_model=list[friend_schema.FriendResponse])
def get_friends(user_id: str, db: Session = Depends(get_db)):
    # Kiểm tra user_id
    user = db.query(User).filter(User.IDUser == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Lấy danh sách bạn bè
    friends = friend_repo.get_friends_by_user(db, user_id)
    if not friends:
        raise HTTPException(status_code=404, detail="No friends found for this user")
    return friends

@router.post("/friends/", response_model=friend_schema.FriendResponse)
def create_new_friend(friend: friend_schema.FriendCreate, db: Session = Depends(get_db)):
    # Kiểm tra idSelf
    user_self = db.query(User).filter(User.IDUser == friend.idSelf).first()
    if not user_self:
        raise HTTPException(status_code=404, detail="User (idSelf) not found")

    # Kiểm tra idFriend
    user_friend = db.query(User).filter(User.IDUser == friend.idFriend).first()
    if not user_friend:
        raise HTTPException(status_code=404, detail="User (idFriend) not found")

    # Kiểm tra không cho phép kết bạn với chính mình
    if friend.idSelf == friend.idFriend:
        raise HTTPException(status_code=400, detail="Cannot add yourself as a friend")

    # Tạo quan hệ bạn bè
    return friend_repo.create_friend(db, friend)

@router.delete("/friends/{id_self}/{id_friend}", response_model=dict)
def delete_friend(id_self: str, id_friend: str, db: Session = Depends(get_db)):
    # Kiểm tra idSelf
    user_self = db.query(User).filter(User.IDUser == id_self).first()
    if not user_self:
        raise HTTPException(status_code=404, detail="User (idSelf) not found")

    # Kiểm tra idFriend
    user_friend = db.query(User).filter(User.IDUser == id_friend).first()
    if not user_friend:
        raise HTTPException(status_code=404, detail="User (idFriend) not found")

    # Xóa quan hệ bạn bè
    success = friend_repo.delete_friend(db, id_self, id_friend)
    if not success:
        raise HTTPException(status_code=404, detail="Friend relationship not found")
    return {"message": "Friend relationship deleted successfully"}