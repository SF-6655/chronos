import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useTheme } from '../lib/ThemeContext'

const CATEGORY_COLORS = {
  Study: '#7c6ef5',
  Work: '#60a5fa',
  Health: '#4ade80',
  Lifestyle: '#f59e0b',
  'Side Project': '#f472b6',
  Social: '#34d399',
}

export default function WeeklyChart({ entries }) {
  const { theme } = useTheme()
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const categories = Object.keys(CATEGORY_COLORS)

  const data = days.map((day, i) => {
    const dayEntries = entries.filter(e => {
      const d = new Date(e.created_at)
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      weekStart.setHours(0, 0, 0, 0)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 7)
      return d >= weekStart && d < weekEnd && d.getDay() === i
    })

    const row = { day }
    categories.forEach(cat => {
      const secs = dayEntries
        .filter(e => e.category === cat)
        .reduce((sum, e) => sum + (e.duration_seconds || 0), 0)
      row[cat] = parseFloat((secs / 3600).toFixed(2))
    })
    return row
  })

  return (
    <div style={{
      ...s.wrapper,
      background: theme.bgSecondary,
      border: `1px solid ${theme.border}`,
      boxShadow: theme.cardShadow,
      backdropFilter: theme.glassBlur,
      WebkitBackdropFilter: theme.glassBlur,
    }}>
      <div style={s.header}>
        <h2 style={{ ...s.title, color: theme.textSecondary }}>This week</h2>
        <span style={{ ...s.subtitle, color: theme.textMuted }}>Hours per category</span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.border} vertical={false} />
        <XAxis dataKey="day" tick={{ fill: theme.textMuted, fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: theme.textMuted, fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: theme.bgSecondary,
              border: `1px solid ${theme.border}`,
              borderRadius: 8, fontSize: 12,
              color: theme.text,
            }}
            formatter={(value) => [`${value}h`]}
            cursor={{ fill: theme.bgTertiary }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, color: theme.textMuted, paddingTop: 8 }}
            iconType="circle" iconSize={8}
          />
          {categories.map(cat => (
            <Bar key={cat} dataKey={cat} stackId="a" fill={CATEGORY_COLORS[cat]} radius={[2, 2, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

const s = {
  wrapper: { borderRadius: 14, padding: '24px 24px 12px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  title: { fontSize: 16, fontWeight: 600 },
  subtitle: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
}