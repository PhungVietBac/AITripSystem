from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import logging

# Connect to SQL Server by using SQL Server Authentication
DATABASE_URL = "mssql+pyodbc://admin:12345678@0.tcp.ap.ngrok.io,11826/AITripSystem?driver=ODBC+Driver+17+for+SQL+Server"
# DATABASE_URL = "mssql+pyodbc://@DANNYJOHN\SQLEXPRESS/AITripSystem?driver=ODBC+Driver+17+for+SQL+Server&trusted_connection=yes"
#DATABASE_URL = "mssql+pyodbc://@FLOURINEV\\SQLEXPRESS02/AITripSystem?driver=ODBC+Driver+17+for+SQL+Server&trusted_connection=yes"


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