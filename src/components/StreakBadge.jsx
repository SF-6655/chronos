import { useTheme } from '../lib/ThemeContext'
import { calculateStreak } from '../lib/insights'

export default function StreakBadge({ entries }) {
  const { theme } = useTheme()
  const streak = calculateStreak(entries)

  if (streak === 0) {
    return (
      <div style={{
        ...s.wrapper,
        background: theme.bgTertiary,
        border: `1px solid ${theme.border}`,
      }}>
        <span style={s.icon}>🌱</span>
        <span style={{ ...s.text, color: theme.textMuted }}>
          Start a streak today
        </span>
      </div>
    )
  }

  return (
    <div style={{
      ...s.wrapper,
      background: theme.accentSoft,
      border: `1px solid ${theme.accent}`,
    }}>
      <span style={s.icon}>🔥</span>
      <span style={{ ...s.text, color: theme.accent, fontWeight: 700 }}>
        {streak} day{streak !== 1 ? 's' : ''} streak
      </span>
    </div>
  )
}

const s = {
  wrapper: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '6px 14px', borderRadius: 20,
  },
  icon: { fontSize: 14 },
  text: { fontSize: 12 },
}