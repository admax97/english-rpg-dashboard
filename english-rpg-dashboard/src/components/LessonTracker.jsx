import React, { useCallback, useRef } from 'react'
import { updateLesson } from '../api'

const BLOCKS = ['vocabulary', 'listening', 'speaking']
const BLOCK_LABELS = { vocabulary: 'Voc', listening: 'Lis', speaking: 'Spk' }
const STATUSES = ['None', 'Done', 'Partial', 'Skipped']
const TODAY = new Date().toISOString().slice(0, 10)

const PLAYLIST_ID = 'PLD6SPjEPomavd9p66Hme87w11KqPxthKV'
const PLAYLIST_VIDEOS = [
  'J0DA8JB2vhQ', 'bfjRfyz8YVk', 'iad54YG19uw', 'QduIO_1LWrE',
  'StbtwAkylgE', '4r-CsWGYVwk', '_qunipvwMeI', 'nOwOGvB-P3Y',
  'rlt3LX91L1o', 'Bh9UN9YCVjw', 'lx7jLbYIPEk', 'o-HVGryhSxU',
  'jr28Is1wIvM', 'OEN5bNFYGbA', 'IyMIXsGcek0', '9rJvZ37EgcU',
  '7F396aMzbf4', 'J_AxmCMasYw',
]

const WEEK_MEDIA = {
  1: { title: 'Friends',              type: 'series',  note: 'S1–S2 — natural everyday speech' },
  2: { title: 'The Office (US)',       type: 'series',  note: 'S1–S2 — past stories, workplace English' },
  3: { title: 'How I Met Your Mother', type: 'series',  note: 'S1–S2 — plans, future, storytelling' },
  4: { title: 'Brooklyn Nine-Nine',    type: 'series',  note: 'S1–S2 — debates, opinions, humour' },
  5: { title: 'Breaking Bad',          type: 'series',  note: 'S1 — decisions, consequences, tension' },
  6: { title: 'Sherlock (BBC)',         type: 'series',  note: 'S1 — fast natural speech, phrasal verbs' },
  7: { title: 'TED Talks / Lex Fridman Podcast', type: 'podcast', note: 'intensive listening practice' },
  8: { title: 'Interstellar',          type: 'film',    note: '2014 — complex English, great for review' },
}

function videoForLesson(id) {
  return PLAYLIST_VIDEOS[(id - 1) % PLAYLIST_VIDEOS.length]
}

function lessonXP(lesson) {
  const earned = BLOCKS.reduce((acc, b) => {
    if (lesson[b] === 'Done') return acc + 20
    if (lesson[b] === 'Partial') return acc + 10
    return acc
  }, 0)
  const allNone = BLOCKS.every(b => !lesson[b] || lesson[b] === 'None')
  if (allNone && !lesson.studied_date && lesson.date < TODAY) return -30
  return earned
}

function completion(lesson) {
  const score = BLOCKS.reduce((acc, b) => {
    if (lesson[b] === 'Done') return acc + 1
    if (lesson[b] === 'Partial') return acc + 0.5
    return acc
  }, 0)
  return Math.round((score / 3) * 100)
}

function rowClass(lesson) {
  const active = BLOCKS.some(b => lesson[b] === 'Done' || lesson[b] === 'Partial')
  const effectiveDate = lesson.studied_date || lesson.date
  if (effectiveDate === TODAY) return 'row-today'
  if (active) return 'row-past'
  if (lesson.date < TODAY && !lesson.studied_date) return 'row-overdue'
  return 'row-future'
}

export default function LessonTracker({ lessons }) {
  const weeks = [1, 2, 3, 4, 5, 6, 7, 8]
  const byWeek = week => lessons.filter(l => l.week === week)

  return (
    <div className="card">
      <div className="card-header">
        <h2>Daily Lesson Tracker</h2>
        <div className="legend">
          <span className="legend-today">Today</span>
          <span className="legend-overdue">Overdue</span>
          <span className="legend-past">Done</span>
        </div>
      </div>

      {weeks.map(week => (
        <WeekSection key={week} week={week} lessons={byWeek(week)} />
      ))}
    </div>
  )
}

function WeekSection({ week, lessons }) {
  if (!lessons.length) return null
  const media = WEEK_MEDIA[week]

  return (
    <div className="week-section">
      <div className="week-header">
        <span className="week-num">Week {week}</span>
        <span className="week-focus">{lessons[0].focus}</span>
        {media && (
          <span className="week-media">
            {media.type === 'film' ? '🎬' : media.type === 'podcast' ? '🎙' : '📺'}
            {' '}<strong>{media.title}</strong>
            <span className="week-media-note"> — {media.note}</span>
          </span>
        )}
        <span className="week-grammar">{lessons[0].grammar}</span>
      </div>
      <div className="lesson-rows">
        {lessons.map(l => <LessonRow key={l.id} lesson={l} />)}
      </div>
    </div>
  )
}

function LessonRow({ lesson }) {
  const xp = lessonXP(lesson)
  const pct = completion(lesson)
  const cls = rowClass(lesson)
  const timerRef = useRef(null)
  const videoId = videoForLesson(lesson.id)
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}&list=${PLAYLIST_ID}`

  const dispatch = () => window.dispatchEvent(new CustomEvent('lesson-updated'))

  const handleBlock = useCallback(async (block, value) => {
    await updateLesson(lesson.id, { [block]: value })
    dispatch()
  }, [lesson.id])

  const handleStudiedDate = useCallback(async (value) => {
    await updateLesson(lesson.id, { studied_date: value || null })
    dispatch()
  }, [lesson.id])

  const handleMin = useCallback((value) => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      updateLesson(lesson.id, { actual_min: Number(value) || 0 }).then(dispatch)
    }, 600)
  }, [lesson.id])

  const handleNotes = useCallback((value) => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      updateLesson(lesson.id, { notes: value }).then(dispatch)
    }, 800)
  }, [lesson.id])

  return (
    <div className={`lesson-row ${cls}`}>
      <div className="row-meta">
        <span className="row-plan-date" title="По плану">{lesson.date.slice(5).replace('-', '/')}</span>
        <span className="row-day">{lesson.day}</span>
        <span className="row-block">{lesson.block}</span>
        <span className="row-pct">{pct}%</span>
        <span className={`row-xp ${xp < 0 ? 'xp-neg' : xp > 0 ? 'xp-pos' : ''}`}>
          {xp >= 0 ? '+' : ''}{xp} XP
        </span>
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="row-video-link"
          title="Видео урока на YouTube"
        >
          ▶ Видео
        </a>
      </div>

      <div className="row-task">{lesson.task}</div>

      <div className="row-controls">
        <div className="block-statuses">
          {BLOCKS.map(b => (
            <label key={b} className="block-select">
              <span>{BLOCK_LABELS[b]}</span>
              <select
                value={lesson[b] || 'None'}
                onChange={e => handleBlock(b, e.target.value)}
                className={`status-${(lesson[b] || 'None').toLowerCase()}`}
              >
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
          ))}
        </div>

        <label className="studied-date-label">
          <span>Дата занятия</span>
          <input
            type="date"
            defaultValue={lesson.studied_date || ''}
            onChange={e => handleStudiedDate(e.target.value)}
            className="studied-date-input"
          />
        </label>

        <label className="min-label">
          <span>Мин</span>
          <input
            type="number"
            min="0"
            max="180"
            defaultValue={lesson.actual_min || 0}
            onChange={e => handleMin(e.target.value)}
            className="min-input"
          />
        </label>

        <input
          type="text"
          defaultValue={lesson.notes || ''}
          onChange={e => handleNotes(e.target.value)}
          placeholder="Заметки…"
          className="notes-input"
        />
      </div>
    </div>
  )
}
