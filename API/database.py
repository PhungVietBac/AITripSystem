from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

# Connect to SQL Server by using SQL Server Authentication
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL) # Create connection to database with SQLAlchemy
sessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine) # Create a new session
Base = declarative_base() # Create a new base class for models

# Get session and work with database
def get_db():
    db = sessionLocal()
    try:
        yield db
    finally:
        db.close()