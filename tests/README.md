# Руководство по запуску тестов

## Структура тестов проекта

```
tests/
├── unit/                    # Unit тесты для backend
│   ├── conftest.py         # Fixtures для unit тестов
│   ├── test_auth.py        # Тесты авторизации
│   └── test_models.py      # Тесты моделей БД
├── integration/            # Integration тесты для backend API
│   ├── conftest.py         # Fixtures для интеграционных тестов
│   └── test_api.py         # Тесты API endpoints
├── e2e/                    # End-to-End тесты (Selenium)
│   ├── conftest.py         # Fixtures для E2E тестов
│   ├── test_register_flow.py
│   ├── test_flows.py       # Расширенные E2E тесты
│   ├── pages/              # Page Objects
│   │   ├── base_page.py
│   │   ├── register_page.py
│   │   ├── posts_page.py
│   │   ├── add_post_modal.py
│   │   └── post_detail_page.py
│   └── components/         # Компоненты Page Objects
│       └── sidebar.py

frontend/src/components/__tests__/  # Unit тесты компонентов React
├── Login.test.js
├── Register.test.js
├── Post.test.js
└── Comments.test.js
```

## Требования

### Backend тесты (Python)

- pytest
- pytest-cov (для coverage)
- FastAPI
- SQLAlchemy
- bcrypt
- python-jose

Установка:

```bash
cd backend
pip install pytest pytest-cov
```

### Frontend тесты (JavaScript)

- React Testing Library
- Jest
- @testing-library/jest-dom
- @testing-library/user-event

(Уже установлены в package.json)

### E2E тесты (Selenium)

- Selenium WebDriver
- Chrome WebDriver
- selenium grid (Docker Compose)

## Запуск тестов

### Backend Unit тесты

```bash
cd backend
pytest tests/unit/ -v
# С покрытием кода
pytest tests/unit/ --cov=. --cov-report=html
```

### Backend Integration тесты

```bash
cd backend
pytest tests/integration/ -v
```

### Все backend тесты

```bash
cd backend
pytest tests/ -v
```

### Frontend Unit тесты (React)

```bash
cd frontend
npm test
# Или в watch режиме
npm test -- --watch
# С покрытием кода
npm test -- --coverage
```

### E2E тесты (Selenium)

1. Убедитесь что Docker Compose запущен с Selenium Grid:

```bash
docker-compose -f docker-compose.test.yml up -d
```

2. Запустите тесты:

```bash
pytest tests/e2e/ -v
# Или конкретный тест
pytest tests/e2e/test_flows.py::TestAuthFlow -v
```

### Запуск всех тестов

```bash
# Backend
cd backend
pytest tests/ -v

# Frontend
cd frontend
npm test -- --coverage
```

## Описание тестов

### Unit тесты Backend (`tests/unit/`)

#### `test_auth.py`

- **TestPasswordHashing**: Тесты хеширования паролей с bcrypt
  - Проверка корректности хеша
  - Валидация неправильного пароля
  - Разные пароли = разные хеши

- **TestJWTToken**: Тесты JWT токенов
  - Создание токена
  - Проверка содержания токена
  - Проверка срока действия токена
  - Ошибки при невалидном токене

- **TestUserModel**: Тесты модели User
  - Создание пользователя
  - Проверка значений по умолчанию
  - Проверка уникальности email

#### `test_models.py`

- **TestPostModel**: Тесты модели Post
  - Создание поста
  - Проверка timestamps (created_at, updated_at)
  - Опциональность поля image_url
  - Валидация PostCreate схемы
  - Связь Post ↔ User

- **TestCommentModel**: Тесты модели Comment
  - Создание комментария
  - Связь Comment ↔ User
  - Связь Comment ↔ Post
  - Связь Post → comments
  - Валидация CommentCreate схемы
  - Связь User → comments

### Integration тесты Backend (`tests/integration/`)

#### `test_api.py`

- **TestAuthEndpoints**: Тесты endpoints авторизации
  - Регистрация нового пользователя
  - Попытка регистрации с существующим email
  - Login с правильными credentials
  - Login с неправильным паролем
  - Login с несуществующим email

- **TestPostEndpoints**: Тесты CRUD операций для постов
  - GET /posts (пустой список)
  - GET /posts (список с постами)
  - GET /posts/{id}
  - GET несуществующего поста (404)
  - POST /posts без авторизации
  - POST /posts с авторизацией
  - PUT /posts/{id} (Редактирование)
  - PUT чужого поста (403 Forbidden)
  - DELETE /posts/{id}
  - DELETE чужого поста (403 Forbidden)

- **TestCommentEndpoints**: Тесты CRUD операций для комментариев
  - GET /posts/{id}/comments
  - GET комментариев пустой список
  - POST /comments без авторизации
  - POST /comments с авторизацией
  - POST комментария на несуществующий пост (404)
  - DELETE /comments/{id}

### E2E тесты (`tests/e2e/`)

#### `test_flows.py`

- **TestAuthFlow**: E2E тесты аутентификации
  - Полный флоу регистрации
  - Login
  - Logout

- **TestPostFlow**: E2E тесты работы с постами
  - Просмотр списка постов
  - Создание нового поста
  - Просмотр деталей поста
  - Редактирование поста
  - Удаление поста

- **TestCommentFlow**: E2E тесты работы с комментариями
  - Добавление комментария к посту
  - Просмотр комментариев на посте

- **TestUserFlow**: E2E тесты профиля пользователя
  - Просмотр списка пользователей
  - Просмотр профиля пользователя

### Frontend Unit тесты (`frontend/src/components/__tests__/`)

#### `Login.test.js`

- Отображение формы логина
- Ошибка на пустые поля
- Ошибка на некорректный email
- Сохранение токена при успешной авторизации

#### `Register.test.js`

- Отображение формы регистрации
- Ошибка на пустые поля
- Ошибка когда пароли не совпадают
- Ошибка для короткого пароля
- Успешная регистрация

#### `Post.test.js`

- Отображение информации поста
- Отображение кнопок редактирования и удаления
- Открытие формы редактирования
- Сохранение изменений при редактировании
- Вызов callback удаления
- Отображение изображения если оно есть

#### `Comments.test.js`

- Отображение списка комментариев
- Отображение формы добавления комментария
- Ошибка при пустом комментарии
- Ошибка если комментарий слишком длинный
- Отправка нового комментария
- Отображение кнопки удаления только для собственных комментариев
- Удаление комментария
- Сообщение когда нет комментариев
- Очистка формы после отправки

## Лучшие практики

### Запуск перед коммитом

```bash
# Backend
cd backend
pytest tests/ -v

# Frontend
cd frontend
npm test -- --coverage --watchAll=false
```

### CI/CD Pipeline

Рекомендуется добавить в GitHub Actions:

1. Запуск unit тестов
2. Запуск integration тестов
3. Проверка coverage (минимум 80%)
4. Запуск E2E тестов в Docker Compose

## Генерирование отчета о покрытии

### Backend

```bash
cd backend
pytest tests/ --cov=. --cov-report=html --cov-report=term
# Откройте htmlcov/index.html в броузере
```

### Frontend

```bash
cd frontend
npm test -- --coverage --watchAll=false
# Откройте coverage/lcov-report/index.html в броузере
```

## Troubleshooting

### E2E тесты не запускаются

1. Проверьте что Docker Compose запущен
2. Убедитесь что Selenium Grid доступен на localhost:4444
3. Проверьте что frontend запущен на localhost:3000

### Unit тесты не находят модули

1. Убедитесь что находитесь в правильной директории
2. Проверьте PYTHONPATH
3. Перепроверьте импорты в conftest.py

### Frontend тесты не работают

1. Запустите `npm install`
2. Убедитесь что используется Node 14+ и npm 6+
3. Очистите node_modules: `rm -rf node_modules && npm install`

## Дополнительные файлы

- `pytest.ini` - Конфигурация pytest
- `jest.config.js` - Конфигурация Jest (если нужна)
- `.coveragerc` - Конфигурация coverage для backend
