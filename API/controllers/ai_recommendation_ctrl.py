from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from schemas import ai_recommendation_schema
from repositories import ai_recommendation_repo
from database import get_db
from controllers.auth_ctrl import get_current_user

router = APIRouter()

@router.get("/ai_recs/", response_model=list[ai_recommendation_schema.AIRecResponse])
def get_ai_recs(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    return ai_recommendation_repo.get_aiRec(db)

@router.get("/ai_recs/id/{idAIRec}", response_model=ai_recommendation_schema.AIRecResponse)
def get_ai_rec_by_id(idAIRec: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    ai_rec = ai_recommendation_repo.get_aiRec_by_id(db, idAIRec)
    if not ai_rec:
        raise HTTPException(404, "AI recommendation not found")
    
    return ai_rec

@router.get("/ai_recs/{idUser}", response_model=list[ai_recommendation_schema.AIRecResponse])
def get_ai_rec_by_user(idUser: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    ai_recs = ai_recommendation_repo.get_aiRec_by_user(db, idUser)
    if ai_recs == []:
        raise HTTPException(404, "AI recommendation not found")
    
    return ai_recs

@router.post("/ai_recs/", response_model=ai_recommendation_schema.AIRecResponse)
def create_ai_rec(ai_rec: ai_recommendation_schema.AIRecCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    return ai_recommendation_repo.create_aiRec(db, ai_rec)

@router.delete("/ai_recs/{idAIRec}", response_model=ai_recommendation_schema.AIRecResponse)
def delete_ai_rec(idAIRec: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    return ai_recommendation_repo.delete_aiRec(db, idAIRec)

# NEW
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
