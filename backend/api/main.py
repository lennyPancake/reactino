from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from sqlmodel import SQLModel, Session, select
from typing import Annotated, List, Optional
from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone
import bcrypt
import os
import shutil
import uuid

from core.config import settings
from core.database import engine, get_session
from models import CommentRead, PostCreate, PostRead, User, Post, Comment, UserBase, PostBase, CommentBase, CommentCreate

app = FastAPI(title="Simple Blog API")

# Заставим SQLModel автоматически первично создать таблицы, если они ещё не существуют.
# Это удобно для локальной разработки, в production лучше держать миграции через alembic.
@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

SECRET_KEY = settings.JWT_SECRET
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES


# CORS: allow frontend dev server access and Docker Compose service names
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://frontend:3000",
    "http://frontend:3001",
    "http://backend:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Для отдачи загруженных картинок
os.makedirs("media/images", exist_ok=True)
app.mount("/images", StaticFiles(directory="media/images"), name="images")
# Статические файлы проекта (логотип, favicon, возможно css/js если будут)
os.makedirs("backend/static", exist_ok=True)
app.mount("/static", StaticFiles(directory="backend/static"), name="static")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# ────────────────────────────────────────
#             JWT & Auth helpers
# ────────────────────────────────────────

# Значения берём из core.config.settings, единообразно с backend/core/config.py

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if "sub" in to_encode:
        to_encode["sub"] = str(to_encode["sub"])
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], session: Session = Depends(get_session)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM], options={"verify_exp": False}) 
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = session.get(User, user_id)
    if user is None:
        raise credentials_exception
    return user


# ────────────────────────────────────────
#                REGISTER
# ────────────────────────────────────────

@app.post("/register", response_model=dict)
def register(
    email: Annotated[str, Form()],
    password: Annotated[str, Form()],
    first_name: Annotated[Optional[str], Form()] = None,
    last_name: Annotated[Optional[str], Form()] = None,
    avatar: Annotated[Optional[str], Form()] = None,
    session: Session = Depends(get_session)
):
    stmt = select(User).where(User.email == email)
    existing = session.exec(stmt).first()
    if existing:    
        raise HTTPException(status_code=400, detail="Email already registered")

    password_hash = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    new_user = User(
        email=email,
        password_hash=password_hash,
        first_name=first_name,
        last_name=last_name,
        avatar=avatar
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    token = create_access_token({"sub": str(new_user.id)})
    return {"user": new_user.dict(exclude={"password_hash"}), "token": token}


# ────────────────────────────────────────
#                   LOGIN
# ────────────────────────────────────────

@app.post("/login")
def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    session: Session = Depends(get_session)
):
    stmt = select(User).where(User.email == form_data.username)
    user = session.exec(stmt).first()

    if not user or not bcrypt.checkpw(form_data.password.encode("utf-8"), user.password_hash.encode("utf-8")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token({"sub": str(user.id)})
    return {"token": token, "token_type": "bearer","user": {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "avatar": user.avatar
        }}


# ────────────────────────────────────────
#               UPLOAD IMAGE
# ────────────────────────────────────────

@app.post("/file")
async def upload_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(400, detail="File must be an image")

    filename = f"{uuid.uuid4()}_{file.filename}"
    filepath = os.path.join("media/images", filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    url = f"/images/{filename}"
    return {"filepath": url}
# ────────────────────────────────────────
#               POSTS CRUD
# ────────────────────────────────────────

@app.get("/posts", response_model=List[PostRead])
def get_posts(session: Session = Depends(get_session)):
    stmt = select(Post) 
    posts = session.exec(stmt).all()
    return posts

@app.get("/posts/{post_id}")
def get_post(post_id: int, session: Session = Depends(get_session)):
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(404, "Post not found")
    return post


@app.post("/posts")
def create_post(
    post_data: PostCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    new_post = Post(
        title=post_data.title,
        content=post_data.content,
        image_url=post_data.image_url,
        author_id=current_user.id
    )

    session.add(new_post)
    session.commit()
    session.refresh(new_post)
    return new_post

@app.put("/posts/{post_id}")
def update_post(
    post_id: int,
    title: Annotated[Optional[str], Form()] = None,
    content: Annotated[Optional[str], Form()] = None,
    image: Annotated[Optional[str], Form()] = None,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(404, "Post not found")

    if post.author_id != current_user.id:
        raise HTTPException(403, "Not your post")

    if title is not None:
        post.title = title
    if content is not None:
        post.content = content
    if image is not None:
        post.image_url = image

    post.updated_at = datetime.now(timezone.utc)
    session.add(post)
    session.commit()
    session.refresh(post)
    return post


@app.delete("/posts/{post_id}")
def delete_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(404, "Post not found")

    if post.author_id != current_user.id:
        raise HTTPException(403, "Not your post")

    session.delete(post)
    session.commit()
    return {"message": "Post deleted"}
# ────────────────────────────────────────
#              COMMENTS CRUD
# ────────────────────────────────────────

@app.get("/posts/{post_id}/comments", response_model=list[CommentRead])
def get_comments(post_id: int, session: Session = Depends(get_session)):
    stmt = select(Comment).where(Comment.post_id == post_id)
    return session.exec(stmt).all()

@app.post("/comments", response_model=CommentRead)
def create_comment(
    comment_data: CommentCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    post = session.get(Post, comment_data.post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    new_comment = Comment(
        text=comment_data.text,
        post_id=comment_data.post_id,
        author_id=current_user.id
    )
    session.add(new_comment)
    session.commit()
    session.refresh(new_comment)
    return new_comment


@app.delete("/comments/{comment_id}")
def delete_comment(
    comment_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    comment = session.get(Comment, comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    if comment.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only delete your own comments")

    session.delete(comment)
    session.commit()
    return {"message": "Comment deleted successfully"}
# ────────────────────────────────────────
#         Простые эндпоинты для проверки
# ────────────────────────────────────────

@app.put("/users/me")
def update_current_user(
    first_name: Annotated[Optional[str], Form()] = None,
    last_name: Annotated[Optional[str], Form()] = None,
    avatar: Annotated[Optional[str], Form()] = None,
    password: Annotated[Optional[str], Form()] = None,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    if first_name is not None:
        current_user.first_name = first_name
    if last_name is not None:
        current_user.last_name = last_name
    if avatar is not None:
        current_user.avatar = avatar
    if password is not None:
        current_user.password_hash = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    return current_user.dict(exclude={"password_hash"})


@app.get("/users")
def get_all_users(session: Session = Depends(get_session)):
    users = session.exec(select(User)).all()
    # Не отдаём хэши паролей
    safe_users = [u.dict(exclude={"password_hash"}) for u in users]
    return safe_users


@app.get("/users/me")
def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    return current_user.dict(exclude={"password_hash"})


@app.get("/health")
def health_check():
    return {"status": "ok", "timestamp": datetime.now(timezone.utc).isoformat()}