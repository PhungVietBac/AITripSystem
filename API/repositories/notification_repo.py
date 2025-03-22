from sqlalchemy.orm import Session
from models.notification import Notification
from models.user import User
from schemas.notification_schema import NotificationUpdate, NotificationCreate
import random

# Get all notifications
def get_notifications(db: Session):
    return db.query(Notification).all()

# Get notifications by
def get_notification_by(db: Session, select: str, lookup: str):
    if select == "idNotify":
        return db.query(Notification).filter(Notification.idNotify == lookup).first()
    elif select == "idUser":
        return db.query(Notification).filter(Notification.idUser == lookup).all()
    else:
        return None


# Post a new notification
def create_notification(db: Session, idUser: str, notification: NotificationCreate):
    user = db.query(User).filter(User.idUser == idUser).first()
    if not user:
        return None
    
    idNotify = ""
    while not idNotify or get_notification_by(db, "idNotify", idNotify):
        temp = random.randint(1, 9999)
        idNotify = f"NTF{temp:04d}"

    db_notification = Notification(idNotify = idNotify, idUser = idUser, content = notification.content, isRead = notification.isRead)
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)

    return db_notification

# Update a notification
def update_notification(db: Session, idNotify: str, notification: NotificationUpdate):
    db_notification = get_notification_by(db, "idNotify", idNotify)

    if not db_notification:
        return None

    for key, value in notification.model_dump(exclude_unset=True).items():
        setattr(db_notification, key, value)
    
    db.commit()
    db.refresh(db_notification)
    return db_notification

# Mark all notifications as read by user
def mark_all_notifications_as_read(db: Session, idUser: str):
    db_notifications = db.query(Notification).filter(Notification.idUser == idUser).all()

    for db_notification in db_notifications:
        db_notification.isRead = True
    
    db.commit()
    
    for db_notification in db_notifications:
        db.refresh(db_notification)
    
    return db_notifications

# Delete a notification
def delete_notification(db: Session, idNotify: str):
    db_notification = get_notification_by(db, "idNotify", idNotify)

    if not db_notification:
        return None
    
    db.delete(db_notification)
    db.commit()
    return db_notification

# Delete all notifications by user
def delete_notifications_by_user(db: Session, idUser: str):
    db_notifications = db.query(Notification).filter(Notification.idUser == idUser).all()
    for db_notification in db_notifications:
        db.delete(db_notification)

    db.commit()
    return db_notifications