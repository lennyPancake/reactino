from sqlmodel import SQLModel, create_engine, Session
from core.config import settings

# единый источник правды для адреса БД
DATABASE_URL = settings.DATABASE_URL

engine = create_engine(DATABASE_URL, echo=False, future=True)

def get_session() -> Session:  # type: ignore
    with Session(engine) as session:
        yield session

# Если хочешь сразу асинхронный вариант (рекомендую в будущем)
# async def get_async_session():
#     async_session = async_sessionmaker(async_engine, expire_on_commit=False)
#     async with async_session() as session:
#         yield session