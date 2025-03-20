from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import schemas.friend_schema as friend_schema
import repositories.friend_repo as friend_repo

router = APIRouter()

@router.get("/friends/{user_id}", response_model=list[friend_schema.FriendResponse])
def get_friends(user_id: str, db: Session = Depends(get_db)):
    friends = friend_repo.get_friends_by_user(db, user_id)
    if not friends:
        raise HTTPException(status_code=404, detail="No friends found for this user")
    return friends

@router.post("/friends/", response_model=friend_schema.FriendResponse)
def create_new_friend(friend: friend_schema.FriendCreate, db: Session = Depends(get_db)):
    if friend.idSelf == friend.idFriend:
        raise HTTPException(status_code=400, detail="Cannot add yourself as a friend")
    return friend_repo.create_friend(db, friend)

@router.delete("/friends/{id_self}/{id_friend}", response_model=dict)
def delete_friend(id_self: str, id_friend: str, db: Session = Depends(get_db)):
    success = friend_repo.delete_friend(db, id_self, id_friend)
    if not success:
        raise HTTPException(status_code=404, detail="Friend relationship not found")
    return {"message": "Friend relationship deleted successfully"}