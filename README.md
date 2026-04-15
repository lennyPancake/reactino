# Reactino (indev)📰

** Полнофункциональный Full-Stack блог с авторизацией, постами и комментариями**

[![Tests](https://img.shields.io/badge/tests-70%2B-green.svg)](tests/)
[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green.svg)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

Reactino - веб-приложение для блогинга с полным набором функций: регистрация пользователей, создание и управление постами, система комментариев, загрузка изображений.

## ✨ Возможности

### 🔐 Авторизация и безопасность

- Регистрация и вход пользователей
- JWT токены для аутентификации
- Хеширование паролей (bcrypt)
- Защита от несанкционированного доступа

### 📝 Управление контентом

- Создание, редактирование и удаление постов
- Загрузка изображений для постов
- Система комментариев к постам
- Только автор может редактировать/удалять свой контент

### 🎨 Современный интерфейс

- Адаптивный дизайн (Bootstrap 5)
- Интуитивный пользовательский интерфейс
- Мобильная адаптация

### 🧪 Полное тестирование

- **70+ тестов** с высоким покрытием кода
- Unit, Integration и E2E тесты
- Автоматизированное тестирование UI (Selenium)
- CI/CD готовность

## 🏗 Архитектура

```
reactino/
├── backend/                 # FastAPI сервер
│   ├── api/main.py         # Основное приложение
│   ├── models.py           # SQLModel модели
│   ├── core/               # Конфигурация и утилиты
│   └── requirements.txt    # Python зависимости
├── frontend/                # React приложение
│   ├── src/
│   │   ├── components/     # React компоненты
│   │   ├── pages/          # Страницы приложения
│   │   ├── API/            # API клиенты
│   │   └── store/          # MobX состояние
│   └── package.json        # Node.js зависимости
├── tests/                   # Полный набор тестов
│   ├── unit/               # Unit тесты (19 тестов)
│   ├── integration/        # Integration тесты (22 теста)
│   └── e2e/                # E2E тесты (15+ сценариев)
└── docker-compose.yml      # Docker оркестрация
```

## 🚀 Быстрый старт

### Предварительные требования

- Docker и Docker Compose
- Git

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd reactino
```

### 2. Запуск с Docker Compose

```bash
# Запуск всех сервисов (БД, Backend, Frontend)
docker-compose up --build

# Или в фоне
docker-compose up -d --build
```

### 3. Доступ к приложению

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API документация**: http://localhost:8000/docs (Swagger UI)

### 4. Остановка

```bash
docker-compose down
```

## 🛠 Локальная разработка

### Backend (Python/FastAPI)

```bash
cd backend

# Создание виртуального окружения
python -m venv venv
source venv/bin/activate  # Linux/Mac
# или
venv\Scripts\activate     # Windows

# Установка зависимостей
pip install -r requirements.txt

# Запуск сервера разработки
uvicorn api.main:app --reload
```

### Frontend (React)

```bash
cd frontend

# Установка зависимостей
npm install

# Запуск сервера разработки
npm start
```

### База данных

```bash
# Запуск PostgreSQL в Docker
docker run -d \
  --name postgres-dev \
  -e POSTGRES_DB=blog_db \
  -e POSTGRES_USER=blog_user \
  -e POSTGRES_PASSWORD=SuperSecure123 \
  -p 5432:5432 \
  postgres:16-alpine
```

## 🧪 Тестирование

### Backend тесты

```bash
cd backend

# Все тесты
pytest tests/ -v

# Unit тесты
pytest tests/unit/ -v

# Integration тесты
pytest tests/integration/ -v

# С отчетом о покрытии
pytest --cov=. --cov-report=html
```

### Frontend тесты

```bash
cd frontend

# Запуск тестов
npm test

# С покрытием кода
npm test -- --coverage
```

### E2E тесты (Selenium)

```bash
# Запуск Selenium Grid и тестового окружения
docker-compose -f docker-compose.test.yml up -d

# Запуск тестовых runner-сервисов (unit/integration/e2e)
docker-compose -f docker-compose.test.yml --profile test up -d

# Запуск E2E тестов
pytest tests/e2e/ -v
```

### 📊 Покрытие тестов

- **Backend**: 85%+ покрытие кода
- **Frontend**: 90%+ покрытие компонентов
- **E2E**: Полные пользовательские сценарии

## 📚 API документация

### Основные endpoints

#### Авторизация

- `POST /register` - Регистрация пользователя
- `POST /login` - Вход в систему
- `POST /file` - Загрузка изображений

#### Посты

- `GET /posts` - Получить все посты
- `GET /posts/{id}` - Получить пост по ID
- `POST /posts` - Создать новый пост
- `PUT /posts/{id}` - Обновить пост
- `DELETE /posts/{id}` - Удалить пост

#### Комментарии

- `GET /posts/{id}/comments` - Получить комментарии поста
- `POST /comments` - Создать комментарий
- `DELETE /comments/{id}` - Удалить комментарий

## 🗂 Структура проекта

### Backend

```
backend/
├── api/main.py           # FastAPI приложение
├── models.py             # SQLModel модели (User, Post, Comment)
├── core/
│   ├── config.py         # Настройки приложения
│   ├── database.py       # Подключение к БД
│   └── security.py       # JWT и безопасность
├── alembic/              # Миграции БД
└── media/images/         # Загруженные изображения
```

### Frontend

```
frontend/
├── public/
│   ├── index.html
│   └── manifest.json
└── src/
    ├── components/        # React компоненты
    │   ├── Login.jsx
    │   ├── Post.jsx
    │   ├── Comments.jsx
    │   └── ...
    ├── pages/            # Страницы приложения
    │   ├── MainPage.jsx
    │   ├── AllPosts.jsx
    │   └── ...
    ├── API/              # API клиенты
    │   ├── userAPI.js
    │   ├── postAPI.js
    │   └── commentAPI.js
    └── store/            # MobX состояние
        ├── userStore.js
        ├── postStore.js
        └── commentStore.js
```

## 🧪 Тестовая инфраструктура

### Unit тесты

- **Backend**: pytest с SQLAlchemy in-memory БД
- **Frontend**: Jest + React Testing Library
- **Модели**: Тестирование валидации и связей
- **Компоненты**: Тестирование UI и взаимодействия

### Integration тесты

- **API endpoints**: Полное тестирование CRUD операций
- **Аутентификация**: JWT токены и разрешения
- **База данных**: Тестирование связей и constraints

### E2E тесты

- **Пользовательские сценарии**: Регистрация → Посты → Комментарии
- **Selenium WebDriver**: Автоматизация браузера
- **Docker**: Изолированное тестовое окружение

## 🔧 Конфигурация

### Переменные окружения

#### Backend (.env)

```env
DATABASE_URL=postgresql+psycopg2://blog_user:SuperSecure123@db:5432/blog_db
JWT_SECRET=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=180
ENVIRONMENT=development
```

#### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:8000
```
