from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+psycopg2://blog_user:SuperSecure123@db:5432/blog_db"
    JWT_SECRET: str = "pagan_very_long_random_string_at_least_64_chars"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 180   # 3 часа
    ENVIRONMENT: str = "development"

    model_config = SettingsConfigDict(
        env_file=None,  # Явно не читаем .env файлы
        extra="ignore"
    )

settings = Settings()