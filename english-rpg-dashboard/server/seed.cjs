const db = require('./db.cjs');
const bcrypt = require('bcryptjs');

// Default user: admin / english2026
const existingUser = db.prepare('SELECT id FROM users WHERE username = ?').get('admin');
if (!existingUser) {
  const hash = bcrypt.hashSync('english2026', 10);
  db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run('admin', hash);
  console.log('[seed] Created user: admin / english2026');
}

const LESSONS = [
  { id:1,  date:'2026-04-20', week:1, day:'Mon', focus:'Разогрев и возврат автоматизма', grammar:'Present Simple, Present Continuous', theme:'introducing yourself, daily routine, work and responsibilities', block:'Vocabulary + Listening', task:'Выучи 5-7 фраз, послушай 1 короткое видео, перескажи вслух', planned_min:35 },
  { id:2,  date:'2026-04-21', week:1, day:'Tue', focus:'Разогрев и возврат автоматизма', grammar:'Present Simple, Present Continuous', theme:'introducing yourself, daily routine, work and responsibilities', block:'Grammar + Speaking', task:'Разбери grammar block недели, сделай 10-15 своих предложений, 2 минуты speaking', planned_min:35 },
  { id:3,  date:'2026-04-22', week:1, day:'Wed', focus:'Разогрев и возврат автоматизма', grammar:'Present Simple, Present Continuous', theme:'introducing yourself, daily routine, work and responsibilities', block:'Listening + Shadowing', task:'Короткий отрывок: слушай, повторяй за диктором, запиши себя', planned_min:35 },
  { id:4,  date:'2026-04-23', week:1, day:'Thu', focus:'Разогрев и возврат автоматизма', grammar:'Present Simple, Present Continuous', theme:'introducing yourself, daily routine, work and responsibilities', block:'Reading + Vocabulary', task:'Прочитай короткий текст, выпиши 5 фраз, составь свои примеры', planned_min:35 },
  { id:5,  date:'2026-04-24', week:1, day:'Fri', focus:'Разогрев и возврат автоматизма', grammar:'Present Simple, Present Continuous', theme:'introducing yourself, daily routine, work and responsibilities', block:'Speaking + Writing', task:'2-3 минуты свободной речи, затем 8-10 предложений письменно', planned_min:35 },
  { id:6,  date:'2026-04-25', week:1, day:'Sat', focus:'Разогрев и возврат автоматизма', grammar:'Present Simple, Present Continuous', theme:'introducing yourself, daily routine, work and responsibilities', block:'Long Practice', task:'45-60 минут: видео, интервью, подкаст или разговор, затем summary', planned_min:50 },
  { id:7,  date:'2026-04-26', week:1, day:'Sun', focus:'Разогрев и возврат автоматизма', grammar:'Present Simple, Present Continuous', theme:'introducing yourself, daily routine, work and responsibilities', block:'Light Review', task:'Повтори карточки, 5 минут речи, без перегруза', planned_min:20 },
  { id:8,  date:'2026-04-27', week:2, day:'Mon', focus:'Прошлое и опыт', grammar:'Past Simple, Present Perfect', theme:'previous work, past decisions, experience and results', block:'Vocabulary + Listening', task:'Выучи 5-7 фраз, послушай 1 короткое видео, перескажи вслух', planned_min:35 },
  { id:9,  date:'2026-04-28', week:2, day:'Tue', focus:'Прошлое и опыт', grammar:'Past Simple, Present Perfect', theme:'previous work, past decisions, experience and results', block:'Grammar + Speaking', task:'Разбери grammar block недели, сделай 10-15 своих предложений, 2 минуты speaking', planned_min:35 },
  { id:10, date:'2026-04-29', week:2, day:'Wed', focus:'Прошлое и опыт', grammar:'Past Simple, Present Perfect', theme:'previous work, past decisions, experience and results', block:'Listening + Shadowing', task:'Короткий отрывок: слушай, повторяй за диктором, запиши себя', planned_min:35 },
  { id:11, date:'2026-04-30', week:2, day:'Thu', focus:'Прошлое и опыт', grammar:'Past Simple, Present Perfect', theme:'previous work, past decisions, experience and results', block:'Reading + Vocabulary', task:'Прочитай короткий текст, выпиши 5 фраз, составь свои примеры', planned_min:35 },
  { id:12, date:'2026-05-01', week:2, day:'Fri', focus:'Прошлое и опыт', grammar:'Past Simple, Present Perfect', theme:'previous work, past decisions, experience and results', block:'Speaking + Writing', task:'2-3 минуты свободной речи, затем 8-10 предложений письменно', planned_min:35 },
  { id:13, date:'2026-05-02', week:2, day:'Sat', focus:'Прошлое и опыт', grammar:'Past Simple, Present Perfect', theme:'previous work, past decisions, experience and results', block:'Long Practice', task:'45-60 минут: видео, интервью, подкаст или разговор, затем summary', planned_min:50 },
  { id:14, date:'2026-05-03', week:2, day:'Sun', focus:'Прошлое и опыт', grammar:'Past Simple, Present Perfect', theme:'previous work, past decisions, experience and results', block:'Light Review', task:'Повтори карточки, 5 минут речи, без перегруза', planned_min:20 },
  { id:15, date:'2026-05-04', week:3, day:'Mon', focus:'Будущее и планы', grammar:'will, going to, Present Continuous for plans', theme:'next week plans, goals, priorities', block:'Vocabulary + Listening', task:'Выучи 5-7 фраз, послушай 1 короткое видео, перескажи вслух', planned_min:35 },
  { id:16, date:'2026-05-05', week:3, day:'Tue', focus:'Будущее и планы', grammar:'will, going to, Present Continuous for plans', theme:'next week plans, goals, priorities', block:'Grammar + Speaking', task:'Разбери grammar block недели, сделай 10-15 своих предложений, 2 минуты speaking', planned_min:35 },
  { id:17, date:'2026-05-06', week:3, day:'Wed', focus:'Будущее и планы', grammar:'will, going to, Present Continuous for plans', theme:'next week plans, goals, priorities', block:'Listening + Shadowing', task:'Короткий отрывок: слушай, повторяй за диктором, запиши себя', planned_min:35 },
  { id:18, date:'2026-05-07', week:3, day:'Thu', focus:'Будущее и планы', grammar:'will, going to, Present Continuous for plans', theme:'next week plans, goals, priorities', block:'Reading + Vocabulary', task:'Прочитай короткий текст, выпиши 5 фраз, составь свои примеры', planned_min:35 },
  { id:19, date:'2026-05-08', week:3, day:'Fri', focus:'Будущее и планы', grammar:'will, going to, Present Continuous for plans', theme:'next week plans, goals, priorities', block:'Speaking + Writing', task:'2-3 минуты свободной речи, затем 8-10 предложений письменно', planned_min:35 },
  { id:20, date:'2026-05-09', week:3, day:'Sat', focus:'Будущее и планы', grammar:'will, going to, Present Continuous for plans', theme:'next week plans, goals, priorities', block:'Long Practice', task:'45-60 минут: видео, интервью, подкаст или разговор, затем summary', planned_min:50 },
  { id:21, date:'2026-05-10', week:3, day:'Sun', focus:'Будущее и планы', grammar:'will, going to, Present Continuous for plans', theme:'next week plans, goals, priorities', block:'Light Review', task:'Повтори карточки, 5 минут речи, без перегруза', planned_min:20 },
  { id:22, date:'2026-05-11', week:4, day:'Mon', focus:'Мнение, согласие, несогласие', grammar:'Opinion phrases, linkers', theme:'opinions, pros and cons, preferences', block:'Vocabulary + Listening', task:'Выучи 5-7 фраз, послушай 1 короткое видео, перескажи вслух', planned_min:35 },
  { id:23, date:'2026-05-12', week:4, day:'Tue', focus:'Мнение, согласие, несогласие', grammar:'Opinion phrases, linkers', theme:'opinions, pros and cons, preferences', block:'Grammar + Speaking', task:'Разбери grammar block недели, сделай 10-15 своих предложений, 2 минуты speaking', planned_min:35 },
  { id:24, date:'2026-05-13', week:4, day:'Wed', focus:'Мнение, согласие, несогласие', grammar:'Opinion phrases, linkers', theme:'opinions, pros and cons, preferences', block:'Listening + Shadowing', task:'Короткий отрывок: слушай, повторяй за диктором, запиши себя', planned_min:35 },
  { id:25, date:'2026-05-14', week:4, day:'Thu', focus:'Мнение, согласие, несогласие', grammar:'Opinion phrases, linkers', theme:'opinions, pros and cons, preferences', block:'Reading + Vocabulary', task:'Прочитай короткий текст, выпиши 5 фраз, составь свои примеры', planned_min:35 },
  { id:26, date:'2026-05-15', week:4, day:'Fri', focus:'Мнение, согласие, несогласие', grammar:'Opinion phrases, linkers', theme:'opinions, pros and cons, preferences', block:'Speaking + Writing', task:'2-3 минуты свободной речи, затем 8-10 предложений письменно', planned_min:35 },
  { id:27, date:'2026-05-16', week:4, day:'Sat', focus:'Мнение, согласие, несогласие', grammar:'Opinion phrases, linkers', theme:'opinions, pros and cons, preferences', block:'Long Practice', task:'45-60 минут: видео, интервью, подкаст или разговор, затем summary', planned_min:50 },
  { id:28, date:'2026-05-17', week:4, day:'Sun', focus:'Мнение, согласие, несогласие', grammar:'Opinion phrases, linkers', theme:'opinions, pros and cons, preferences', block:'Light Review', task:'Повтори карточки, 5 минут речи, без перегруза', planned_min:20 },
  { id:29, date:'2026-05-18', week:5, day:'Mon', focus:'Условия, решения, проблемы', grammar:'First and second conditional', theme:'risks, mistakes, decisions, problem solving', block:'Vocabulary + Listening', task:'Выучи 5-7 фраз, послушай 1 короткое видео, перескажи вслух', planned_min:35 },
  { id:30, date:'2026-05-19', week:5, day:'Tue', focus:'Условия, решения, проблемы', grammar:'First and second conditional', theme:'risks, mistakes, decisions, problem solving', block:'Grammar + Speaking', task:'Разбери grammar block недели, сделай 10-15 своих предложений, 2 минуты speaking', planned_min:35 },
  { id:31, date:'2026-05-20', week:5, day:'Wed', focus:'Условия, решения, проблемы', grammar:'First and second conditional', theme:'risks, mistakes, decisions, problem solving', block:'Listening + Shadowing', task:'Короткий отрывок: слушай, повторяй за диктором, запиши себя', planned_min:35 },
  { id:32, date:'2026-05-21', week:5, day:'Thu', focus:'Условия, решения, проблемы', grammar:'First and second conditional', theme:'risks, mistakes, decisions, problem solving', block:'Reading + Vocabulary', task:'Прочитай короткий текст, выпиши 5 фраз, составь свои примеры', planned_min:35 },
  { id:33, date:'2026-05-22', week:5, day:'Fri', focus:'Условия, решения, проблемы', grammar:'First and second conditional', theme:'risks, mistakes, decisions, problem solving', block:'Speaking + Writing', task:'2-3 минуты свободной речи, затем 8-10 предложений письменно', planned_min:35 },
  { id:34, date:'2026-05-23', week:5, day:'Sat', focus:'Условия, решения, проблемы', grammar:'First and second conditional', theme:'risks, mistakes, decisions, problem solving', block:'Long Practice', task:'45-60 минут: видео, интервью, подкаст или разговор, затем summary', planned_min:50 },
  { id:35, date:'2026-05-24', week:5, day:'Sun', focus:'Условия, решения, проблемы', grammar:'First and second conditional', theme:'risks, mistakes, decisions, problem solving', block:'Light Review', task:'Повтори карточки, 5 минут речи, без перегруза', planned_min:20 },
  { id:36, date:'2026-05-25', week:6, day:'Mon', focus:'Натуральная речь и phrasal verbs', grammar:'Phrasal verbs and collocations', theme:'communication, delays, priorities and changes', block:'Vocabulary + Listening', task:'Выучи 5-7 фраз, послушай 1 короткое видео, перескажи вслух', planned_min:35 },
  { id:37, date:'2026-05-26', week:6, day:'Tue', focus:'Натуральная речь и phrasal verbs', grammar:'Phrasal verbs and collocations', theme:'communication, delays, priorities and changes', block:'Grammar + Speaking', task:'Разбери grammar block недели, сделай 10-15 своих предложений, 2 минуты speaking', planned_min:35 },
  { id:38, date:'2026-05-27', week:6, day:'Wed', focus:'Натуральная речь и phrasal verbs', grammar:'Phrasal verbs and collocations', theme:'communication, delays, priorities and changes', block:'Listening + Shadowing', task:'Короткий отрывок: слушай, повторяй за диктором, запиши себя', planned_min:35 },
  { id:39, date:'2026-05-28', week:6, day:'Thu', focus:'Натуральная речь и phrasal verbs', grammar:'Phrasal verbs and collocations', theme:'communication, delays, priorities and changes', block:'Reading + Vocabulary', task:'Прочитай короткий текст, выпиши 5 фраз, составь свои примеры', planned_min:35 },
  { id:40, date:'2026-05-29', week:6, day:'Fri', focus:'Натуральная речь и phrasal verbs', grammar:'Phrasal verbs and collocations', theme:'communication, delays, priorities and changes', block:'Speaking + Writing', task:'2-3 минуты свободной речи, затем 8-10 предложений письменно', planned_min:35 },
  { id:41, date:'2026-05-30', week:6, day:'Sat', focus:'Натуральная речь и phrasal verbs', grammar:'Phrasal verbs and collocations', theme:'communication, delays, priorities and changes', block:'Long Practice', task:'45-60 минут: видео, интервью, подкаст или разговор, затем summary', planned_min:50 },
  { id:42, date:'2026-05-31', week:6, day:'Sun', focus:'Натуральная речь и phrasal verbs', grammar:'Phrasal verbs and collocations', theme:'communication, delays, priorities and changes', block:'Light Review', task:'Повтори карточки, 5 минут речи, без перегруза', planned_min:20 },
  { id:43, date:'2026-06-01', week:7, day:'Mon', focus:'Сильное аудирование', grammar:'Connected speech and discourse markers', theme:'interviews, podcasts, natural conversation', block:'Vocabulary + Listening', task:'Выучи 5-7 фраз, послушай 1 короткое видео, перескажи вслух', planned_min:35 },
  { id:44, date:'2026-06-02', week:7, day:'Tue', focus:'Сильное аудирование', grammar:'Connected speech and discourse markers', theme:'interviews, podcasts, natural conversation', block:'Grammar + Speaking', task:'Разбери grammar block недели, сделай 10-15 своих предложений, 2 минуты speaking', planned_min:35 },
  { id:45, date:'2026-06-03', week:7, day:'Wed', focus:'Сильное аудирование', grammar:'Connected speech and discourse markers', theme:'interviews, podcasts, natural conversation', block:'Listening + Shadowing', task:'Короткий отрывок: слушай, повторяй за диктором, запиши себя', planned_min:35 },
  { id:46, date:'2026-06-04', week:7, day:'Thu', focus:'Сильное аудирование', grammar:'Connected speech and discourse markers', theme:'interviews, podcasts, natural conversation', block:'Reading + Vocabulary', task:'Прочитай короткий текст, выпиши 5 фраз, составь свои примеры', planned_min:35 },
  { id:47, date:'2026-06-05', week:7, day:'Fri', focus:'Сильное аудирование', grammar:'Connected speech and discourse markers', theme:'interviews, podcasts, natural conversation', block:'Speaking + Writing', task:'2-3 минуты свободной речи, затем 8-10 предложений письменно', planned_min:35 },
  { id:48, date:'2026-06-06', week:7, day:'Sat', focus:'Сильное аудирование', grammar:'Connected speech and discourse markers', theme:'interviews, podcasts, natural conversation', block:'Long Practice', task:'45-60 минут: видео, интервью, подкаст или разговор, затем summary', planned_min:50 },
  { id:49, date:'2026-06-07', week:7, day:'Sun', focus:'Сильное аудирование', grammar:'Connected speech and discourse markers', theme:'interviews, podcasts, natural conversation', block:'Light Review', task:'Повтори карточки, 5 минут речи, без перегруза', planned_min:20 },
  { id:50, date:'2026-06-08', week:8, day:'Mon', focus:'Интеграция и выход в практику', grammar:'Integrated review', theme:'explain your work, goals, problems and solutions', block:'Vocabulary + Listening', task:'Выучи 5-7 фраз, послушай 1 короткое видео, перескажи вслух', planned_min:35 },
  { id:51, date:'2026-06-09', week:8, day:'Tue', focus:'Интеграция и выход в практику', grammar:'Integrated review', theme:'explain your work, goals, problems and solutions', block:'Grammar + Speaking', task:'Разбери grammar block недели, сделай 10-15 своих предложений, 2 минуты speaking', planned_min:35 },
  { id:52, date:'2026-06-10', week:8, day:'Wed', focus:'Интеграция и выход в практику', grammar:'Integrated review', theme:'explain your work, goals, problems and solutions', block:'Listening + Shadowing', task:'Короткий отрывок: слушай, повторяй за диктором, запиши себя', planned_min:35 },
  { id:53, date:'2026-06-11', week:8, day:'Thu', focus:'Интеграция и выход в практику', grammar:'Integrated review', theme:'explain your work, goals, problems and solutions', block:'Reading + Vocabulary', task:'Прочитай короткий текст, выпиши 5 фраз, составь свои примеры', planned_min:35 },
  { id:54, date:'2026-06-12', week:8, day:'Fri', focus:'Интеграция и выход в практику', grammar:'Integrated review', theme:'explain your work, goals, problems and solutions', block:'Speaking + Writing', task:'2-3 минуты свободной речи, затем 8-10 предложений письменно', planned_min:35 },
  { id:55, date:'2026-06-13', week:8, day:'Sat', focus:'Интеграция и выход в практику', grammar:'Integrated review', theme:'explain your work, goals, problems and solutions', block:'Long Practice', task:'45-60 минут: видео, интервью, подкаст или разговор, затем summary', planned_min:50 },
  { id:56, date:'2026-06-14', week:8, day:'Sun', focus:'Интеграция и выход в практику', grammar:'Integrated review', theme:'explain your work, goals, problems and solutions', block:'Light Review', task:'Повтори карточки, 5 минут речи, без перегруза', planned_min:20 },
];

const lessonCount = db.prepare('SELECT COUNT(*) as cnt FROM lessons').get();
if (lessonCount.cnt === 0) {
  const insert = db.prepare(`
    INSERT INTO lessons (id, date, week, day, focus, grammar, theme, block, task, planned_min)
    VALUES (@id, @date, @week, @day, @focus, @grammar, @theme, @block, @task, @planned_min)
  `);
  db.exec('BEGIN');
  LESSONS.forEach(r => insert.run(r));
  db.exec('COMMIT');
  console.log('[seed] Inserted 56 lessons');
}

const REVIEWS = [
  { week:1, focus:'Разогрев и возврат автоматизма',       grammar:'Present Simple, Present Continuous' },
  { week:2, focus:'Прошлое и опыт',                       grammar:'Past Simple, Present Perfect' },
  { week:3, focus:'Будущее и планы',                      grammar:'will, going to, Present Continuous for plans' },
  { week:4, focus:'Мнение, согласие, несогласие',         grammar:'Opinion phrases, linkers' },
  { week:5, focus:'Условия, решения, проблемы',           grammar:'First and second conditional' },
  { week:6, focus:'Натуральная речь и phrasal verbs',     grammar:'Phrasal verbs and collocations' },
  { week:7, focus:'Сильное аудирование',                  grammar:'Connected speech and discourse markers' },
  { week:8, focus:'Интеграция и выход в практику',        grammar:'Integrated review' },
];

const reviewCount = db.prepare('SELECT COUNT(*) as cnt FROM weekly_reviews').get();
if (reviewCount.cnt === 0) {
  const insertReview = db.prepare(`
    INSERT INTO weekly_reviews (week, focus, grammar) VALUES (@week, @focus, @grammar)
  `);
  db.exec('BEGIN');
  REVIEWS.forEach(r => insertReview.run(r));
  db.exec('COMMIT');
  console.log('[seed] Inserted 8 weekly reviews');
}
