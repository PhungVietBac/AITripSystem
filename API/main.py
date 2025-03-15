from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
import schemas, repositories
from database import get_db

app = FastAPI()

#region Trips
# Post a new trip
@app.post("/trips/", response_model=schemas.TripResponse)
def create_trip(trip: schemas.TripCreate, db: Session = Depends(get_db)):
    return repositories.create_trip(db=db, trip=trip)

# Get all trips
@app.get("/trips/", response_model=list[schemas.TripResponse])
def get_trips(db: Session = Depends(get_db)):
    return repositories.get_trips(db)
#endregion