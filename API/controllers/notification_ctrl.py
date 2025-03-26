from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from schemas import notification_schema
from repositories import notification_repo
from database import get_db
from controllers.auth_ctrl import get_current_user

router = APIRouter()

# Get all notifcations
@router.get("/notifications/", response_model=list[notification_schema.NotificationResponse])
def get_notifications(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    return notification_repo.get_notifications(db=db)

# Get notification by id
@router.get("/notifications", response_model=notification_schema.NotificationResponse)
def get_notification_by_id(idNotf: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    notf = notification_repo.get_notification_by_id(db=db, idNotf=idNotf)
    if notf is None:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    return notf

# Get notification by user
@router.get("/notifications/{idUser}", response_model=list[notification_schema.NotificationResponse])
def get_notification_by_user(idUser: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    notf = notification_repo.get_notification_by_user(db=db, idUser=idUser)
    if notf == []:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    return notf

# Post a new notification
@router.post("/notifications/", response_model=notification_schema.NotificationResponse)
def create_notification(notification: notification_schema.NotificationCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    return notification_repo.create_notification(db=db, notification=notification)

# Update a notification
@router.put("/notifications/{idNotify}", response_model=notification_schema.NotificationResponse)
def update_notification(idNotify: str, notification: notification_schema.NotificationUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    return notification_repo.update_notification(db=db, idNotify=idNotify, notification=notification)

# Mark all notifications as read by user
@router.put("/notifications/mark-all/{idUser}", response_model=list[notification_schema.NotificationResponse])
def mark_all_notifications_as_read(idUser: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    return notification_repo.mark_all_notifications_as_read(db=db, idUser=idUser)

# Delete a notification
@router.delete("/notifications/{idNotify}", response_model=notification_schema.NotificationResponse)
def delete_notification(idNotify: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    return notification_repo.delete_notification(db=db, idNotify=idNotify)

# Delete all notifications by user
@router.delete("/notifications/delete-all/{idUser}", response_model=list[notification_schema.NotificationResponse])
def delete_all_notifications_by_user(idUser: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    return notification_repo.delete_notifications_by_user(db=db, idUser=idUser)
# NEW
@router.get("/", response_model=List[NotificationResponse])
def get_notifications(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all notifications with pagination"""
    notifications = notification_repo.get_notifications(db, skip=skip, limit=limit)
    return notifications

@router.get("/{notification_id}", response_model=NotificationResponse)
def get_notification(notification_id: str, db: Session = Depends(get_db)):
    """Get a specific notification by ID"""
    notification = notification_repo.get_notification_by_id(db, notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    return notification

@router.get("/user/{user_id}", response_model=List[NotificationResponse])
def get_user_notifications(
    user_id: str,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all notifications for a specific user"""
    notifications = notification_repo.get_notifications_by_user(db, user_id, skip=skip, limit=limit)
    return notifications

@router.get("/user/{user_id}/unread", response_model=List[NotificationResponse])
def get_unread_notifications(
    user_id: str,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all unread notifications for a specific user"""
    notifications = notification_repo.get_unread_notifications(db, user_id, skip=skip, limit=limit)
    return notifications

@router.post("/", response_model=NotificationResponse)
def create_notification(notification: NotificationCreate, db: Session = Depends(get_db)):
    """Create a new notification"""
    db_notification = notification_repo.create_notification(db, notification)
    if not db_notification:
        raise HTTPException(status_code=400, detail="Could not create notification")
    return db_notification

@router.put("/{notification_id}", response_model=NotificationResponse)
def update_notification(notification_id: str, notification: NotificationUpdate, db: Session = Depends(get_db)):
    """Update a notification"""
    db_notification = notification_repo.update_notification(db, notification_id, notification)
    if not db_notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    return db_notification

@router.delete("/{notification_id}", response_model=NotificationResponse)
def delete_notification(notification_id: str, db: Session = Depends(get_db)):
    """Delete a notification"""
    db_notification = notification_repo.delete_notification(db, notification_id)
    if not db_notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    return db_notification

@router.put("/{notification_id}/read")
def mark_as_read(notification_id: str, db: Session = Depends(get_db)):
    """Mark a notification as read"""
    success = notification_repo.mark_as_read(db, notification_id)
    if not success:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"message": "Notification marked as read"}
