from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from schemas import review_schema
from repositories import review_repo
from database import get_db
from controllers.auth_ctrl import get_current_user

router = APIRouter()

# Get all reviews
@router.get("/reviews/", response_model=list[review_schema.ReviewResponse])
def get_reviews(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    return review_repo.get_reviews(db)

# Get a review by id
@router.get("/reviews", response_model=review_schema.ReviewResponse)
def get_review_by_id(idReview: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    review = review_repo.get_review_by_id(db=db, idReview=idReview)
    if review is None:
        raise HTTPException(status_code=404, detail="Review not found")
    
    return review

# Get a review by
@router.get("/reviews/{select}", response_model=list[review_schema.ReviewResponse])
def get_review_by(select: str, lookup: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    review = review_repo.get_review_by(db=db, select=select, lookup=lookup)
    if review == []:
        raise HTTPException(status_code=404, detail="Review not found")
    
    return review

# Get top reviews
@router.get("/reviews/top/", response_model=list[review_schema.ReviewResponse])
def get_best_reviews(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    return review_repo.get_best_reviews(db=db)

# Post a new review
@router.post("/reviews/", response_model=review_schema.ReviewResponse)
def create_review(review: review_schema.ReviewCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    return review_repo.create_review(db=db, review=review)

# Delete a review
@router.delete("/reviews/{idReview}", response_model=review_schema.ReviewResponse)
def delete_review(idReview: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    return review_repo.delete_review(db, idReview)
# NEW
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
