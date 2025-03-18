from fastapi import Depends, APIRouter, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import schemas.trip_member_schema as trip_member_schema
import repositories.trip_member_repo as trip_member_repo

router = APIRouter()

# Get all trip_members
@router.get("/trip_members/", response_model=list[trip_member_schema.TripMemberResponse])
def get_trip_members(db: Session = Depends(get_db)):
    return trip_member_repo.get_trip_members(db)

# Get a trip_member by
@router.get("/trip_members/{select}", response_model=trip_member_schema.TripMemberResponse)
def get_trip_member_by(select: str, lookup: str, db: Session = Depends(get_db)):
    trip_member = trip_member_repo.get_trip_member_by(db=db, select=select, lookup=lookup)
    if trip_member is None:
        raise HTTPException(status_code=404, detail="Trip member not found")
    
    return trip_member

# Post a new trip_member
@router.post("/trip_members/", response_model=trip_member_schema.TripMemberResponse)
def create_trip_member(trip_member: trip_member_schema.TripMemberCreate, db: Session = Depends(get_db)):
    trip_member = trip_member_repo.create_trip_member(db=db, trip_member=trip_member)
    if trip_member is None:
        raise HTTPException(status_code=422, detail="Trip member already exists")
    
    return trip_member

# Delete a trip_member
@router.delete("/trip_members/{idUser}/{idTrip}", response_model=trip_member_schema.TripMemberResponse)
def delete_trip_member(idUser: str, idTrip: str, db: Session = Depends(get_db)):
    trip_member = trip_member_repo.delete_trip_member(db=db, idUser=idUser, idTrip=idTrip)
    if trip_member is None:
        raise HTTPException(status_code=404, detail="Trip member not found")
    
    return trip_member
