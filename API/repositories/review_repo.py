from sqlalchemy.orm import Session
from models import review
from schemas import ReviewCreate

#lấy top reviews (lọc bởi rating)
def get_best_reviews(db: Session, trip_id: str):
    return db.query(review).filter(review.IDTrip == trip_id).order_by(review.Rating.desc()).limit(5).all()

#tạo mới
def create_review(db: Session, review: ReviewCreate):
    new_review = review(**review.model_dump())
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    return new_review

#xóa
def delete_review(db: Session, review_id: str):
    review = db.query(review).filter(review.IDReview == review_id).first()
    if not review:
        return None
    
    db.delete(review)
    db.commit()
    return review
