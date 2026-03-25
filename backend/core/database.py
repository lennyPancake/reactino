from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine, async_sessionmaker
import os
from dotenv import load_dotenv
load_dotenv()
# Базовый URL без драйвера
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg2://blog_user:SuperSecure123@localhost:5432/blog_db")

engine = create_engine(DATABASE_URL, echo=False)
#async_engine = create_async_engine(ASYNC_URL, echo=False)

def get_session() -> Session: # type: ignore
    with Session(engine) as session:
        yield session

# Если хочешь сразу асинхронный вариант (рекомендую в будущем)
# async def get_async_session():
#     async_session = async_sessionmaker(async_engine, expire_on_commit=False)
#     async with async_session() as session:
#         yield session