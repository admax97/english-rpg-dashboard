require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { pool, initDb } = require('./db.cjs');
const { runSeed } = require('./seed.cjs');

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
  const allNone = BLOCKS.every(b => !lesson[b] || lesson[b] === 'None');
  if (allNone && !lesson.studied_date && lesson.date < today) xp -= 30;
  return xp;
}

function computeStats(lessons) {
  const today = new Date().toISOString().slice(0, 10);
  let rawXP = 0, completedLessons = 0, overdueCount = 0, totalActualMin = 0;

  for (const l of lessons) {
    rawXP += lessonXP(l, today);
    const score = BLOCKS.reduce((acc, b) => {
      if (l[b] === 'Done') return acc + 1;
      if (l[b] === 'Partial') return acc + 0.5;
      return acc;
    }, 0);
    if (score / 3 >= 0.8) completedLessons++;
    const allNone = BLOCKS.every(b => !l[b] || l[b] === 'None');
    if (allNone && !l.studied_date && l.date < today) overdueCount++;
    totalActualMin += l.actual_min || 0;
  }

  const totalXP = Math.max(0, rawXP);
  const level = Math.floor(totalXP / 300) + 1;
  const xpInLevel = totalXP % 300;

  const dateSet = new Set();
  for (const l of lessons) {
    if (!hasActivity(l)) continue;
    const d = l.studied_date || l.date;
    if (d <= today) dateSet.add(d);
  }
  const dates = Array.from(dateSet).sort().reverse();
  let streak = 0, prev = today;
  for (const d of dates) {
    const diff = (new Date(prev) - new Date(d)) / 86400000;
    if (diff <= 1) { streak++; prev = d; }
    else break;
  }

  return { totalXP, level, xpInLevel, streak, completedLessons, overdueCount, totalActualMin };
}

// POST /api/login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });
    const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = rows[0];
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    await pool.query('UPDATE users SET login_count = login_count + 1 WHERE id = $1', [user.id]);
    const { rows: updated } = await pool.query('SELECT login_count FROM users WHERE id = $1', [user.id]);
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, username: user.username, loginCount: updated[0].login_count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/lessons
app.get('/api/lessons', auth, async (req, res) => {
  try {
    const { rows: lessons } = await pool.query('SELECT * FROM lessons ORDER BY id');
    res.json({ lessons, stats: computeStats(lessons) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/lessons/:id
app.patch('/api/lessons/:id', auth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const allowed = ['actual_min', 'studied_date', ...BLOCKS, 'notes', 'is_completed'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    if (!Object.keys(updates).length) return res.status(400).json({ error: 'Nothing to update' });
    const keys = Object.keys(updates);
    const sets = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
    const values = [...keys.map(k => updates[k]), id];
    await pool.query(`UPDATE lessons SET ${sets} WHERE id = $${keys.length + 1}`, values);
    const { rows } = await pool.query('SELECT * FROM lessons WHERE id = $1', [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/reviews
app.get('/api/reviews', auth, async (req, res) => {
  try {
    const { rows: reviews } = await pool.query('SELECT * FROM weekly_reviews ORDER BY week');
    res.json({ reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/reviews/:week
app.patch('/api/reviews/:week', auth, async (req, res) => {
  try {
    const week = Number(req.params.week);
    const allowed = ['what_improved', 'what_was_hard', 'adjustment'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    if (!Object.keys(updates).length) return res.status(400).json({ error: 'Nothing to update' });
    const keys = Object.keys(updates);
    const sets = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
    const values = [...keys.map(k => updates[k]), week];
    await pool.query(`UPDATE weekly_reviews SET ${sets} WHERE week = $${keys.length + 1}`, values);
    const { rows } = await pool.query('SELECT * FROM weekly_reviews WHERE week = $1', [week]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

async function start() {
  await initDb();
  await runSeed();
  app.listen(PORT, () => console.log(`[server] API running on http://localhost:${PORT}`));
}

start().catch(err => { console.error(err); process.exit(1); });
