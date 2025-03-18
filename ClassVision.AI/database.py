from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base

URL_DATABASE  = 'postgresql://postgres:huy123@localhost:5434/QuizApplication'

engine = create_engine(URL_DATABASE)
with Session(engine) as session:
    session.execute(text('CREATE EXTENSION IF NOT EXISTS vector'))


SessionLocal = sessionmaker(autoflush=False, bind=engine)
Base = declarative_base()