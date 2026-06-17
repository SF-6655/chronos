import { useTheme } from '../lib/ThemeContext'
import { getSmartInsight } from '../lib/insights'

export default function SmartInsight({ entries }) {
  const { theme } = useTheme()
  const insight = getSmartInsight(entries)

  return (
    <div style={{
      ...s.wrapper,
      background: theme.accentSoft,
      border: `1px solid ${theme.borderLight}`,
    }}>
      <span style={s.icon}>💡</span>
      <span style={{ ...s.text, color: theme.textSecondary }}>{insight}</span>
    </div>
  )
}

const s = {
  wrapper: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '12px 16px', borderRadius: 12, marginBottom: 12,
  },
  icon: { fontSize: 16, flexShrink: 0 },
  text: { fontSize: 13, lineHeight: 1.5 },
}