"""Unit тесты для моделей Post и Comment"""
import pytest
import sys
from pathlib import Path
from datetime import datetime, timezone

sys.path.insert(0, str(Path(__file__).parent.parent.parent / "backend"))

from models import Post, Comment, User, PostCreate, CommentCreate
import bcrypt


class TestPostModel:
    """Тесты для модели Post"""
    
    def test_post_creation(self, session_fixture, test_user):
        """Проверяем создание поста"""
        post = Post(
            title="Test Post",
            content="Test content",
            image_url="/images/test.jpg",
            author_id=test_user.id
        )
        session_fixture.add(post)
        session_fixture.commit()
        session_fixture.refresh(post)
        
        assert post.id is not None
        assert post.title == "Test Post"
        assert post.content == "Test content"
        assert post.author_id == test_user.id
    
    def test_post_has_timestamps(self, session_fixture, test_user):
        """Проверяем что у поста есть created_at и updated_at"""
        post = Post(
            title="Test",
            content="Content",
            author_id=test_user.id
        )
        session_fixture.add(post)
        session_fixture.commit()
        
        assert post.created_at is not None
        assert post.updated_at is not None
        assert isinstance(post.created_at, datetime)
        assert isinstance(post.updated_at, datetime)
    
    def test_post_image_url_is_optional(self, session_fixture, test_user):
        """Проверяем что image_url опциональный"""
        post = Post(
            title="Test",
            content="Content",
            author_id=test_user.id
        )
        session_fixture.add(post)
        session_fixture.commit()
        
        assert post.image_url is None
    
    def test_post_create_schema(self):
        """Проверяем модель PostCreate"""
        data = {
            "title": "Test",
            "content": "Content",
            "image": "/images/test.jpg"  # используем alias
        }
        post_create = PostCreate(**data)
        
        assert post_create.title == "Test"
        assert post_create.content == "Content"
        assert post_create.image_url == "/images/test.jpg"
    
    def test_post_relationship_with_user(self, session_fixture, test_user):
        """Проверяем связь между Post и User"""
        post = Post(
            title="Test",
            content="Content",
            author_id=test_user.id
        )
        session_fixture.add(post)
        session_fixture.commit()
        session_fixture.refresh(post)
        
        # Проверяем что можем получить автора через отношение
        assert post.author.id == test_user.id
        assert post.author.email == test_user.email


class TestCommentModel:
    """Тесты для модели Comment"""
    
    def test_comment_creation(self, session_fixture, test_user, test_post):
        """Проверяем создание комментария"""
        comment = Comment(
            text="Great post!",
            post_id=test_post.id,
            author_id=test_user.id
        )
        session_fixture.add(comment)
        session_fixture.commit()
        session_fixture.refresh(comment)
        
        assert comment.id is not None
        assert comment.text == "Great post!"
        assert comment.post_id == test_post.id
        assert comment.author_id == test_user.id
    
    def test_comment_author_relationship(self, session_fixture, test_user, test_post):
        """Проверяем связь Comment с User"""
        comment = Comment(
            text="Test comment",
            post_id=test_post.id,
            author_id=test_user.id
        )
        session_fixture.add(comment)
        session_fixture.commit()
        session_fixture.refresh(comment)
        
        assert comment.author.id == test_user.id
        assert comment.author.email == test_user.email
    
    def test_comment_post_relationship(self, session_fixture, test_user, test_post):
        """Проверяем связь Comment с Post"""
        comment = Comment(
            text="Test comment",
            post_id=test_post.id,
            author_id=test_user.id
        )
        session_fixture.add(comment)
        session_fixture.commit()
        session_fixture.refresh(comment)
        
        assert comment.post.id == test_post.id
        assert comment.post.title == test_post.title
    
    def test_post_has_comments_relationship(self, session_fixture, test_user, test_post):
        """Проверяем что Post может хранить комментарии"""
        comment1 = Comment(
            text="Comment 1",
            post_id=test_post.id,
            author_id=test_user.id
        )
        comment2 = Comment(
            text="Comment 2",
            post_id=test_post.id,
            author_id=test_user.id
        )
        session_fixture.add(comment1)
        session_fixture.add(comment2)
        session_fixture.commit()
        session_fixture.refresh(test_post)
        
        assert len(test_post.comments) == 2
    
    def test_comment_create_schema_with_alias(self):
        """Проверяем CommentCreate с alias для postId"""
        data = {
            "text": "Great post!",
            "postId": 1  # используем camelCase alias
        }
        comment_create = CommentCreate(**data)
        
        assert comment_create.text == "Great post!"
        assert comment_create.post_id == 1
    
    def test_user_has_comments_relationship(self, session_fixture, test_user, test_post):
        """Проверяем что User может хранить комментарии"""
        comment1 = Comment(
            text="Comment 1",
            post_id=test_post.id,
            author_id=test_user.id
        )
        comment2 = Comment(
            text="Comment 2",
            post_id=test_post.id,
            author_id=test_user.id
        )
        session_fixture.add(comment1)
        session_fixture.add(comment2)
        session_fixture.commit()
        session_fixture.refresh(test_user)
        
        assert len(test_user.comments) == 2
