import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base
import urllib.parse

ENV_CONN_STR = os.environ.get('ConnectionStrings__ClassVisionAI')
ENV_CONN = dict(map(lambda x: urllib.parse.quote_plus(x).split("%3D"),ENV_CONN_STR.split(";")))
print(ENV_CONN)
URL_DATABASE  = f'postgresql://{ENV_CONN["Username"]}:{ENV_CONN["Password"]}@{ENV_CONN["Host"]}:{ENV_CONN["Port"]}/{ENV_CONN["Database"]}'
print(URL_DATABASE)

engine = create_engine(URL_DATABASE)
with Session(engine) as session:
    session.execute(text('CREATE EXTENSION IF NOT EXISTS vector'))


SessionLocal = sessionmaker(autoflush=False, bind=engine)
Base = declarative_base()