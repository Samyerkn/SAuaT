# SAT for Kazakhstan 🎓

Платформа подготовки к SAT для казахстанских студентов.
Разработана на основе исследования (n=50): 96% студентов готовы платить за цифровую платформу.

---

## Стек

| Слой | Технология |
|------|-----------|
| Frontend | React 18 + Vite + React Router |
| Стейт | Zustand |
| Графики | Recharts |
| Backend | FastAPI (Python 3.11) |
| База данных | SQLite (легко заменить на PostgreSQL/Supabase) |
| Auth | JWT + bcrypt |
| AI | Anthropic Claude (claude-sonnet-4) |
| Deploy | Vercel (front) + Railway (back) |

---

## Быстрый старт

### 1. Бэкенд

```bash
cd backend

# Установить зависимости
pip install -r requirements.txt

# Создать .env файл
cp .env.example .env
# Вписать свой ANTHROPIC_API_KEY в .env

# Запустить сервер
uvicorn main:app --reload --port 8000
```

API будет доступен на http://localhost:8000
Документация: http://localhost:8000/docs

### 2. Фронтенд

```bash
cd frontend

# Установить зависимости
npm install

# Запустить dev сервер
npm run dev
```

Сайт будет доступен на http://localhost:5173

---

## Структура проекта

```
sat-kz/
├── backend/
│   ├── main.py           # FastAPI приложение (все роуты)
│   ├── sat_kz.db         # SQLite база данных (создаётся автоматически)
│   ├── requirements.txt  # Python зависимости
│   └── .env.example      # Пример переменных окружения
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── index.js      # Axios клиент + все API вызовы
    │   ├── store/
    │   │   └── index.js      # Zustand store (auth + progress)
    │   ├── pages/
    │   │   ├── Login.jsx       # Страница входа
    │   │   ├── Register.jsx    # Регистрация
    │   │   ├── Dashboard.jsx   # Главная с KPI и графиками
    │   │   ├── Exam.jsx        # Mock экзамен с таймером
    │   │   ├── AIChat.jsx      # Чат с Claude AI
    │   │   ├── Universities.jsx # Университеты Казахстана
    │   │   └── Profile.jsx     # Профиль + статистика
    │   ├── components/
    │   │   └── Layout.jsx      # Навигация + layout
    │   ├── App.jsx             # Роутер + protected routes
    │   ├── main.jsx            # Entry point
    │   └── index.css           # Дизайн система (токены, компоненты)
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## API Endpoints

| Метод | URL | Описание |
|-------|-----|---------|
| POST | /auth/register | Регистрация |
| POST | /auth/login | Вход |
| GET | /user/me | Текущий пользователь |
| PUT | /user/profile | Обновить профиль |
| GET | /user/progress | Прогресс + история тестов |
| GET | /exam/questions/{subject} | Вопросы (math/reading/writing) |
| POST | /exam/submit | Сдать тест, обновить прогресс |
| POST | /ai/chat | Чат с Claude AI |
| GET | /ai/history | История чата |
| DELETE | /ai/history | Очистить чат |
| GET | /universities | Список университетов |
| GET | /stats | Данные из лаб. работ |

---

## База данных (SQLite)

```sql
users         -- id, name, email, password_hash, grade, city, target_university, target_score
progress      -- user_id, sat_score, tests_completed, streak, math/reading/writing_progress, activity
test_history  -- user_id, subject, sat_score, accuracy, correct, total, created_at
chat_messages -- user_id, role, content, created_at
```

---

## Функционал (по требованиям)

- ✅ **Authentication** — JWT регистрация/логин, bcrypt пароли
- ✅ **User Profile** — редактирование, статистика, цели
- ✅ **AI Assistant** — реальный Claude API, история чата в БД
- ✅ **Mock Exam** — вопросы из API, таймер, результаты, прогресс в БД
- ✅ **Dashboard** — KPI, recharts графики, прогресс по предметам
- ✅ **Universities** — база вузов с требованиями к SAT

---

## Deploy на Vercel + Railway

### Бэкенд → Railway

1. Создай аккаунт на railway.app
2. New Project → Deploy from GitHub
3. Добавь переменные: ANTHROPIC_API_KEY, SECRET_KEY
4. Railway автоматически запустит через `uvicorn main:app`

### Фронтенд → Vercel

1. Измени `baseURL` в `src/api/index.js` на URL Railway
2. Задеплой на vercel.com → Import Git Repository

---

## Данные из лабораторных работ (интегрированы)

- Lab 2: Опрос n=50, 96% WTP, 78% mock exam demand, stress μ=3.82
- Lab 3: Конкурентный анализ (Brilliant, Khan Academy, Chegg)
- Lab 4: ML модель WTP — Precision 88.2%, Recall 78.9%, F1 83.3%
