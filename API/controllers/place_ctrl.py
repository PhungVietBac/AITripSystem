from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from schemas import place_schema
from controllers.auth_ctrl import get_current_user
from repositories import place_repo

router = APIRouter()

@router.get("/places/", response_model=list[place_schema.PlaceResponse])
def get_places(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    return place_repo.get_places(db)

@router.get("/places", response_model=place_schema.PlaceResponse)
def get_places(idPlace: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    place = place_repo.get_place_by_id(db, idPlace)
    if place is None:
        raise HTTPException(404, "Place not found")
    
    return place

@router.get("/places/{select}", response_model=list[place_schema.PlaceResponse])
def get_place_by(select: str, lookup: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    places = place_repo.get_place_by(db, select, lookup)
    if places == []:
        raise HTTPException(404, "Place not found")
    
    return places

@router.post("/places/", response_model=place_schema.PlaceResponse)
def create_place(place: place_schema.PlaceCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    return place_repo.post_place(db, place)

@router.put("/places/{idPlace}", response_model=place_schema.PlaceResponse)
def update_place(idPlace: str, place: place_schema.PlaceUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    return place_repo.update_place(db, idPlace, place)

@router.delete("/places/{idPlace}", response_model=place_schema.PlaceResponse)
def delete_place(idPlace: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    return place_repo.delete_place(db, idPlace)