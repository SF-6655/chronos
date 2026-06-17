import { useTheme } from '../lib/ThemeContext'

export default function StatsCards({ entries }) {
  const { theme } = useTheme()

  const totalSeconds = entries.reduce((sum, e) => sum + (e.duration_seconds || 0), 0)
  const totalHours = (totalSeconds / 3600).toFixed(1)

  const today = new Date().toDateString()
  const todaySeconds = entries
    .filter(e => new Date(e.created_at).toDateString() === today)
    .reduce((sum, e) => sum + (e.duration_seconds || 0), 0)
  const todayHours = (todaySeconds / 3600).toFixed(1)

  const longest = entries.reduce((max, e) =>
    (e.duration_seconds || 0) > (max.duration_seconds || 0) ? e : max, {})
  const longestHours = ((longest.duration_seconds || 0) / 3600).toFixed(1)

  const categoryCounts = entries.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.duration_seconds
    return acc
  }, {})
  const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]

  const stats = [
    { label: 'Total tracked', value: `${totalHours}h`, icon: '⏱', color: theme.accent },
    { label: 'Today', value: `${todayHours}h`, icon: '📅', color: theme.success },
    { label: 'Longest session', value: `${longestHours}h`, icon: '🔥', color: theme.warning },
    { label: 'Top category', value: topCategory ? topCategory[0] : '—', icon: '🏆', color: '#60a5fa' },
  ]

  return (
    <div style={s.grid}>
      {stats.map((stat) => (
        <div key={stat.label} style={{
          ...s.card,
          background: theme.bgSecondary,
          border: `1px solid ${theme.border}`,
          boxShadow: theme.cardShadow,
        }}>
          <div style={{ ...s.accent, background: stat.color }} />
          <div style={s.content}>
            <div style={s.icon}>{stat.icon}</div>
            <div style={{ ...s.value, color: stat.color }}>{stat.value}</div>
            <div style={{ ...s.label, color: theme.textMuted }}>{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

const s = {
  grid: {
    display: 'grid', gridTemplateColumns: '1fr',
    gap: 10, marginBottom: 12, flex: 1,
  },
  card: {
    borderRadius: 14, overflow: 'hidden',
    display: 'flex', flexDirection: 'row', alignItems: 'stretch',
    transition: 'transform 0.15s ease',
  },
  accent: { width: 4, flexShrink: 0 },
  content: { padding: '16px 18px', flex: 1 },
  icon: { fontSize: 18, marginBottom: 6 },
  value: { fontSize: 22, fontWeight: 700, marginBottom: 2 },
  label: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 },
}