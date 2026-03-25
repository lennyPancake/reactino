from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+psycopg2://blog_user:SuperSecure123@localhost:5432/blog_db"
    JWT_SECRET_KEY: str = "очень_длинная_строка_минимум_64_символа_лучше_сгенерировать_случайно"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 180   # 3 часа как было
    ENVIRONMENT: str = "development"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()