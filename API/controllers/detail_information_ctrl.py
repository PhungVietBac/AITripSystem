from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from schemas import detail_information_schema
from repositories import detail_information_repo
from database import get_db
from controllers.auth_ctrl import get_current_user

router = APIRouter()

@router.get("/details/", response_model=list[detail_information_schema.DetailResponse])
def get_details(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    return detail_information_repo.get_details(db)

@router.get("/details", response_model=detail_information_schema.DetailResponse)
def get_detail_by_id(idDetail: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    detail = detail_information_repo.get_detail_information_by_id(db, idDetail)
    if detail is None:
        raise HTTPException(404, "Detail information not found")
    
    return detail

@router.get("/details/{select}", response_model=list[detail_information_schema.DetailResponse])
def get_detail_by(select: str, lookup: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    details = detail_information_repo.get_detail_by(db, select, lookup)
    if details == []:
        raise HTTPException(404, "Detail information not found")
    
    return details

@router.post("/details/", response_model=detail_information_schema.DetailResponse)
def create_detail(detail: detail_information_schema.DetailCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    return detail_information_repo.post_detail_information(db, detail)

@router.put("/details/{idDetail}", response_model=detail_information_schema.DetailResponse)
def update_detail(idDetail: str, detail: detail_information_schema.DetailUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    return detail_information_repo.update_detail_information(db, idDetail, detail)

@router.delete("/details/{idDetail}", response_model=detail_information_schema.DetailResponse)
def update_detail(idDetail: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    return detail_information_repo.delete_detail_information(db, idDetail)
# NEW
@router.get("/", response_model=List[DetailResponse])
def get_details(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all details with pagination"""
    details = detail_information_repo.get_details(db, skip=skip, limit=limit)
    return details

@router.get("/{detail_id}", response_model=DetailResponse)
def get_detail(detail_id: str, db: Session = Depends(get_db)):
    """Get a specific detail by ID"""
    detail = detail_information_repo.get_detail_by_id(db, detail_id)
    if not detail:
        raise HTTPException(status_code=404, detail="Detail not found")
    return detail

@router.get("/trip/{trip_id}", response_model=List[DetailResponse])
def get_trip_details(
    trip_id: str,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all details for a specific trip"""
    details = detail_information_repo.get_details_by_trip(db, trip_id, skip=skip, limit=limit)
    return details

@router.get("/place/{place_id}", response_model=List[DetailResponse])
def get_place_details(
    place_id: str,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all details for a specific place"""
    details = detail_information_repo.get_details_by_place(db, place_id, skip=skip, limit=limit)
    return details

@router.post("/", response_model=DetailResponse)
def create_detail(detail: DetailCreate, db: Session = Depends(get_db)):
    """Create a new detail"""
    db_detail = detail_information_repo.create_detail(db, detail)
    if not db_detail:
        raise HTTPException(status_code=400, detail="Could not create detail")
    return db_detail

@router.put("/{detail_id}", response_model=DetailResponse)
def update_detail(detail_id: str, detail: DetailUpdate, db: Session = Depends(get_db)):
    """Update a detail"""
    db_detail = detail_information_repo.update_detail(db, detail_id, detail)
    if not db_detail:
        raise HTTPException(status_code=404, detail="Detail not found")
    return db_detail

@router.delete("/{detail_id}", response_model=DetailResponse)
def delete_detail(detail_id: str, db: Session = Depends(get_db)):
    """Delete a detail"""
    db_detail = detail_information_repo.delete_detail(db, detail_id)
    if not db_detail:
        raise HTTPException(status_code=404, detail="Detail not found")
    return db_detail
