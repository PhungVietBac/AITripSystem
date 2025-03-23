from sqlalchemy import Column, String, ForeignKey
from ..database import Base

class AIRecommendation(Base):
    __tablename__ = "AIRecommendations"

    idAIRec = Column(String, primary_key=True, index=True)
    idUser = Column(String, ForeignKey("Users.IDUser"))
    input = Column(String)
    output = Column(String)