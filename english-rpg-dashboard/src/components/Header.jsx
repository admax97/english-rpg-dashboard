import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { logout } from '../api'

const FROG_STAGES = [
  { min: 0,    emoji: '🥚', label: 'Egg'       },
  { min: 100,  emoji: '🐛', label: 'Tadpole'   },
  { min: 300,  emoji: '🐸', label: 'Froglet'   },
  { min: 600,  emoji: '🐸', label: 'Frog'      },
  { min: 1000, emoji: '🐸', label: 'Elder Frog' },
  { min: 1500, emoji: '🐸', label: 'THE FROG'  },
]

export default function Header({ username, stats, onLogout, theme, onToggleTheme }) {
  const { totalXP } = stats

  const stageIdx = FROG_STAGES.reduce((best, s, i) => totalXP >= s.min ? i : best, 0)
  const stage = FROG_STAGES[stageIdx]
  const nextStage = FROG_STAGES[stageIdx + 1]
  const xpInStage = totalXP - stage.min
  const stageSpan = nextStage ? nextStage.min - stage.min : 500
  const stagePct = nextStage ? Math.min(100, Math.round((xpInStage / stageSpan) * 100)) : 100

  const frogIcons = stage.emoji.repeat(Math.min(stageIdx + 1, 5))

  return (
    <header className="header">
      <div className="header-left">
        <span className="header-icon">🐸</span>
        <div>
          <h1 className="header-title">English RPG</h1>
          <span className="header-user">
            @{username} <span className="header-frogs">{frogIcons}</span>
          </span>
        </div>
      </div>

      <div className="header-center">
        <div className="xp-bar-wrap">
          <div className="xp-bar-labels">
            <span className="stage-label">{stage.emoji} {stage.label}</span>
            <span>{xpInStage} / {stageSpan} XP</span>
          </div>
          <div className="xp-bar">
            <div className="xp-fill" style={{ width: `${stagePct}%` }} />
          </div>
          <div className="xp-total">
            {totalXP} XP total
            {nextStage && <span className="xp-next"> → {nextStage.emoji} {nextStage.label} at {nextStage.min} XP</span>}
          </div>
        </div>
      </div>

      <div className="header-right">
        <button className="theme-btn" onClick={onToggleTheme} title="Toggle theme">
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button
          className="logout-btn"
          onClick={() => { logout(); onLogout(); }}
        >
          Logout
        </button>
      </div>
    </header>
  )
}
