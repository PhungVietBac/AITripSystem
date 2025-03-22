from pydantic import BaseModel

class AIRecommendationBase(BaseModel):
    input: str
    idUser: str

class AIRecResponse(AIRecommendationBase):
    idAIRec: str
    output: str

    class Config:
        from_attributes = True

class AIRecCreate(AIRecommendationBase):
    pass

class AIRecUpdate(AIRecommendationBase):
    pass