from sqlmodel import SQLModel, create_engine, Session
from core.config import settings

DATABASE_URL = settings.DATABASE_URL

engine = create_engine(DATABASE_URL, echo=False, future=True)

def get_session() -> Session:
    with Session(engine) as session:
        yield session