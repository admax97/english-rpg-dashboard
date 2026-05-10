import React, { useState, useEffect } from 'react'
import { login } from '../api'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [slowWarning, setSlowWarning] = useState(false)

  useEffect(() => {
    if (!loading) { setSlowWarning(false); return }
    const t = setTimeout(() => setSlowWarning(true), 8000)
    return () => clearTimeout(t)
  }, [loading])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(username, password)
      onLogin(user)
    } catch {
      setError('Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-logo">
          <span className="login-icon">⚔</span>
          <h1>English RPG</h1>
          <p>Sign in to continue your quest</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="field">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="admin"
              autoFocus
              required
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          {slowWarning && (
            <div className="login-warn">
              Сервер просыпается после паузы — обычно занимает до 60 сек…
            </div>
          )}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Подключение…' : 'Enter the Game'}
          </button>
        </form>
      </div>
    </div>
  )
}
