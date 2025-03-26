from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from repositories import notification_repo
from schemas.notification_schema import NotificationResponse, NotificationCreate, NotificationUpdate

router = APIRouter(
    prefix="/notifications",
    tags=["notifications"]
)

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
