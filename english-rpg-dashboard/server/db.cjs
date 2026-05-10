const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined,
});

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      login_count INTEGER DEFAULT 0
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS lessons (
      id INTEGER PRIMARY KEY,
      date TEXT NOT NULL,
      week INTEGER NOT NULL,
      day TEXT NOT NULL,
      focus TEXT NOT NULL,
      grammar TEXT NOT NULL,
      theme TEXT NOT NULL,
      block TEXT NOT NULL,
      task TEXT NOT NULL,
      planned_min INTEGER NOT NULL,
      actual_min INTEGER DEFAULT 0,
      vocabulary TEXT DEFAULT 'None',
      listening TEXT DEFAULT 'None',
      speaking TEXT DEFAULT 'None',
      writing TEXT DEFAULT 'None',
      review TEXT DEFAULT 'None',
      voice TEXT DEFAULT 'None',
      studied_date TEXT DEFAULT NULL,
      notes TEXT DEFAULT '',
      is_completed INTEGER DEFAULT 0
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS weekly_reviews (
      week INTEGER PRIMARY KEY,
      focus TEXT DEFAULT '',
      grammar TEXT DEFAULT '',
      what_improved TEXT DEFAULT '',
      what_was_hard TEXT DEFAULT '',
      adjustment TEXT DEFAULT ''
    )
  `);
  // Migrations for existing tables
  await pool.query(`ALTER TABLE lessons ADD COLUMN IF NOT EXISTS is_completed INTEGER DEFAULT 0`).catch(() => {});
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0`).catch(() => {});
}

module.exports = { pool, initDb };
