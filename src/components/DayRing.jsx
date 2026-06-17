import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { useTheme } from '../lib/ThemeContext'
import { getDayAccountedFor } from '../lib/insights'

export default function DayRing({ entries }) {
  const { theme } = useTheme()
  const { segments, trackedSeconds, totalDaySeconds } = getDayAccountedFor(entries)
  const pct = Math.round((trackedSeconds / totalDaySeconds) * 100)
  const trackedHours = (trackedSeconds / 3600).toFixed(1)

  return (
    <div style={{
      ...s.wrapper,
      background: theme.bgSecondary,
      border: `1px solid ${theme.border}`,
      boxShadow: theme.cardShadow,
      backdropFilter: theme.glassBlur,
      WebkitBackdropFilter: theme.glassBlur,
    }}>
      <div style={{ ...s.title, color: theme.textSecondary }}>Today's coverage</div>
      <div style={s.chartArea}>
        <ResponsiveContainer width="100%" height={140}>
          <PieChart>
            <Pie
              data={segments}
              dataKey="value"
              innerRadius={48}
              outerRadius={64}
              startAngle={90}
              endAngle={-270}
              stroke="none"
            >
              {segments.map((seg, i) => (
                <Cell key={i} fill={seg.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div style={s.centerLabel}>
        <div style={{ fontSize: 26, fontWeight: 800, color: theme.accent }}>{pct}%</div>
        <div style={{ fontSize: 12, color: theme.textMuted }}>{trackedHours}h tracked</div>
        </div>
      </div>
    </div>
  )
}

const s = {
  wrapper: { borderRadius: 14, padding: '20px', position: 'relative' },
  title: { fontSize: 15, fontWeight: 600, marginBottom: 6 },
  chartArea: { position: 'relative', display: 'flex', justifyContent: 'center' },
  centerLabel: {
    position: 'absolute', top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
  },
}