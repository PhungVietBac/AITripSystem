from sqlalchemy.orm import Session
from models import trip
from schemas import TripCreate, TripUpdate
from datetime import datetime

#tìm trong start_date -> end_date và theo keyword
def get_trips(db: Session, start_date: datetime = None, end_date: datetime = None, keyword: str = None):
    query = db.query(trip.Trip)
    if start_date and end_date:
        query = query.filter(trip.Trip.StartDate >= start_date, trip.Trip.EndDate <= end_date)
    if keyword:
        query = query.filter(trip.Trip.Name.ilike(f"%{keyword}%")) 
    return query.all()

#tạo mới trip
def create_trip(db: Session, trip: TripCreate):
    new_trip = trip.Trip(**trip.model_dump())
    db.add(new_trip)
    db.commit()
    db.refresh(new_trip)
    return new_trip

#update
def update_trip(db: Session, trip_id: str, trip_update: TripUpdate):
    trip = db.query(trip.Trip).filter(trip.Trip.IDTrip == trip_id).first()
    if not trip:
        return None
    
    for key, value in trip_update.dict().items():
        setattr(trip, key, value)
    
    db.commit()
    db.refresh(trip)
    return trip

#del
def delete_trip(db: Session, trip_id: str):
    trip = db.query(trip.Trip).filter(trip.Trip.IDTrip == trip_id).first()
    if not trip:
        return None
    
    db.delete(trip)
    db.commit()
    return trip