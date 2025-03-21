from sqlalchemy import Session 
from models.detail_information import DetailInformation
from schemas.detail_information_schema import DetailCreate
from schemas.detail_information_schema import DetailUpdate

# Get detail information by id
def get_detail_information_by_id(db: Session, id: str):
    return db.query(DetailInformation).filter(DetailInformation.idDetail == id).first()

# Post detail information
def post_detail_information(db: Session, detail: DetailInformation):
    # Check if IDDetail already exists
    if db.query(DetailInformation).filter(DetailInformation.IDDetail == detail.IDDetail).first():
        return None
    
    new_detail = DetailInformation(
        IDDetail = detail.IDDetail,
        IDPlace = detail.IDPlace,
        IDTrip = detail.IDTrip,
        StartTime = detail.StartTime,
        EndTime = detail.EndTime,
        Note = detail.Note
    )
    
    db.add(new_detail)
    db.commit()
    db.refresh(new_detail)
    return new_detail

# Update detail information
def update_detail_information(db: Session, id: str, detail: DetailUpdate):
    db.query(DetailInformation).filter(DetailInformation.IDDetail == id).update({
        DetailInformation.StartTime: detail.startTime,
        DetailInformation.EndTime: detail.endTime,
        DetailInformation.Note: detail.note
    })
    
    db.commit()
    return db.query(DetailInformation).filter(DetailInformation.IDDetail == id).first()

# Delete detail information
def delete_detail_information(db: Session, id: str):
    # Check if IDDetail exists
    if not db.query(DetailInformation).filter(DetailInformation.IDDetail == id).first():
        return None
    
    db.query(DetailInformation).filter(DetailInformation.IDDetail == id).delete()
    db.commit()
    return True