from sqlalchemy import Column, String, ForeignKey
from database import Base

class AIRecommendation(Base):
    __tablename__ = "AIRecommendations"

    idAIRec = Column(String(6), primary_key=True, index=True)
    idUser = Column(String(6), ForeignKey("Users.idUser"), index=True)
    input = Column(String(1000))
    output = Column(String(1000))