from sqlalchemy.orm import Session
from models.friend import Friend
from schemas.friend_schema import FriendCreate

def get_friends_by_user(db: Session, user_id: str):
    return db.query(Friend).filter((Friend.idSelf == user_id) | (Friend.idFriend == user_id)).all()

def create_friend(db: Session, friend: FriendCreate):
    # Tạo đối tượng Friend từ dữ liệu đầu vào
    db_friend = Friend(idSelf=friend.idSelf, idFriend=friend.idFriend, isAccept=friend.isAccept)
    db.add(db_friend)
    db.commit()
    db.refresh(db_friend)
    return db_friend

def delete_friend(db: Session, id_self: str, id_friend: str):
    friend = db.query(Friend).filter(Friend.idSelf == id_self, Friend.idFriend == id_friend).first()
    if not friend:
        return False
    db.delete(friend)
    db.commit()
    return True