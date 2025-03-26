from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from schemas import ai_recommendation_schema
from repositories import ai_recommendation_repo
from database import get_db
from controllers.auth_ctrl import get_current_user

router = APIRouter()

@router.get("/ai_recs", response_model=list[ai_recommendation_schema.AIRecResponse])
def get_ai_recs(db: Session = Depends(get_db), current_user = Depends(get_current_user), skip: int = 0, limit: int = 100):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    return ai_recommendation_repo.get_aiRec(db, skip, limit)

@router.get("/ai_recs/id/{idAIRec}", response_model=ai_recommendation_schema.AIRecResponse)
def get_ai_rec_by_id(idAIRec: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    ai_rec = ai_recommendation_repo.get_aiRec_by_id(db, idAIRec)
    if not ai_rec:
        raise HTTPException(404, "AI recommendation not found")
    
    return ai_rec

@router.get("/ai_recs/{idUser}", response_model=list[ai_recommendation_schema.AIRecResponse])
def get_ai_rec_by_user(idUser: str, db: Session = Depends(get_db), current_user = Depends(get_current_user), skip: int = 0, limit: int = 100):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    ai_recs = ai_recommendation_repo.get_aiRec_by_user(db, idUser, skip, limit)
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

#TODO:
# @router.post("/generate")
# def generate_recommendation(user_id: str, input_text: str, db: Session = Depends(get_db)):
#     """Generate a new AI recommendation based on user input"""
#     recommendation = ai_recommendation_repo.generate_recommendation(db, user_id, input_text)
#     if not recommendation:
#         raise HTTPException(status_code=400, detail="Could not generate AI recommendation")
#     return recommendation
