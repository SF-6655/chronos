import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useTheme } from '../lib/ThemeContext'
import { groupEntriesByDay } from '../lib/insights'

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

function formatClockTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: true,
  })
}

export default function RecentSessions({ entries, onDeleted }) {
  const { theme } = useTheme()
  const [expanded, setExpanded] = useState({})

  async function handleDelete(id) {
    await supabase.from('time_entries').delete().eq('id', id)
    onDeleted()
  }

  function toggleExpand(groupId) {
    setExpanded(prev => ({ ...prev, [groupId]: !prev[groupId] }))
  }

  if (entries.length === 0) {
    return (
      <div style={{ ...s.empty, background: theme.bgSecondary, border: `1px solid ${theme.border}` }}>
        <div style={s.emptyIcon}>⏱</div>
        <p style={{ ...s.emptyText, color: theme.textMuted }}>No sessions yet. Start your first timer.</p>
      </div>
    )
  }

  const groups = groupEntriesByDay(entries)

  return (
    <div style={{ ...s.wrapper, background: theme.bgSecondary, border: `1px solid ${theme.border}`, boxShadow: theme.cardShadow }}>
      <div style={s.header}>
        <h2 style={{ ...s.title, color: theme.textSecondary }}>Sessions</h2>
        <span style={{ ...s.count, color: theme.textMuted }}>{groups.length} grouped</span>
      </div>
      <div style={s.list}>
        {groups.slice(0, 25).map((group) => {
          const color = CATEGORY_COLORS[group.category] || '#7c6ef5'
          const isMultiple = group.sessions.length > 1
          const isExpanded = expanded[group.id]

          return (
            <div key={group.id} style={{ ...s.groupWrapper, border: `1px solid ${theme.border}` }}>
              <div
                onClick={() => isMultiple && toggleExpand(group.id)}
                style={{
                  ...s.entry,
                  background: theme.bgTertiary,
                  cursor: isMultiple ? 'pointer' : 'default',
                }}
              >
                <div style={{ ...s.colorBar, background: color }} />
                <div style={s.entryContent}>
                  <div style={s.entryTop}>
                    <div style={s.entryLeft}>
                      <span style={{ ...s.category, color }}>{group.category}</span>
                      <span style={{ ...s.dot, color: theme.borderLight }}>·</span>
                      <span style={{ ...s.subcategory, color: theme.textMuted }}>{group.subcategory}</span>
                      {isMultiple && (
                        <span style={{ ...s.sessionCount, background: theme.accentSoft, color: theme.accent }}>
                          {group.sessions.length} sessions
                        </span>
                      )}
                    </div>
                    <div style={s.entryRight}>
                      <span style={{ ...s.duration, color: theme.text }}>{formatDuration(group.totalSeconds)}</span>
                      <span style={{ ...s.date, color: theme.textMuted }}>{formatDate(group.date)}</span>
                      {isMultiple && (
                        <span style={{ ...s.chevron, color: theme.textMuted, transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                          ▾
                        </span>
                      )}
                      {!isMultiple && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(group.sessions[0].id) }}
                          style={{ ...s.deleteBtn, color: theme.textMuted }}
                        >✕</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {isMultiple && isExpanded && (
                <div style={{ ...s.subList, background: theme.bg }}>
                  {group.sessions.map((session) => (
                    <div key={session.id} style={s.subEntry}>
                      <div style={s.subEntryLeft}>
                        <span style={{ ...s.subTime, color: theme.textSecondary }}>
                          {formatClockTime(session.start_time)} → {formatClockTime(session.end_time)}
                        </span>
                        {session.description && (
                          <span style={{ ...s.subDesc, color: theme.textMuted }}>"{session.description}"</span>
                        )}
                      </div>
                      <div style={s.subEntryRight}>
                        <span style={{ ...s.subDuration, color: theme.textMuted }}>
                          {formatDuration(session.duration_seconds)}
                        </span>
                        <button
                          onClick={() => handleDelete(session.id)}
                          style={{ ...s.deleteBtn, color: theme.textMuted }}
                        >✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
  groupWrapper: { borderRadius: 10, overflow: 'hidden' },
  entry: { display: 'flex', alignItems: 'stretch' },
  colorBar: { width: 3, flexShrink: 0 },
  entryContent: { flex: 1, padding: '10px 14px' },
  entryTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  entryLeft: { display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  entryRight: { display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 },
  category: { fontSize: 12, fontWeight: 600 },
  dot: { fontSize: 10 },
  subcategory: { fontSize: 12 },
  sessionCount: { fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 600 },
  duration: { fontSize: 13, fontWeight: 600 },
  date: { fontSize: 11 },
  chevron: { fontSize: 12, transition: 'transform 0.2s' },
  deleteBtn: { background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 11, padding: '2px 4px' },
  subList: { padding: '4px 14px 8px 22px', display: 'flex', flexDirection: 'column', gap: 6 },
  subEntry: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' },
  subEntryLeft: { display: 'flex', flexDirection: 'column', gap: 2 },
  subTime: { fontSize: 11, fontWeight: 500 },
  subDesc: { fontSize: 10, fontStyle: 'italic' },
  subEntryRight: { display: 'flex', alignItems: 'center', gap: 8 },
  subDuration: { fontSize: 11 },
  empty: { borderRadius: 14, padding: '32px', textAlign: 'center' },
  emptyIcon: { fontSize: 28, marginBottom: 8 },
  emptyText: { fontSize: 13 },
}