from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemas.booking_schema import BookingCreate, BookingUpdate, BookingResponse
import repositories.booking_repo as booking_repo
from models.user import User
from models.place import Place
router = APIRouter()

@router.post("/bookings/", response_model=BookingResponse)
def create_new_booking(booking: BookingCreate, db: Session = Depends(get_db)):
    # Kiểm tra IDUser
    user = db.query(User).filter(User.idUser == booking.idUser).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Kiểm tra idPlace
    place = db.query(Place).filter(Place.idPlace == booking.idPlace).first()
    if not place:
        raise HTTPException(status_code=404, detail="Place not found")

    # Tạo booking nếu kiểm tra thành công
    return booking_repo.create_booking(db, booking)

@router.put("/bookings/{id_booking}/{id_place}/{id_user}", response_model=BookingResponse)
def update_booking(id_booking: str, id_place: str, id_user: str, booking: BookingUpdate, db: Session = Depends(get_db)):
    # Kiểm tra idUser
    user = db.query(User).filter(User.idUser == booking.idUser).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Kiểm tra idPlace
    place = db.query(Place).filter(Place.idPlace == booking.idPlace).first()
    if not place:
        raise HTTPException(status_code=404, detail="Place not found")

    # Cập nhật booking nếu kiểm tra thành công
    updated_booking = booking_repo.update_booking(db, id_booking, id_place, id_user, booking)
    if not updated_booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return updated_booking

@router.delete("/bookings/{id_booking}/{id_place}/{id_user}", response_model=dict)
def delete_booking(id_booking: str, id_place: str, id_user: str, db: Session = Depends(get_db)):
    # Kiểm tra idUser
    user = db.query(User).filter(User.idUser == id_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Kiểm tra idPlace
    place = db.query(Place).filter(Place.idPlace == id_place).first()
    if not place:
        raise HTTPException(status_code=404, detail="Place not found")

    # Xóa booking nếu kiểm tra thành công
    success = booking_repo.delete_booking(db, id_booking, id_place, id_user)
    if not success:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {"message": "Booking deleted successfully"}