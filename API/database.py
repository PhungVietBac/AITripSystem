from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os
import logging

# Connect to SQL Server by using SQL Server Authentication
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL) # Create connection to database with SQLAlchemy
sessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine) # Create a new session

# Cấu hình log
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    engine = create_engine(DATABASE_URL)
    sessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    logger.info("✅ Đã kết nối đến database thành công.")
except Exception as e:
    logger.error("❌ Kết nối đến database thất bại.")
    logger.exception(e)
    raise e  # bắt buộc raise để FastAPI biết lỗi

Base = declarative_base() # Create a new base class for models

# Get session and work with database
def get_db():
    db = sessionLocal()
    try:
        yield db
    finally:
        db.close()