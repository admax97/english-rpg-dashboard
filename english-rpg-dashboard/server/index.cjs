require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./db.cjs');
require('./seed.cjs');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'english-rpg-secret-2026';

const BLOCKS = ['vocabulary', 'listening', 'speaking'];

app.use(cors({ origin: '*' }));
app.use(express.json());

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(header.slice(7), JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

function hasActivity(lesson) {
  return BLOCKS.some(b => lesson[b] === 'Done' || lesson[b] === 'Partial');
}

function lessonXP(lesson, today) {
  let xp = BLOCKS.reduce((acc, b) => {
    if (lesson[b] === 'Done') return acc + 20;
    if (lesson[b] === 'Partial') return acc + 10;
    return acc;
  }, 0);
  // Only penalise if no studied_date set and no activity and schedule is overdue
  const allNone = BLOCKS.every(b => !lesson[b] || lesson[b] === 'None');
  if (allNone && !lesson.studied_date && lesson.date < today) xp -= 30;
  return xp;
}

function computeStats(lessons) {
  const today = new Date().toISOString().slice(0, 10);
  let rawXP = 0;
  let completedLessons = 0;
  let overdueCount = 0;
  let totalActualMin = 0;

  for (const l of lessons) {
    rawXP += lessonXP(l, today);
    const score = BLOCKS.reduce((acc, b) => {
      if (l[b] === 'Done') return acc + 1;
      if (l[b] === 'Partial') return acc + 0.5;
      return acc;
    }, 0);
    if (score / 3 >= 0.8) completedLessons++;
    const allNone = BLOCKS.every(b => !l[b] || l[b] === 'None');
    // Overdue: no studied date, no activity, scheduled date is past
    if (allNone && !l.studied_date && l.date < today) overdueCount++;
    totalActualMin += l.actual_min || 0;
  }

  const totalXP = Math.max(0, rawXP);
  const level = Math.floor(totalXP / 300) + 1;
  const xpInLevel = totalXP % 300;

  // Streak: group by actual study date (studied_date if set, else scheduled date for active lessons)
  const dateSet = new Set();
  for (const l of lessons) {
    if (!hasActivity(l)) continue;
    const d = l.studied_date || l.date;
    if (d <= today) dateSet.add(d);
  }
  const dates = Array.from(dateSet).sort().reverse();
  let streak = 0;
  let prev = today;
  for (const d of dates) {
    const diff = (new Date(prev) - new Date(d)) / 86400000;
    if (diff <= 1) { streak++; prev = d; }
    else break;
  }

  return { totalXP, level, xpInLevel, streak, completedLessons, overdueCount, totalActualMin };
}

// POST /api/login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  db.prepare('UPDATE users SET login_count = login_count + 1 WHERE id = ?').run(user.id);
  const { login_count } = db.prepare('SELECT login_count FROM users WHERE id = ?').get(user.id);
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, username: user.username, loginCount: login_count });
});

// GET /api/lessons
app.get('/api/lessons', auth, (req, res) => {
  const lessons = db.prepare('SELECT * FROM lessons ORDER BY id').all();
  res.json({ lessons, stats: computeStats(lessons) });
});

// PATCH /api/lessons/:id
app.patch('/api/lessons/:id', auth, (req, res) => {
  const id = Number(req.params.id);
  const allowed = ['actual_min', 'studied_date', ...BLOCKS, 'notes', 'is_completed'];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }
  if (!Object.keys(updates).length) return res.status(400).json({ error: 'Nothing to update' });
  const sets = Object.keys(updates).map(k => `${k} = @${k}`).join(', ');
  db.prepare(`UPDATE lessons SET ${sets} WHERE id = @id`).run({ ...updates, id });
  const lesson = db.prepare('SELECT * FROM lessons WHERE id = ?').get(id);
  res.json(lesson);
});

// GET /api/reviews
app.get('/api/reviews', auth, (req, res) => {
  const reviews = db.prepare('SELECT * FROM weekly_reviews ORDER BY week').all();
  res.json({ reviews });
});

// PATCH /api/reviews/:week
app.patch('/api/reviews/:week', auth, (req, res) => {
  const week = Number(req.params.week);
  const allowed = ['what_improved', 'what_was_hard', 'adjustment'];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }
  if (!Object.keys(updates).length) return res.status(400).json({ error: 'Nothing to update' });
  const sets = Object.keys(updates).map(k => `${k} = @${k}`).join(', ');
  db.prepare(`UPDATE weekly_reviews SET ${sets} WHERE week = @week`).run({ ...updates, week });
  const review = db.prepare('SELECT * FROM weekly_reviews WHERE week = ?').get(week);
  res.json(review);
});

app.listen(PORT, () => console.log(`[server] API running on http://localhost:${PORT}`));
