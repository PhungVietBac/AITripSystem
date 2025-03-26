from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from repositories import review_repo
from schemas.review_schema import ReviewResponse, ReviewCreate, ReviewUpdate

router = APIRouter(
    prefix="/reviews",
    tags=["reviews"]
)

@router.get("/", response_model=List[ReviewResponse])
def get_reviews(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all reviews with pagination"""
    reviews = review_repo.get_reviews(db, skip=skip, limit=limit)
    return reviews

@router.get("/{review_id}", response_model=ReviewResponse)
def get_review(review_id: str, db: Session = Depends(get_db)):
    """Get a specific review by ID"""
    review = review_repo.get_review_by_id(db, review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return review

@router.get("/user/{user_id}", response_model=List[ReviewResponse])
def get_user_reviews(
    user_id: str,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all reviews by a specific user"""
    reviews = review_repo.get_reviews_by_user(db, user_id, skip=skip, limit=limit)
    return reviews

@router.post("/", response_model=ReviewResponse)
def create_review(review: ReviewCreate, db: Session = Depends(get_db)):
    """Create a new review"""
    db_review = review_repo.create_review(db, review)
    if not db_review:
        raise HTTPException(status_code=400, detail="Could not create review")
    return db_review

@router.put("/{review_id}", response_model=ReviewResponse)
def update_review(review_id: str, review: ReviewUpdate, db: Session = Depends(get_db)):
    """Update a review"""
    db_review = review_repo.update_review(db, review_id, review)
    if not db_review:
        raise HTTPException(status_code=404, detail="Review not found")
    return db_review

@router.delete("/{review_id}", response_model=ReviewResponse)
def delete_review(review_id: str, db: Session = Depends(get_db)):
    """Delete a review"""
    db_review = review_repo.delete_review(db, review_id)
    if not db_review:
        raise HTTPException(status_code=404, detail="Review not found")
    return db_review
