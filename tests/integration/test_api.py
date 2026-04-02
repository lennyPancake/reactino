"""Integration тесты для API endpoints"""
import pytest
import sys
import json
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent / "backend"))

from fastapi.testclient import TestClient


class TestAuthEndpoints:
    """Интеграционные тесты для аутентификации"""
    
    def test_register_new_user(self, client_fixture):
        """Проверяем регистрацию нового пользователя"""
        response = client_fixture.post(
            "/register",
            data={
                "email": "newuser@example.com",
                "password": "SecurePass123",
                "first_name": "John",
                "last_name": "Doe"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert data["user"]["email"] == "newuser@example.com"
        assert data["user"]["first_name"] == "John"
        assert data["user"]["last_name"] == "Doe"
        assert "password_hash" not in data["user"]  # Пароль не должен быть в ответе
    
    def test_register_duplicate_email_fails(self, client_fixture, test_user):
        """Проверяем что регистрация с существующим email не работает"""
        response = client_fixture.post(
            "/register",
            data={
                "email": test_user.email,
                "password": "AnotherPass123",
                "first_name": "Jane",
                "last_name": "Smith"
            }
        )
        
        assert response.status_code == 400
        assert "already registered" in response.json()["detail"]
    
    def test_login_with_correct_credentials(self, client_fixture, test_user):
        """Проверяем login с правильными credentials"""
        response = client_fixture.post(
            "/login",
            data={
                "username": test_user.email,
                "password": "TestPass123"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert data["token_type"] == "bearer"
        assert data["user"]["id"] == test_user.id
        assert data["user"]["email"] == test_user.email
    
    def test_login_with_wrong_password_fails(self, client_fixture, test_user):
        """Проверяем что login с неправильным паролем не работает"""
        response = client_fixture.post(
            "/login",
            data={
                "username": test_user.email,
                "password": "WrongPassword"
            }
        )
        
        assert response.status_code == 401
        assert "Incorrect" in response.json()["detail"]
    
    def test_login_with_nonexistent_email_fails(self, client_fixture):
        """Проверяем что login с несуществующим email не работает"""
        response = client_fixture.post(
            "/login",
            data={
                "username": "nonexistent@example.com",
                "password": "SomePass123"
            }
        )
        
        assert response.status_code == 401


class TestPostEndpoints:
    """Интеграционные тесты для работы с постами"""
    
    def test_get_posts_empty(self, client_fixture):
        """Проверяем получение постов когда их нет"""
        response = client_fixture.get("/posts")
        
        assert response.status_code == 200
        assert response.json() == []
    
    def test_get_posts_returns_list(self, client_fixture, test_post):
        """Проверяем получение списка постов"""
        response = client_fixture.get("/posts")
        
        assert response.status_code == 200
        posts = response.json()
        assert len(posts) == 1
        assert posts[0]["title"] == "Test Post"
    
    def test_get_single_post(self, client_fixture, test_post):
        """Проверяем получение одного поста"""
        response = client_fixture.get(f"/posts/{test_post.id}")
        
        assert response.status_code == 200
        post = response.json()
        assert post["id"] == test_post.id
        assert post["title"] == "Test Post"
    
    def test_get_nonexistent_post_returns_404(self, client_fixture):
        """Проверяем что несуществующий пост возвращает 404"""
        response = client_fixture.get("/posts/99999")
        
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()
    
    def test_create_post_requires_auth(self, client_fixture):
        """Проверяем что создание поста требует авторизации"""
        response = client_fixture.post(
            "/posts",
            json={
                "title": "New Post",
                "content": "Content"
            }
        )
        
        assert response.status_code == 403  # или 401
    
    def test_create_post_with_auth(self, client_fixture, auth_token, test_user):
        """Проверяем создание поста с авторизацией"""
        response = client_fixture.post(
            "/posts",
            json={
                "title": "New Post",
                "content": "This is new content"
            },
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        
        assert response.status_code == 200
        post = response.json()
        assert post["title"] == "New Post"
        assert post["content"] == "This is new content"
        assert post["author_id"] == test_user.id
    
    def test_update_own_post(self, client_fixture, auth_token, test_post, test_user):
        """Проверяем обновление своего поста"""
        # Делаем пост принадлежащим тестовому пользователю
        response = client_fixture.put(
            f"/posts/{test_post.id}",
            data={
                "title": "Updated Title",
                "content": "Updated content"
            },
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        
        assert response.status_code == 200
        updated = response.json()
        assert updated["title"] == "Updated Title"
        assert updated["content"] == "Updated content"
    
    def test_update_other_user_post_fails(self, client_fixture, test_post, session_fixture):
        """Проверяем что нельзя обновить чужой пост"""
        import bcrypt
        from models import User
        from api.main import create_access_token
        
        # Создаем другого пользователя
        password_hash = bcrypt.hashpw("OtherPass123".encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        other_user = User(
            email="other@example.com",
            password_hash=password_hash
        )
        session_fixture.add(other_user)
        session_fixture.commit()
        session_fixture.refresh(other_user)
        
        # Создаем токен для другого пользователя
        other_token = create_access_token({"sub": str(other_user.id)})
        
        response = client_fixture.put(
            f"/posts/{test_post.id}",
            data={"title": "Hacked Title"},
            headers={"Authorization": f"Bearer {other_token}"}
        )
        
        assert response.status_code == 403
    
    def test_delete_own_post(self, client_fixture, auth_token, test_post):
        """Проверяем удаление своего поста"""
        response = client_fixture.delete(
            f"/posts/{test_post.id}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        
        assert response.status_code == 200
        
        # Проверяем что пост удален
        get_response = client_fixture.get(f"/posts/{test_post.id}")
        assert get_response.status_code == 404
    
    def test_delete_other_user_post_fails(self, client_fixture, test_post, session_fixture):
        """Проверяем что нельзя удалить чужой пост"""
        import bcrypt
        from models import User
        from api.main import create_access_token
        
        password_hash = bcrypt.hashpw("OtherPass123".encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        other_user = User(
            email="other@example.com",
            password_hash=password_hash
        )
        session_fixture.add(other_user)
        session_fixture.commit()
        session_fixture.refresh(other_user)
        
        other_token = create_access_token({"sub": str(other_user.id)})
        
        response = client_fixture.delete(
            f"/posts/{test_post.id}",
            headers={"Authorization": f"Bearer {other_token}"}
        )
        
        assert response.status_code == 403


class TestCommentEndpoints:
    """Интеграционные тесты для работы с комментариями"""
    
    def test_get_comments_for_post(self, client_fixture, test_post, session_fixture, test_user):
        """Проверяем получение комментариев для поста"""
        from models import Comment
        
        comment = Comment(
            text="Test comment",
            post_id=test_post.id,
            author_id=test_user.id
        )
        session_fixture.add(comment)
        session_fixture.commit()
        
        response = client_fixture.get(f"/posts/{test_post.id}/comments")
        
        assert response.status_code == 200
        comments = response.json()
        assert len(comments) == 1
        assert comments[0]["text"] == "Test comment"
    
    def test_get_comments_empty(self, client_fixture, test_post):
        """Проверяем получение комментариев когда их нет"""
        response = client_fixture.get(f"/posts/{test_post.id}/comments")
        
        assert response.status_code == 200
        assert response.json() == []
    
    def test_create_comment_requires_auth(self, client_fixture, test_post):
        """Проверяем что создание комментария требует авторизации"""
        response = client_fixture.post(
            "/comments",
            json={
                "text": "Great post!",
                "postId": test_post.id
            }
        )
        
        assert response.status_code == 403
    
    def test_create_comment_with_auth(self, client_fixture, auth_token, test_post, test_user):
        """Проверяем создание комментария с авторизацией"""
        response = client_fixture.post(
            "/comments",
            json={
                "text": "Excellent post!",
                "postId": test_post.id
            },
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        
        assert response.status_code == 200
        comment = response.json()
        assert comment["text"] == "Excellent post!"
        assert comment["post_id"] == test_post.id
        assert comment["author_id"] == test_user.id
    
    def test_create_comment_on_nonexistent_post_fails(self, client_fixture, auth_token):
        """Проверяем что нельзя создать комментарий на несуществующий пост"""
        response = client_fixture.post(
            "/comments",
            json={
                "text": "Comment",
                "postId": 99999
            },
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        
        assert response.status_code == 404
    
    def test_delete_own_comment(self, client_fixture, auth_token, test_post, test_user, session_fixture):
        """Проверяем удаление своего комментария"""
        from models import Comment
        
        comment = Comment(
            text="My comment",
            post_id=test_post.id,
            author_id=test_user.id
        )
        session_fixture.add(comment)
        session_fixture.commit()
        session_fixture.refresh(comment)
        
        response = client_fixture.delete(
            f"/comments/{comment.id}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        
        assert response.status_code == 200
