# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview


## Stack

- **Frontend**: React 18 + Vite (port 5173)
- **Backend**: Node.js 25 + Express (port 3001), uses `node:sqlite` built-in (no native compilation needed)
- **Auth**: JWT (7-day expiry), credentials stored hashed with bcryptjs in SQLite

## Commands

All commands run from `english-rpg-dashboard/` (inner directory):

```bash
npm install                 # first-time setup
npm run dev:all             # start both servers (Vite + Express) with concurrently
# or separately:
npm run dev                 # Vite frontend on :5173
npm run dev:server          # Express API on :3001 with --watch
```

Default login: `admin` / `english2026` (set in `server/seed.cjs`).  
Database file: `english-rpg-dashboard/database.db` (auto-created on first server start).

## Architecture

**Backend** (`server/`):
- `db.cjs` — opens `database.db`, creates 3 tables: `users`, `lessons`, `weekly_reviews`
- `seed.cjs` — seeds default admin user + all 56 lessons + 8 weekly review stubs on first run (idempotent)
- `index.cjs` — Express routes: `POST /api/login`, `GET/PATCH /api/lessons`, `GET/PATCH /api/lessons/:id`, `GET /api/reviews`, `PATCH /api/reviews/:week`

All server files use `.cjs` extension to stay CommonJS while the frontend uses ES modules (`"type": "module"` in package.json).

**Frontend** (`src/`):
- `api.js` — fetch wrapper that injects JWT from `localStorage`; auto-reloads on 401
- `App.jsx` — auth gate; holds `lessons`, `stats`, `reviews` state; fires `loadData()` on `lesson-updated` CustomEvent
- `components/Login.jsx` — login form
- `components/Header.jsx` — sticky header with XP progress bar (300 XP per level)
- `components/StatsGrid.jsx` — streak, time studied, completed lessons, overdue count
- `components/LessonTracker.jsx` — 56 lesson rows grouped by week; each row has 6 block status selects (Vocabulary/Listening/Speaking/Writing/Review/Voice: None/Done/Partial/Skipped), actual minutes input, notes; updates are debounced + dispatched via `lesson-updated` event
- `components/WeeklyReview.jsx` — accordion of 8 weekly reviews with auto-computed stats + 3 text fields
- `components/Achievements.jsx` — 8 achievement badges checked against live stats

**XP system** (computed server-side in `computeStats()`, mirrored client-side in `LessonTracker.jsx`):
- Done block: +20 XP, Partial: +10 XP
- Overdue lesson (all blocks None AND date < today): −30 XP penalty
- Total XP clamped to 0 minimum
- Level = `floor(XP / 300) + 1`

**Vite proxy**: All `/api/*` requests from the frontend proxy to `http://localhost:3001`.
