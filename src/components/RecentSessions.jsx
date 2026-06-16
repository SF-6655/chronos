import { supabase } from '../lib/supabase'
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

function formatDate(dateStr) {
  const d = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  if (d.toDateString() === today.toDateString()) return 'Today'
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export default function RecentSessions({ entries, onDeleted }) {
  const { theme } = useTheme()

  async function handleDelete(id) {
    await supabase.from('time_entries').delete().eq('id', id)
    onDeleted()
  }

  if (entries.length === 0) {
    return (
      <div style={{
        ...s.empty,
        background: theme.bgSecondary,
        border: `1px solid ${theme.border}`,
      }}>
        <div style={s.emptyIcon}>⏱</div>
        <p style={{ ...s.emptyText, color: theme.textMuted }}>
          No sessions yet. Start your first timer.
        </p>
      </div>
    )
  }

  return (
    <div style={{
      ...s.wrapper,
      background: theme.bgSecondary,
      border: `1px solid ${theme.border}`,
      boxShadow: theme.cardShadow,
    }}>
      <div style={s.header}>
        <h2 style={{ ...s.title, color: theme.textSecondary }}>Recent sessions</h2>
        <span style={{ ...s.count, color: theme.textMuted }}>{entries.length} total</span>
      </div>
      <div style={s.list}>
        {entries.slice(0, 20).map((entry) => {
          const color = CATEGORY_COLORS[entry.category] || '#7c6ef5'
          return (
            <div
              key={entry.id}
              style={{
                ...s.entry,
                background: theme.bgTertiary,
                border: `1px solid ${theme.border}`,
              }}
            >
              <div style={{ ...s.colorBar, background: color }} />
              <div style={s.entryContent}>
                <div style={s.entryTop}>
                  <div style={s.entryLeft}>
                    <span style={{ ...s.category, color }}>{entry.category}</span>
                    <span style={{ ...s.dot, color: theme.borderLight }}>·</span>
                    <span style={{ ...s.subcategory, color: theme.textMuted }}>{entry.subcategory}</span>
                    {entry.description && (
                      <>
                        <span style={{ ...s.dot, color: theme.borderLight }}>·</span>
                        <span style={{ ...s.desc, color: theme.textMuted }}>"{entry.description}"</span>
                      </>
                    )}
                  </div>
                  <div style={s.entryRight}>
                    <span style={{ ...s.duration, color: theme.text }}>{formatDuration(entry.duration_seconds)}</span>
                    <span style={{ ...s.date, color: theme.textMuted }}>{formatDate(entry.created_at)}</span>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      style={{ ...s.deleteBtn, color: theme.textMuted }}
                    >✕</button>
                  </div>
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
  count: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 },
  list: { display: 'flex', flexDirection: 'column', gap: 6, overflowY: 'auto', flex: 1 },
  entry: { display: 'flex', alignItems: 'stretch', borderRadius: 10, overflow: 'hidden' },
  colorBar: { width: 3, flexShrink: 0 },
  entryContent: { flex: 1, padding: '10px 14px' },
  entryTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  entryLeft: { display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  entryRight: { display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 },
  category: { fontSize: 12, fontWeight: 600 },
  dot: { fontSize: 10 },
  subcategory: { fontSize: 12 },
  desc: { fontSize: 11, fontStyle: 'italic' },
  duration: { fontSize: 13, fontWeight: 600 },
  date: { fontSize: 11 },
  deleteBtn: { background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 11, padding: '2px 4px' },
  empty: { borderRadius: 14, padding: '32px', textAlign: 'center' },
  emptyIcon: { fontSize: 28, marginBottom: 8 },
  emptyText: { fontSize: 13 },
}