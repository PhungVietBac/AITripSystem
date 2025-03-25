from sqlalchemy import Session
from models.place import Place
from schemas.place_schema import PlaceCreate
from schemas.place_schema import PlaceUpdate

# Get place by id
def get_place_by_id(db: Session, id: str):
    return db.query(Place).filter(Place.idPlace == id).first()

# Post place
def post_place(db: Session, place: Place):
    # Check if IDPlace already exists
    if db.query(Place).filter(Place.idPlace == place.idPlace).first():
        return None
    
    new_place = Place(
        idPlace = place.idPlace,
        Name = place.Name,
        Country = place.Country,
        City = place.City,
        Address = place.Address,
        Description = place.Description,
        Image = place.Image,
        Rating = place.Rating,
        Type = place.Type
    )
    
    db.add(new_place)
    db.commit()
    db.refresh(new_place)
    return new_place

# Update place
def update_place(db: Session, id: str, place: PlaceUpdate):
    # Check if IDPlace exists
    if not db.query(Place).filter(Place.idPlace == id).first():
        return None
    
    db.query(Place).filter(Place.idPlace == id).update({
        Place.Name: place.name,
        Place.Country: place.country,
        Place.City: place.city,
        Place.Address: place.address,
        Place.Description: place.description,
        Place.Image: place.image,
        Place.Rating: place.rating,
        Place.Type: place.placeType
    })
    
    db.commit()
    return db.query(Place).filter(Place.idPlace == id).first()

