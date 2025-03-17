from sqlalchemy.orm import Session
from models.trip import Trip
from schemas.trip_schema import TripCreate

# Get all trips
def get_trips(db: Session):
    return db.query(Trip)

# Post a new trip
def create_trip(db: Session, trip: TripCreate):
    db_trip = Trip(idTrip=trip.idTrip, name=trip.name, startDate=trip.startDate, endDate=trip.endDate)
    db.add(db_trip)
    db.commit()
    return db_trip