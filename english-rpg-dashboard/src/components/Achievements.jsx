import React from 'react'

const BLOCKS = ['vocabulary', 'listening', 'speaking']

function weekDone(lessons, week) {
  const wl = lessons.filter(l => l.week === week)
  return wl.length === 7 && wl.every(l => {
    const score = BLOCKS.reduce((acc, b) => l[b] === 'Done' ? acc + 1 : l[b] === 'Partial' ? acc + 0.5 : acc, 0)
    return score / 3 >= 0.8
  })
}

const ACHIEVEMENTS = [
  {
    id: 'first_ribbit',
    emoji: '🐸',
    title: 'First Ribbit',
    desc: 'Marked your first lesson — what a brave little frog!',
    check: (s) => s.completedLessons >= 1,
  },
  {
    id: 'returning_frog',
    emoji: '🐸',
    title: 'Returning Frog',
    desc: 'Visited 5 times — the pond really missed you!',
    check: (s, ls, lc) => lc >= 5,
  },
  {
    id: 'swamp_regular',
    emoji: '🐸',
    title: 'Swamp Regular',
    desc: '3-day study streak — showing up like a proper frog',
    check: (s) => s.streak >= 3,
  },
  {
    id: 'pond_veteran',
    emoji: '🐸',
    title: 'Pond Veteran',
    desc: '7-day streak — this frog never misses a lily pad',
    check: (s) => s.streak >= 7,
  },
  {
    id: 'pond_timer',
    emoji: '🐸',
    title: 'Time in the Pond',
    desc: '60+ minutes studied — frogs love staying in the water',
    check: (s) => s.totalActualMin >= 60,
  },
  {
    id: 'deep_bog',
    emoji: '🐸',
    title: 'Deep Bog Swimmer',
    desc: '300+ minutes total — this frog goes very deep',
    check: (s) => s.totalActualMin >= 300,
  },
  {
    id: 'task_frog',
    emoji: '🐸',
    title: 'Task-Tracking Frog',
    desc: '10 lessons logged — so diligent, such responsible frog',
    check: (s) => s.completedLessons >= 10,
  },
  {
    id: 'no_flies',
    emoji: '🐸',
    title: 'No Flies Left Behind',
    desc: 'Zero overdue lessons — a very punctual frog!',
    check: (s) => s.overdueCount === 0 && s.totalXP > 0,
  },
  {
    id: 'week_crusher',
    emoji: '🐸',
    title: 'Week Crusher',
    desc: 'Crushed week 1 — emerging from the tadpole stage!',
    check: (s, ls) => weekDone(ls, 1),
  },
  {
    id: 'the_frog',
    emoji: '🐸',
    title: '★ THE FROG ★',
    desc: 'All 56 lessons done — you have truly become THE FROG',
    check: (s) => s.completedLessons >= 56,
  },
]

export default function Achievements({ stats, lessons, loginCount = 1 }) {
  const items = ACHIEVEMENTS.map(a => ({
    ...a,
    unlocked: a.check(stats, lessons, loginCount),
  }))
  const count = items.filter(a => a.unlocked).length

  return (
    <div className="card">
      <div className="card-header">
        <h2>🐸 Frog Achievements</h2>
        <span className="badge-count">{count} / {items.length}</span>
      </div>
      <div className="achievement-grid">
        {items.map(a => (
          <div key={a.id} className={`achievement ${a.unlocked ? 'unlocked' : ''}`}>
            <div className="ach-frog-icon">{a.emoji}</div>
            {a.unlocked && <span className="ach-badge">UNLOCKED</span>}
            <h3>{a.title}</h3>
            <p>{a.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
