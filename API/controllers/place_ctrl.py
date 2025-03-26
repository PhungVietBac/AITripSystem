from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from repositories import place_repo
from schemas.place_schema import PlaceResponse, PlaceCreate, PlaceUpdate

router = APIRouter(
    prefix="/places",
    tags=["places"]
)

@router.get("/", response_model=List[PlaceResponse])
def get_places(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all places with pagination"""
    places = place_repo.get_places(db, skip=skip, limit=limit)
    return places

@router.get("/{place_id}", response_model=PlaceResponse)
def get_place(place_id: str, db: Session = Depends(get_db)):
    """Get a specific place by ID"""
    place = place_repo.get_place_by_id(db, place_id)
    if not place:
        raise HTTPException(status_code=404, detail="Place not found")
    return place

@router.post("/", response_model=PlaceResponse)
def create_place(place: PlaceCreate, db: Session = Depends(get_db)):
    """Create a new place"""
    db_place = place_repo.create_place(db, place)
    if not db_place:
        raise HTTPException(status_code=400, detail="Could not create place")
    return db_place

@router.put("/{place_id}", response_model=PlaceResponse)
def update_place(place_id: str, place: PlaceUpdate, db: Session = Depends(get_db)):
    """Update a place"""
    db_place = place_repo.update_place(db, place_id, place)
    if not db_place:
        raise HTTPException(status_code=404, detail="Place not found")
    return db_place

@router.delete("/{place_id}", response_model=PlaceResponse)
def delete_place(place_id: str, db: Session = Depends(get_db)):
    """Delete a place"""
    db_place = place_repo.delete_place(db, place_id)
    if not db_place:
        raise HTTPException(status_code=404, detail="Place not found")
    return db_place

@router.get("/search/", response_model=List[PlaceResponse])
def search_places(
    query: str,
    place_type: int = None,
    min_rating: int = None,
    db: Session = Depends(get_db)
):
    """Search places with filters"""
    places = place_repo.search_places(
        db,
        query=query,
        place_type=place_type,
        min_rating=min_rating
    )
    return places
