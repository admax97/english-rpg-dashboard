import React, { useState, useRef } from 'react'
import { updateReview } from '../api'

const BLOCKS = ['vocabulary', 'listening', 'speaking', 'writing', 'review', 'voice']
const TODAY = new Date().toISOString().slice(0, 10)

function weekStats(lessons) {
  const past = lessons.filter(l => l.date <= TODAY)
  if (!past.length) return { avgCompletion: 0, avgMin: 0, count: 0 }
  const totalPct = past.reduce((acc, l) => {
    const score = BLOCKS.reduce((a, b) => {
      if (l[b] === 'Done') return a + 1
      if (l[b] === 'Partial') return a + 0.5
      return a
    }, 0)
    return acc + Math.round((score / 6) * 100)
  }, 0)
  const totalMin = past.reduce((acc, l) => acc + (l.actual_min || 0), 0)
  return {
    avgCompletion: Math.round(totalPct / past.length),
    avgMin: Math.round(totalMin / past.length),
    count: past.length,
  }
}

export default function WeeklyReview({ lessons, reviews, onUpdate }) {
  const [open, setOpen] = useState(null)

  return (
    <div className="card">
      <div className="card-header">
        <h2>Weekly Review</h2>
      </div>
      {reviews.map(r => {
        const weekLessons = lessons.filter(l => l.week === r.week)
        const stats = weekStats(weekLessons)
        const isOpen = open === r.week
        return (
          <WeekReviewRow
            key={r.week}
            review={r}
            stats={stats}
            isOpen={isOpen}
            onToggle={() => setOpen(isOpen ? null : r.week)}
            onUpdate={onUpdate}
          />
        )
      })}
    </div>
  )
}

function WeekReviewRow({ review, stats, isOpen, onToggle, onUpdate }) {
  const timerRef = useRef(null)

  function debounce(field, value) {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      updateReview(review.week, { [field]: value })
        .then(() => onUpdate())
    }, 800)
  }

  return (
    <div className="review-row">
      <button className="review-header" onClick={onToggle}>
        <div className="review-title">
          <span className="review-week">Week {review.week}</span>
          <span className="review-focus">{review.focus}</span>
        </div>
        <div className="review-summary">
          {stats.count > 0 && (
            <>
              <span className={`review-pct ${stats.avgCompletion >= 80 ? 'good' : stats.avgCompletion >= 50 ? 'mid' : 'low'}`}>
                {stats.avgCompletion}% avg
              </span>
              <span className="review-min">{stats.avgMin} min avg</span>
            </>
          )}
          <span className="review-chevron">{isOpen ? '▲' : '▼'}</span>
        </div>
      </button>

      {isOpen && (
        <div className="review-body">
          <p className="review-grammar"><strong>Grammar:</strong> {review.grammar}</p>
          <div className="review-fields">
            <label>
              <span>What improved?</span>
              <textarea
                defaultValue={review.what_improved || ''}
                onChange={e => debounce('what_improved', e.target.value)}
                placeholder="Что улучшилось за эту неделю…"
                rows={3}
              />
            </label>
            <label>
              <span>What was hard?</span>
              <textarea
                defaultValue={review.what_was_hard || ''}
                onChange={e => debounce('what_was_hard', e.target.value)}
                placeholder="Что мешало…"
                rows={3}
              />
            </label>
            <label>
              <span>Adjustment for next week</span>
              <textarea
                defaultValue={review.adjustment || ''}
                onChange={e => debounce('adjustment', e.target.value)}
                placeholder="Как скорректировать следующую неделю…"
                rows={3}
              />
            </label>
          </div>
        </div>
      )}
    </div>
  )
}
