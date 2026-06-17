import { useTheme } from '../lib/ThemeContext'

const CATEGORY_COLORS = {
  Study: '#7c6ef5',
  Work: '#60a5fa',
  Health: '#4ade80',
  Lifestyle: '#f59e0b',
  'Side Project': '#f472b6',
  Social: '#34d399',
}

function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

function formatClockTime(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: true,
  })
}

export default function RecentSessions({ entries, onViewAll }) {
  const { theme } = useTheme()

  if (entries.length === 0) {
    return (
      <div style={{
        ...s.empty,
        background: theme.bgSecondary,
        border: `1px solid ${theme.border}`,
        backdropFilter: theme.glassBlur,
        WebkitBackdropFilter: theme.glassBlur,
      }}>
        <div style={s.emptyIcon}>⏱</div>
        <p style={{ ...s.emptyText, color: theme.textMuted }}>No sessions yet. Start your first timer.</p>
      </div>
    )
  }

  const recent = entries.slice(0, 4)

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
        <h2 style={{ ...s.title, color: theme.textSecondary }}>Recent sessions</h2>
        <button onClick={onViewAll} style={{ ...s.viewAllBtn, color: theme.accent }}>
          View all →
        </button>
      </div>
      <div style={s.list}>
        {recent.map((entry) => {
          const color = CATEGORY_COLORS[entry.category] || '#7c6ef5'
          return (
            <div key={entry.id} style={{ ...s.entry, background: theme.bgTertiary }}>
              <div style={{ ...s.colorBar, background: color }} />
              <div style={s.entryContent}>
                <div style={s.entryTop}>
                  <div style={s.entryLeft}>
                    <span style={{ ...s.category, color }}>{entry.category}</span>
                    <span style={{ ...s.dot, color: theme.borderLight }}>·</span>
                    <span style={{ ...s.subcategory, color: theme.textMuted }}>{entry.subcategory}</span>
                  </div>
                  <span style={{ ...s.duration, color: theme.text }}>{formatDuration(entry.duration_seconds)}</span>
                </div>
                <div style={s.entryBottom}>
                  <span style={{ ...s.time, color: theme.textMuted }}>
                    {formatClockTime(entry.start_time)} → {formatClockTime(entry.end_time)}
                  </span>
                  {entry.description && (
                    <span style={{ ...s.desc, color: theme.textMuted }}>"{entry.description}"</span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const s = {
  wrapper: { borderRadius: 14, padding: '18px', height: '100%', display: 'flex', flexDirection: 'column' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 14, fontWeight: 600 },
  viewAllBtn: { background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600 },
  list: { display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto', flex: 1 },
  entry: { display: 'flex', alignItems: 'stretch', borderRadius: 10, overflow: 'hidden' },
  colorBar: { width: 3, flexShrink: 0 },
  entryContent: { flex: 1, padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 4 },
  entryTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  entryLeft: { display: 'flex', alignItems: 'center', gap: 6 },
  entryBottom: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  category: { fontSize: 12, fontWeight: 600 },
  dot: { fontSize: 10 },
  subcategory: { fontSize: 12 },
  duration: { fontSize: 13, fontWeight: 600 },
  time: { fontSize: 11 },
  desc: { fontSize: 11, fontStyle: 'italic' },
  empty: { borderRadius: 14, padding: '32px', textAlign: 'center' },
  emptyIcon: { fontSize: 28, marginBottom: 8 },
  emptyText: { fontSize: 13 },
}