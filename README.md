# English RPG Dashboard

Интерактивный трекер для изучения английского языка с RPG-механиками: XP, уровни, серии дней, ачивки и прогресс в виде эволюции лягушки.

## Что это

8 недель × 7 уроков = 56 занятий. За каждый выполненный блок начисляется XP, пропущенные уроки снимают очки. Прогресс отображается как эволюция лягушки — от яйца до THE FROG.

## Сервисы

| Сервис | Для чего | Тариф |
|---|---|---|
| **GitHub** | Хранение кода, автодеплой в Netlify и Render при пуше в `main` | Бесплатно |
| **Netlify** | Хостинг фронтенда (React + Vite). Автодеплой из GitHub. URL: [english-track.netlify.app](https://english-track.netlify.app) | Бесплатно |
| **Render** | Хостинг бэкенда (Node.js + Express API). Спит после 15 мин неактивности, первый запрос может занять до 60 сек. URL: [english-rpg-dashboard.onrender.com](https://english-rpg-dashboard.onrender.com) | Бесплатно |
| **Neon** | Облачная PostgreSQL база данных. Данные пользователей хранятся здесь и не сбрасываются при деплоях. | Бесплатно (до 512 MB) |

## Стек

- **Frontend:** React 18 + Vite, задеплоен на Netlify
- **Backend:** Node.js + Express, задеплоен на Render
- **База данных:** PostgreSQL (Neon)
- **Авторизация:** JWT, пароли хешируются bcryptjs

## Переменные окружения

### Render (бэкенд)
| Переменная | Описание |
|---|---|
| `DATABASE_URL` | Строка подключения к Neon PostgreSQL |
| `JWT_SECRET` | Секрет для подписи токенов (генерируется автоматически) |
| `NODE_VERSION` | Версия Node.js (22.12.0) |

### Netlify (фронтенд)
| Переменная | Описание |
|---|---|
| `VITE_API_URL` | URL бэкенда на Render, например `https://english-rpg-dashboard.onrender.com` |

## Локальная разработка

```bash
cd english-rpg-dashboard
npm install
# добавь DATABASE_URL в .env (см. .env.example)
npm run dev:all   # фронт на :5173, бэк на :3001
```

Логин по умолчанию: `admin` / `english2026`
