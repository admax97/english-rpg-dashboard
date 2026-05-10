import React from 'react'
import { Trophy, Flame, Zap, Star, Rocket, Shield, BookOpen, Award } from 'lucide-react'

const ACHIEVEMENTS = [
  { id: 'first',   icon: Trophy,   title: 'First Step',      desc: 'Complete your first lesson',   check: s => s.completedLessons >= 1 },
  { id: 'streak7', icon: Flame,    title: '7-Day Streak',    desc: '7 consecutive active days',    check: s => s.streak >= 7 },
  { id: 'week1',   icon: BookOpen, title: 'Week 1 Done',     desc: 'Complete all of week 1',       check: (s, ls) => weekDone(ls, 1) },
  { id: 'week4',   icon: Shield,   title: 'Halfway There',   desc: 'Complete all of week 4',       check: (s, ls) => weekDone(ls, 4) },
  { id: 'xp300',   icon: Zap,      title: 'XP Hunter',       desc: 'Earn 300 XP',                  check: s => s.totalXP >= 300 },
  { id: 'xp1000',  icon: Star,     title: 'Power Learner',   desc: 'Earn 1000 XP',                 check: s => s.totalXP >= 1000 },
  { id: 'noDebt',  icon: Award,    title: 'No Debt',         desc: 'Zero overdue lessons',         check: s => s.overdueCount === 0 },
  { id: 'finish',  icon: Rocket,   title: 'English Master',  desc: 'Complete all 8 weeks',         check: s => s.completedLessons >= 56 },
]

const BLOCKS = ['vocabulary', 'listening', 'speaking', 'writing', 'review', 'voice']

function weekDone(lessons, week) {
  const weekLessons = lessons.filter(l => l.week === week)
  return weekLessons.length === 7 && weekLessons.every(l => {
    const score = BLOCKS.reduce((acc, b) => l[b] === 'Done' ? acc + 1 : l[b] === 'Partial' ? acc + 0.5 : acc, 0)
    return score / 6 >= 0.8
  })
}

export default function Achievements({ stats, lessons }) {
  const items = ACHIEVEMENTS.map(a => ({ ...a, unlocked: a.check(stats, lessons) }))
  const count = items.filter(a => a.unlocked).length

  return (
    <div className="card">
      <div className="card-header">
        <h2>Achievements</h2>
        <span className="badge-count">{count} / {items.length}</span>
      </div>
      <div className="achievement-grid">
        {items.map(a => {
          const Icon = a.icon
          return (
            <div key={a.id} className={`achievement ${a.unlocked ? 'unlocked' : ''}`}>
              <div className="ach-icon"><Icon size={24} /></div>
              {a.unlocked && <span className="ach-badge">UNLOCKED</span>}
              <h3>{a.title}</h3>
              <p>{a.desc}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
