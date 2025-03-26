from pydantic import BaseModel

class AIRecommendationBase(BaseModel):
    idUser: str
    aiInput: str
    aiOutput: str

class AIRecResponse(AIRecommendationBase):
    idAIRec: str

    class Config:
        from_attributes = True
class AIRecCreate(AIRecommendationBase):
    pass

class AIRecUpdate(AIRecommendationBase):
    pass
