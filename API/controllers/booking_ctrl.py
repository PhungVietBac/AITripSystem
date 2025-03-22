from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from schemas.booking_schema import BookingCreate, BookingUpdate, BookingResponse
from repositories import booking_repo
from models.user import User
from models.place import Place
from controllers.auth_ctrl import get_current_user

router = APIRouter()

@router.get("/bookings/", response_model=list[BookingResponse])
def get_bookings(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    return booking_repo.get_bookings(db)

@router.get("/bookings", response_model=BookingResponse)
def get_booking_by_id(idBooking: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    booking = booking_repo.get_booking_by_id(db, idBooking)
    if booking is None:
        raise HTTPException(404, "Booking not found")
    
    return booking

@router.get("/bookings/{select}", response_model=list[BookingResponse])
def get_booking_by(select: str, lookup: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    booking = booking_repo.get_booking_by(db, select, lookup)
    if booking == []:
        raise HTTPException(404, "Booking not found")
    
    return booking

@router.post("/bookings/", response_model=BookingResponse)
def create_new_booking(booking: BookingCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    # Tạo booking nếu kiểm tra thành công
    return booking_repo.create_booking(db, booking)

@router.put("/bookings/", response_model=BookingResponse)
def update_booking(idBooking: str, booking: BookingUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    return booking_repo.update_booking(db, idBooking, booking)

@router.delete("/bookings/", response_model=BookingResponse)
def delete_booking(id_booking: str, id_user: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    return booking_repo.delete_booking(db, id_booking, id_user)