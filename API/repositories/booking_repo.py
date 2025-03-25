from sqlalchemy.orm import Session
from models.booking import Booking
from schemas.booking_schema import BookingCreate, BookingUpdate

def create_booking(db: Session, booking: BookingCreate):
    # Tạo ID cho booking (có thể dùng UUID hoặc logic khác để tạo ID)
    import uuid
    id_booking = f"B{str(uuid.uuid4())[:5]}"

    # Tạo đối tượng Booking từ dữ liệu đầu vào
    db_booking = Booking(
        idBooking=id_booking,
        idPlace=booking.idPlace,
        idUser=booking.idUser,
        date=booking.date,
        status=booking.status
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

def update_booking(db: Session, id_booking: str, id_place: str, id_user: str, booking_update: BookingUpdate):
    db_booking = db.query(Booking).filter(
        Booking.idBooking == id_booking,
        Booking.idPlace == id_place,
        Booking.idUser == id_user
    ).first()
    if not db_booking:
        return None

    # Cập nhật các trường
    db_booking.idPlace = booking_update.idPlace
    db_booking.idUser = booking_update.idUser
    db_booking.date = booking_update.date
    db_booking.status = booking_update.status

    db.commit()
    db.refresh(db_booking)
    return db_booking

def delete_booking(db: Session, id_booking: str, id_place: str, id_user: str):
    db_booking = db.query(Booking).filter(
        Booking.idBooking == id_booking,
        Booking.idPlace == id_place,
        Booking.idUser == id_user
    ).first()
    if not db_booking:
        return False
    db.delete(db_booking)
    db.commit()
    return True