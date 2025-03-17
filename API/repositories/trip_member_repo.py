from sqlalchemy.orm import Session
from models.trip_member import TripMember
from schemas.trip_member_schema import TripMemberCreate

# Get all trip_memnbers
def get_trip_members(db: Session):
    return db.query(TripMember)

# Get a trip_member by
def get_trip_member_byr(db: Session, select: str, lookup: str):
    if select == "idUser":
        return db.query(TripMember).filter(TripMember.idUser == lookup).first()
    elif select == "idTrip":
        return db.query(TripMember).filter(TripMember.idTrip == lookup).first()
    else:
        return None

# Post a new trip_member
def create_trip_member(db: Session, trip_member: TripMemberCreate):
    # Check if the trip_member already exists
    _trip_member = get_trip_members(db).filter(TripMember.idUser == trip_member.idUser and TripMember.idTrip == trip_member.idTrip).first()
    if _trip_member:
        return None
    
    db_trip_member = TripMember(idUser=trip_member.idUser, idTrip=trip_member.idTrip)
    db.add(db_trip_member)
    db.commit()
    db.refresh(db_trip_member)
    return db_trip_member

# Delete a trip_member
def delete_trip_member(db: Session, idUser: str, idTrip: str):
    db_trip_member = get_trip_members(db).filter(TripMember.idUser == idUser and TripMember.idTrip == idTrip).first()
    if not db_trip_member:
        return None
    
    db.delete(db_trip_member)
    db.commit()
    return db_trip_member