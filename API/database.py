from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Connect to SQL Server by using SQL Server Authentication
# Local database
DATABASE_URL = "mssql+pyodbc://@localhost/AITripSystem?driver=ODBC+Driver+17+for+SQL+Server&trusted_connection=yes"
# Server database
# DATABASE_URL = "mssql+pyodbc://admin:12345678@0.tcp.ap.ngrok.io,11826/AITripSystem?driver=ODBC+Driver+17+for+SQL+Server"
# DATABASE_URL = "mssql+pyodbc://@DANNYJOHN\SQLEXPRESS/AITripSystem?driver=ODBC+Driver+17+for+SQL+Server&trusted_connection=yes"

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