from sqlalchemy.orm import Session
import models, schemas

#region Trips
# Get all trips
def get_trips(db: Session):
    return db.query(models.Trips)

# Post a new trip
def create_trip(db: Session, trip: schemas.TripCreate):
    db_trip = models.Trips(idTrip=trip.idTrip, name=trip.name, startDate=trip.startDate, endDate=trip.endDate)
    db.add(db_trip)
    db.commit()
    return db_trip
#endregion