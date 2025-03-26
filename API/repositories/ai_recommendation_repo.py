from sqlalchemy.orm import Session
from models.ai_recommendation import AIRecommendation
from schemas.ai_recommendation_schema import AIRecCreate
from repositories import user_repo
from fastapi import HTTPException
import uuid

# Get all AI recommendations
def get_aiRec(db: Session):
    return db.query(AIRecommendation).all()

# Get AI recommendation by
def get_aiRec_by_id(db: Session, idAIRec: str):
    return db.query(AIRecommendation).filter(AIRecommendation.idAIRec == idAIRec).first()
    
def get_aiRec_by_user(db: Session, idUser: str):
    if not user_repo.get_user_by(db, "idUser", idUser):
        raise HTTPException(404, "User not found")
    
    return db.query(AIRecommendation).filter(AIRecommendation.idUser == idUser).all()

# Post new AI recommendation
def create_aiRec(db: Session, aiRecommendation: AIRecCreate):
    if not user_repo.get_user_by(db, "idUser", aiRecommendation.idUser):
        raise HTTPException(404, "User not found")
    
    idAIRec = ""
    while not idAIRec or get_aiRec_by_id(db, idAIRec):
        idAIRec = f"AI{str(uuid.uuid4())[:4]}"

    db_AIRecommendation = AIRecommendation(idAIRec = idAIRec, idUser = aiRecommendation.idUser, input = aiRecommendation.input, output = "")
    db.add(db_AIRecommendation)
    db.commit()
    db.refresh(db_AIRecommendation)

    return db_AIRecommendation

# Delete AI recommendation
def delete_aiRec(db: Session, idAIRec: str):
    db_AIRecommendation = get_aiRec_by_id(db, idAIRec)

    if not db_AIRecommendation:
        raise HTTPException(404, "AI recommendation not found")
    
    db.delete(db_AIRecommendation)
    db.commit()
    return db_AIRecommendation