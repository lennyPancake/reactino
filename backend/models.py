from pydantic import ConfigDict
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime
from zoneinfo import ZoneInfo

class PostBase(SQLModel):
    title: str
    content: str
    image_url: Optional[str] = Field(default=None, alias="image")

class PostCreate(PostBase):
    model_config = {"populate_by_name": True}

# Эту модель используем для БАЗЫ ДАННЫХ
class UserPublic(SQLModel): # Схема юзера без пароля
    id: int
    first_name: str
    last_name: str
    avatar: Optional[str]
class UserBase(SQLModel):
    email: str = Field(unique=True, index=True, max_length=255)
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    avatar: Optional[str] = None

class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    password_hash: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(ZoneInfo("UTC")))

    posts: list["Post"] = Relationship(back_populates="author")
    comments: list["Comment"] = Relationship(back_populates="author")

class PostRead(PostBase):
    id: int
    author_id: int
    created_at: datetime
    updated_at: datetime
    # Вот это поле заставит FastAPI добавить объект автора в JSON
    author: UserPublic 

    model_config = ConfigDict(populate_by_name=True)
class Post(PostBase, table=True):
    __table_args__ = {"extend_existing": True}
    id: Optional[int] = Field(default=None, primary_key=True)
    author_id: int = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=lambda: datetime.now(ZoneInfo("UTC")))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(ZoneInfo("UTC")))

    # lazy="joined" подтянет автора автоматически
    author: Optional["User"] = Relationship(
        back_populates="posts", 
        sa_relationship_kwargs={"lazy": "joined"}
    )
    # Исправлено: связь с Comment.post
    comments: list["Comment"] = Relationship(
        back_populates="post", 
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
class CommentBase(SQLModel):
    text: str

class CommentCreate(CommentBase): 
    post_id: int = Field(alias="postId") 
    model_config = ConfigDict(populate_by_name=True)

class Comment(CommentBase, table=True):
    __table_args__ = {"extend_existing": True}
    id: Optional[int] = Field(default=None, primary_key=True)
    author_id: int = Field(foreign_key="user.id")
    post_id: int = Field(foreign_key="post.id")
    
    # ИСПРАВЛЕНО: back_populates должен быть "comments" (как в User)
    author: Optional["User"] = Relationship(
        back_populates="comments", 
        sa_relationship_kwargs={"lazy": "joined"}
    )
    # ИСПРАВЛЕНО: back_populates должен быть "comments" (как в Post)
    post: Optional["Post"] = Relationship(back_populates="comments")
class CommentRead(CommentBase): # Схема комментария с вложенным автором
    id: int
    author_id: int
    post_id: int
    author: UserPublic # Вот это поле увидит React
    