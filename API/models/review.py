from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# Model Review
class Review(Base):
    __tablename__ = 'reviews'  # Tên bảng trong cơ sở dữ liệu

    idReview = Column(String, primary_key=True, index=True)  # Khóa chính
    idTrip = Column(String, ForeignKey('trips.idTrip'))  # Khóa ngoại liên kết với bảng Trip
    idUser = Column(String)  # ID người dùng
    Comment = Column(String)  # Bình luận
    Rating = Column(Integer)  # Đánh giá

    # Thiết lập quan hệ với bảng Trip (nếu cần)
    trip = relationship("Trip", back_populates="reviews")

    def __repr__(self):
        return f"<Review(IDReview={self.idReview}, IDTrip={self.idTrip}, IDUser={self.idUser}, Rating={self.Rating})>"
