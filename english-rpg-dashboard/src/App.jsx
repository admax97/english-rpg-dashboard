import React, { useEffect, useState, useCallback } from 'react'
import Login from './components/Login'
import Header from './components/Header'
import StatsGrid from './components/StatsGrid'
import Achievements from './components/Achievements'
import LessonTracker from './components/LessonTracker'
import WeeklyReview from './components/WeeklyReview'
import { fetchLessons, fetchReviews } from './api'
import './index.css'

const EMPTY_STATS = { totalXP: 0, level: 1, xpInLevel: 0, streak: 0, completedLessons: 0, overdueCount: 0, totalActualMin: 0 }

function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t)
}

export default function App() {
  const [username, setUsername] = useState(() => localStorage.getItem('username') || '')
  const [lessons, setLessons] = useState([])
  const [stats, setStats] = useState(EMPTY_STATS)
  const [reviews, setReviews] = useState([])
  const [tab, setTab] = useState('lessons')
  const [loading, setLoading] = useState(false)
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme') || 'dark'
    applyTheme(saved)
    return saved
  })

  const isLoggedIn = Boolean(localStorage.getItem('token') && username)

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', next)
      applyTheme(next)
      return next
    })
  }, [])

  const loadData = useCallback(async () => {
    try {
      const [ld, rd] = await Promise.all([fetchLessons(), fetchReviews()])
      setLessons(ld.lessons)
      setStats(ld.stats)
      setReviews(rd.reviews)
    } catch {
      // token invalid — api.js will reload
    }
  }, [])

  useEffect(() => {
    if (!isLoggedIn) return
    setLoading(true)
    loadData().finally(() => setLoading(false))
  }, [isLoggedIn, loadData])

  useEffect(() => {
    const handler = () => loadData()
    window.addEventListener('lesson-updated', handler)
    return () => window.removeEventListener('lesson-updated', handler)
  }, [loadData])

  if (!isLoggedIn) return <Login onLogin={user => setUsername(user)} />

  if (loading) {
    return (
      <div className="loading-screen">
        <span className="loading-icon">⚔</span>
        <p>Loading your quest…</p>
      </div>
    )
  }

  return (
    <div className="app">
      <Header
        username={username}
        stats={stats}
        onLogout={() => { setUsername(''); setLessons([]); setStats(EMPTY_STATS); setReviews([]) }}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="main">
        <StatsGrid stats={stats} />

        <nav className="tabs">
          {['lessons', 'achievements', 'review'].map(t => (
            <button
              key={t}
              className={`tab-btn ${tab === t ? 'active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t === 'lessons' && 'Daily Tracker'}
              {t === 'achievements' && 'Achievements'}
              {t === 'review' && 'Weekly Review'}
            </button>
          ))}
        </nav>

        {tab === 'lessons' && <LessonTracker lessons={lessons} />}
        {tab === 'achievements' && <Achievements stats={stats} lessons={lessons} />}
        {tab === 'review' && <WeeklyReview lessons={lessons} reviews={reviews} onUpdate={loadData} />}
      </main>
    </div>
  )
}
