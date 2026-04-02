"""Unit тесты для авторизации и authentication"""
import pytest
import bcrypt
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent / "backend"))

from models import User
from api.main import create_access_token
from jose import jwt
from core.config import settings


class TestPasswordHashing:
    """Тесты для хеширования паролей"""
    
    def test_password_hashing(self):
        """Проверяем что пароль корректно хешируется"""
        password = "MySecurePassword123!"
        hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        
        # Проверяем что хеш не равен паролю в открытом виде
        assert hashed != password
        # Проверяем что хеш верный
        assert bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))
    
    def test_password_verification_fails_with_wrong_password(self):
        """Проверяем что неправильный пароль не проходит проверку"""
        password = "CorrectPassword"
        wrong_password = "WrongPassword"
        hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        
        assert not bcrypt.checkpw(wrong_password.encode("utf-8"), hashed.encode("utf-8"))
    
    def test_different_passwords_have_different_hashes(self):
        """Проверяем что разные пароли дают разные хеши"""
        password1 = "Password1"
        password2 = "Password2"
        
        hash1 = bcrypt.hashpw(password1.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        hash2 = bcrypt.hashpw(password2.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        
        assert hash1 != hash2


class TestJWTToken:
    """Тесты для JWT токенов"""
    
    def test_create_access_token(self):
        """Проверяем создание JWT токена"""
        data = {"sub": "1"}
        token = create_access_token(data)
        
        # Проверяем что токен не пустой
        assert token
        assert isinstance(token, str)
    
    def test_token_contains_user_id(self):
        """Проверяем что токен содержит ID пользователя"""
        user_id = "12345"
        token = create_access_token({"sub": user_id})
        
        # Декодируем токен без проверки срока действия
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM], 
                            options={"verify_exp": False})
        
        assert payload["sub"] == user_id
    
    def test_token_has_expiration(self):
        """Проверяем что токен имеет дату истечения"""
        token = create_access_token({"sub": "1"})
        
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM],
                            options={"verify_exp": False})
        
        assert "exp" in payload
    
    def test_invalid_token_raises_error(self):
        """Проверяем что невалидный токен вызывает ошибку"""
        from jose import JWTError
        
        invalid_token = "invalid.token.here"
        
        with pytest.raises(JWTError):
            jwt.decode(invalid_token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM])


class TestUserModel:
    """Тесты для модели User"""
    
    def test_user_creation(self, session_fixture):
        """Проверяем создание пользователя"""
        password_hash = bcrypt.hashpw("password".encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        
        user = User(
            email="user@example.com",
            password_hash=password_hash,
            first_name="John",
            last_name="Doe"
        )
        session_fixture.add(user)
        session_fixture.commit()
        session_fixture.refresh(user)
        
        assert user.id is not None
        assert user.email == "user@example.com"
        assert user.first_name == "John"
        assert user.last_name == "Doe"
    
    def test_user_has_default_created_at(self, session_fixture):
        """Проверяем что у пользователя есть дата создания"""
        password_hash = bcrypt.hashpw("password".encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        
        user = User(
            email="user@example.com",
            password_hash=password_hash
        )
        session_fixture.add(user)
        session_fixture.commit()
        
        assert user.created_at is not None
    
    def test_user_email_uniqueness(self, session_fixture):
        """Проверяем constraint уникальности email"""
        password_hash = bcrypt.hashpw("password".encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        
        user1 = User(email="unique@example.com", password_hash=password_hash)
        user2 = User(email="unique@example.com", password_hash=password_hash)
        
        session_fixture.add(user1)
        session_fixture.commit()
        session_fixture.add(user2)
        
        # SQLAlchemy должен вызвать ошибку при коммите
        with pytest.raises(Exception):  # IntegrityError
            session_fixture.commit()
