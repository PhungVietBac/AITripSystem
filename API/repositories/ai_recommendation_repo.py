from sqlalchemy.orm import Session
from models.ai_recommendation import AIRecommendation
from models.user import User
from schemas.ai_recommendation_schema import AIRecCreate
import random

# Get all AI recommendations
def get_aiRec(db: Session):
    return db.query(AIRecommendation).all()

# Get AI recommendation by
def get_aiRec_by(db: Session, select: str, lookup: str):
    if select == "idAIRec":
        return db.query(AIRecommendation).filter(AIRecommendation.idAIRec == lookup).first()
    elif select == "idUser":
        return db.query(AIRecommendation).filter(AIRecommendation.idUser == lookup).all()
    else:
        return None

# Post new AI recommendation
def create_aiRec(db: Session, idUser: str, aiRecommendation: AIRecCreate):
    idAIRec = ""
    while not idAIRec or get_aiRec_by(db, "idAIRec", idAIRec):
        temp = random.randint(1, 9999)
        idAIRec = f"AI{temp:04d}"

    db_AIRecommendation = AIRecommendation(idAIRec = idAIRec, idUser = idUser, aiInput = aiRecommendation.aiInput, aiOutput = aiRecommendation.aiOutput)
    db.add(db_AIRecommendation)
    db.commit()
    db.refresh(db_AIRecommendation)

    return db_AIRecommendation

# Delete AI recommendation
def delete_aiRec(db: Session, idAIRec: str):
    db_AIRecommendation = get_aiRec_by(db, "idAIRec", idAIRec)

    if not db_AIRecommendation:
        return None
    
    db.delete(db_AIRecommendation)
    db.commit()
    return db_AIRecommendation