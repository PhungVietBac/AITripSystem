from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from repositories import ai_recommendation_repo
from schemas.ai_recommendation_schema import AIRecResponse, AIRecCreate, AIRecUpdate

router = APIRouter(
    prefix="/ai-recommendations",
    tags=["ai-recommendations"]
)

@router.get("/", response_model=List[AIRecResponse])
def get_recommendations(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all AI recommendations with pagination"""
    recommendations = ai_recommendation_repo.get_recommendations(db, skip=skip, limit=limit)
    return recommendations

@router.get("/{recommendation_id}", response_model=AIRecResponse)
def get_recommendation(recommendation_id: str, db: Session = Depends(get_db)):
    """Get a specific AI recommendation by ID"""
    recommendation = ai_recommendation_repo.get_recommendation_by_id(db, recommendation_id)
    if not recommendation:
        raise HTTPException(status_code=404, detail="AI recommendation not found")
    return recommendation

@router.get("/user/{user_id}", response_model=List[AIRecResponse])
def get_user_recommendations(
    user_id: str,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all AI recommendations for a specific user"""
    recommendations = ai_recommendation_repo.get_recommendations_by_user(db, user_id, skip=skip, limit=limit)
    return recommendations

@router.post("/", response_model=AIRecResponse)
def create_recommendation(recommendation: AIRecCreate, db: Session = Depends(get_db)):
    """Create a new AI recommendation"""
    db_recommendation = ai_recommendation_repo.create_recommendation(db, recommendation)
    if not db_recommendation:
        raise HTTPException(status_code=400, detail="Could not create AI recommendation")
    return db_recommendation

@router.put("/{recommendation_id}", response_model=AIRecResponse)
def update_recommendation(recommendation_id: str, recommendation: AIRecUpdate, db: Session = Depends(get_db)):
    """Update an AI recommendation"""
    db_recommendation = ai_recommendation_repo.update_recommendation(db, recommendation_id, recommendation)
    if not db_recommendation:
        raise HTTPException(status_code=404, detail="AI recommendation not found")
    return db_recommendation

@router.delete("/{recommendation_id}", response_model=AIRecResponse)
def delete_recommendation(recommendation_id: str, db: Session = Depends(get_db)):
    """Delete an AI recommendation"""
    db_recommendation = ai_recommendation_repo.delete_recommendation(db, recommendation_id)
    if not db_recommendation:
        raise HTTPException(status_code=404, detail="AI recommendation not found")
    return db_recommendation

@router.post("/generate")
def generate_recommendation(user_id: str, input_text: str, db: Session = Depends(get_db)):
    """Generate a new AI recommendation based on user input"""
    recommendation = ai_recommendation_repo.generate_recommendation(db, user_id, input_text)
    if not recommendation:
        raise HTTPException(status_code=400, detail="Could not generate AI recommendation")
    return recommendation
