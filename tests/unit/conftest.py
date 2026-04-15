import pytest
import sys
from pathlib import Path
from sqlmodel import SQLModel, Session, create_engine
from sqlmodel.pool import StaticPool
from datetime import datetime, timezone

# Добавляем backend в path
sys.path.insert(0, str(Path(__file__).parent.parent.parent / "backend"))

from core.database import get_session
from models import User, Post, Comment
from api.main import app


@pytest.fixture
def session():
    """Создает тестовую БД в памяти для каждого теста"""
    engine = create_engine(
        "sqlite:///:memory:",
        echo=False,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(session):
    """Создает тестовый FastAPI клиент"""
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    
    from fastapi.testclient import TestClient
    client = TestClient(app)
    yield client
    
    app.dependency_overrides.clear()


@pytest.fixture
def test_user(session):
    """Создает тестового пользователя в БД"""
    import bcrypt
    password_hash = bcrypt.hashpw("TestPass123".encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    
    user = User(
        email="test@example.com",
        password_hash=password_hash,
        first_name="Test",
        last_name="User",
        avatar=None
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@pytest.fixture
def test_post(session, test_user):
    """Создает тестовый пост"""
    post = Post(
        title="Test Post",
        content="This is a test post",
        image_url=None,
        author_id=test_user.id
    )
    session.add(post)
    session.commit()
    session.refresh(post)
    return post


@pytest.fixture
def auth_token(session, test_user):
    """Создает JWT токен для тестового пользователя"""
    from api.main import create_access_token
    return create_access_token({"sub": str(test_user.id)})
