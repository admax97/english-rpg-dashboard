import React from 'react'
import { Flame, Clock, CheckCircle2, AlertTriangle } from 'lucide-react'

export default function StatsGrid({ stats }) {
  const { streak, totalActualMin, completedLessons, overdueCount } = stats
  const hours = Math.floor(totalActualMin / 60)
  const mins = totalActualMin % 60

  return (
    <div className="stats-grid">
      <StatCard
        icon={<Flame />}
        label="Streak"
        value={streak}
        unit="days"
        color="orange"
      />
      <StatCard
        icon={<Clock />}
        label="Time studied"
        value={hours > 0 ? `${hours}h ${mins}m` : `${mins}m`}
        color="blue"
      />
      <StatCard
        icon={<CheckCircle2 />}
        label="Completed"
        value={`${completedLessons}/56`}
        unit="lessons"
        color="green"
      />
      <StatCard
        icon={<AlertTriangle />}
        label="Overdue"
        value={overdueCount}
        unit="lessons"
        color={overdueCount > 0 ? 'red' : 'green'}
      />
    </div>
  )
}

function StatCard({ icon, label, value, unit, color }) {
  return (
    <div className={`stat-card stat-${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-body">
        <span className="stat-label">{label}</span>
        <strong className="stat-value">{value}</strong>
        {unit && <span className="stat-unit">{unit}</span>}
      </div>
    </div>
  )
}
