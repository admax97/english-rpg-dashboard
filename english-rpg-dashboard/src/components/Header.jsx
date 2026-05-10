import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { logout } from '../api'

export default function Header({ username, stats, onLogout, theme, onToggleTheme }) {
  const { level, xpInLevel, totalXP } = stats
  const xpPercent = Math.round((xpInLevel / 300) * 100)

  return (
    <header className="header">
      <div className="header-left">
        <span className="header-icon">⚔</span>
        <div>
          <h1 className="header-title">English RPG</h1>
          <span className="header-user">@{username}</span>
        </div>
      </div>

      <div className="header-center">
        <div className="xp-bar-wrap">
          <div className="xp-bar-labels">
            <span>LVL {level}</span>
            <span>{xpInLevel} / 300 XP</span>
          </div>
          <div className="xp-bar">
            <div className="xp-fill" style={{ width: `${xpPercent}%` }} />
          </div>
          <div className="xp-total">{totalXP} XP total</div>
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
