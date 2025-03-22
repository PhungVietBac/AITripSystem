from sqlalchemy.orm import Session
from models.place import Place
from schemas.place_schema import PlaceCreate, PlaceUpdate
from fastapi import HTTPException
import uuid

def get_places(db: Session):
    return db.query(Place).all()

# Get place by id
def get_place_by_id(db: Session, id: str):
    return db.query(Place).filter(Place.idPlace == id).first()

def get_place_by(db: Session, select: str, lookup: str):
    if select == "name":
        return db.query(Place).filter(Place.name == lookup).all()
    elif select == "country":
        return db.query(Place).filter(Place.country == lookup).all()
    elif select == "city":
        return db.query(Place).filter(Place.city == lookup).all()
    elif select == "province":
        return db.query(Place).filter(Place.province == lookup).all()
    elif select == "type":
        return db.query(Place).filter(Place.type == int(lookup)).all()
    elif select == "rating":
        return db.query(Place).filter(Place.rating == int(lookup)).all()
    else:
        raise HTTPException(400, "Bad Request")

# Post place
def post_place(db: Session, place: PlaceCreate):
    idPlace = ""
    while not idPlace or get_place_by_id(db, idPlace):
        idPlace = f"PL{str(uuid.uuid4())[:4]}"
    
    new_place = Place(
        idPlace = idPlace,
        name = place.name,
        country = place.country,
        city = place.city,
        province = place.province,
        address = place.address,
        description = place.description,
        image = place.image,
        rating = place.rating,
        type = place.type
    )
    
    db.add(new_place)
    db.commit()
    db.refresh(new_place)
    return new_place

# Update place
def update_place(db: Session, id: str, place: PlaceUpdate):
    # Check if IDPlace exists
    db_place = get_place_by_id(db, id)
    if not db_place:
        raise HTTPException(404, "Place not found")
    
    for key, value in place.model_dump(exclude_unset=True).items():
        setattr(db_place, key, value)
    
    db.commit()
    db.refresh(db_place)
    return db_place

def delete_place(db: Session, idPlace: str):
    db_place = get_place_by_id(db, idPlace)
    if not db_place:
       raise HTTPException(status_code=404, detail="Place not found")
    
    db.delete(db_place)
    db.commit()
    return db_place

