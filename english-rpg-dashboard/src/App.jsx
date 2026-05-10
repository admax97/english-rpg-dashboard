import React, { useEffect, useMemo, useState } from 'react'
import { Trophy, Flame, Brain, Mic, Rocket, CheckCircle2 } from 'lucide-react'
import './index.css'

const TOTAL_DAYS = 60

const achievementList = [
  {
    id: 'first',
    title: 'First Step',
    description: 'Завершить первый урок',
    icon: Trophy,
    condition: (stats) => stats.completedLessons >= 1,
  },
  {
    id: 'week',
    title: '7-Day Streak',
    description: '7 дней подряд без пропусков',
    icon: Flame,
    condition: (stats) => stats.currentStreak >= 7,
  },
  {
    id: 'vocab',
    title: '500 Words',
    description: 'Выучить 500 слов',
    icon: Brain,
    condition: (stats) => stats.totalWords >= 500,
  },
  {
    id: 'speaker',
    title: 'Speaker Mode',
    description: '25 часов speaking practice',
    icon: Mic,
    condition: (stats) => stats.totalSpeaking >= 25,
  },
  {
    id: 'b1',
    title: 'B1 Ready',
    description: 'Завершить 60 уроков',
    icon: Rocket,
    condition: (stats) => stats.completedLessons >= 60,
  },
]

const generateLessons = () => {
  return Array.from({ length: TOTAL_DAYS }, (_, i) => ({
    id: i + 1,
    day: i + 1,
    title: `Урок ${i + 1}`,
    completed: false,
    words: 20,
    speaking: 1,
    notes: '',
  }))
}

export default function App() {
  const [lessons, setLessons] = useState(generateLessons())

  useEffect(() => {
    const saved = localStorage.getItem('english-dashboard-progress')
    if (saved) {
      setLessons(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('english-dashboard-progress', JSON.stringify(lessons))
  }, [lessons])

  const stats = useMemo(() => {
    const completedLessons = lessons.filter((l) => l.completed).length

    const totalWords = lessons
      .filter((l) => l.completed)
      .reduce((acc, l) => acc + Number(l.words || 0), 0)

    const totalSpeaking = lessons
      .filter((l) => l.completed)
      .reduce((acc, l) => acc + Number(l.speaking || 0), 0)

    let currentStreak = 0

    for (const lesson of lessons) {
      if (lesson.completed) {
        currentStreak++
      } else {
        break
      }
    }

    const xp = completedLessons * 100 + totalWords * 2 + totalSpeaking * 25
    const level = Math.floor(xp / 500) + 1

    return {
      completedLessons,
      totalWords,
      totalSpeaking,
      currentStreak,
      xp,
      level,
      progressPercent: Math.round((completedLessons / TOTAL_DAYS) * 100),
    }
  }, [lessons])

  const achievements = achievementList.map((a) => ({
    ...a,
    unlocked: a.condition(stats),
  }))

  const toggleLesson = (id) => {
    setLessons((prev) =>
      prev.map((lesson) =>
        lesson.id === id
          ? { ...lesson, completed: !lesson.completed }
          : lesson
      )
    )
  }

  const updateNote = (id, value) => {
    setLessons((prev) =>
      prev.map((lesson) =>
        lesson.id === id
          ? { ...lesson, notes: value }
          : lesson
      )
    )
  }

  return (
    <div className="app">
      <div className="container">
        <div className="header">
          <div>
            <h1>English RPG System</h1>
            <p>
              Interactive English learning dashboard with XP, streaks,
              achievements and daily speaking practice.
            </p>
          </div>

          <div className="level-card">
            <span>Current Level</span>
            <strong>LVL {stats.level}</strong>
            <small>{stats.xp} XP earned</small>
          </div>
        </div>

        <div className="progress-card">
          <div className="progress-top">
            <div>
              <span>Global Progress</span>
              <strong>{stats.completedLessons} / {TOTAL_DAYS} lessons</strong>
            </div>

            <div className="percent">{stats.progressPercent}%</div>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${stats.progressPercent}%` }}
            />
          </div>
        </div>

        <div className="stats-grid">
          <StatCard
            title="Current Streak"
            value={stats.currentStreak}
            subtitle="days in a row"
            icon={<Flame />}
          />

          <StatCard
            title="Vocabulary"
            value={stats.totalWords}
            subtitle="words learned"
            icon={<Brain />}
          />

          <StatCard
            title="Speaking"
            value={`${stats.totalSpeaking}h`}
            subtitle="conversation practice"
            icon={<Mic />}
          />

          <StatCard
            title="Completed"
            value={stats.completedLessons}
            subtitle="lessons done"
            icon={<CheckCircle2 />}
          />
        </div>

        <div className="card">
          <div className="section-header">
            <h2>Achievements</h2>
            <span>
              {achievements.filter((a) => a.unlocked).length} / {achievements.length} unlocked
            </span>
          </div>

          <div className="achievement-grid">
            {achievements.map((achievement) => {
              const Icon = achievement.icon

              return (
                <div
                  key={achievement.id}
                  className={`achievement ${achievement.unlocked ? 'unlocked' : ''}`}
                >
                  <div className="achievement-top">
                    <Icon />
                    {achievement.unlocked && <span className="badge">UNLOCKED</span>}
                  </div>

                  <h3>{achievement.title}</h3>
                  <p>{achievement.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="card">
          <div className="section-header">
            <h2>Daily Lesson Tracker</h2>

            <button
              className="reset-btn"
              onClick={() => {
                localStorage.removeItem('english-dashboard-progress')
                setLessons(generateLessons())
              }}
            >
              Reset Progress
            </button>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Done</th>
                  <th>Day</th>
                  <th>Lesson</th>
                  <th>Vocabulary</th>
                  <th>Speaking</th>
                  <th>Notes</th>
                </tr>
              </thead>

              <tbody>
                {lessons.map((lesson) => (
                  <tr key={lesson.id} className={lesson.completed ? 'completed-row' : ''}>
                    <td>
                      <input
                        type="checkbox"
                        checked={lesson.completed}
                        onChange={() => toggleLesson(lesson.id)}
                      />
                    </td>

                    <td className="green">Day {lesson.day}</td>
                    <td>{lesson.title}</td>
                    <td>{lesson.words} words</td>
                    <td>{lesson.speaking}h</td>

                    <td>
                      <input
                        value={lesson.notes}
                        onChange={(e) => updateNote(lesson.id, e.target.value)}
                        placeholder="Что изучил сегодня..."
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, subtitle, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span>{title}</span>
        <div className="icon">{icon}</div>
      </div>

      <strong>{value}</strong>
      <small>{subtitle}</small>
    </div>
  )
}
