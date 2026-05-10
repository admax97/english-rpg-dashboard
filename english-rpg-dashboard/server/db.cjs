const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const db = new DatabaseSync(path.join(__dirname, '../database.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
  );

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
    notes TEXT DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS weekly_reviews (
    week INTEGER PRIMARY KEY,
    focus TEXT DEFAULT '',
    grammar TEXT DEFAULT '',
    what_improved TEXT DEFAULT '',
    what_was_hard TEXT DEFAULT '',
    adjustment TEXT DEFAULT ''
  );
`);

module.exports = db;
