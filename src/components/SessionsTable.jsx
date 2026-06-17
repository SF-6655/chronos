import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useTheme } from '../lib/ThemeContext'
import { useAutoScale } from '../hooks/useAutoScale'

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
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: true,
  })
}

export default function SessionsTable({ entries, isOpen, onClose, onDeleted }) {
  const { theme } = useTheme()
  const { scale } = useAutoScale(1600, 880)
  const [filterCategory, setFilterCategory] = useState('All')
  const [sortBy, setSortBy] = useState('newest')

  async function handleDelete(id) {
    await supabase.from('time_entries').delete().eq('id', id)
    onDeleted()
  }

  const categories = ['All', ...new Set(entries.map(e => e.category))]

  let filtered = filterCategory === 'All'
    ? entries
    : entries.filter(e => e.category === filterCategory)

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.start_time) - new Date(a.start_time)
    if (sortBy === 'oldest') return new Date(a.start_time) - new Date(b.start_time)
    if (sortBy === 'longest') return b.duration_seconds - a.duration_seconds
    return 0
  })

  return (
    <div style={{
      ...s.panel,
      background: theme.bg,
      transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
    }}>
      <div style={s.scaleOuter}>
        <div style={{ ...s.scaleInner, transform: `scale(${scale})` }}>
          <div style={{ ...s.header, borderBottom: `1px solid ${theme.border}` }}>
            <button onClick={onClose} style={{ ...s.backBtn, color: theme.textSecondary, border: `1px solid ${theme.border}` }}>
              ← Back to dashboard
            </button>
            <h1 style={{ ...s.title, color: theme.text }}>All sessions</h1>
            <span style={{ ...s.count, color: theme.textMuted }}>{filtered.length} entries</span>
          </div>

          <div style={s.controls}>
            <div style={s.filterRow}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  style={{
                    ...s.filterBtn,
                    background: filterCategory === cat ? (CATEGORY_COLORS[cat] || theme.accent) : theme.bgTertiary,
                    color: filterCategory === cat ? '#fff' : theme.textMuted,
                    border: `1px solid ${filterCategory === cat ? (CATEGORY_COLORS[cat] || theme.accent) : theme.border}`,
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                ...s.sortSelect,
                background: theme.bgTertiary,
                border: `1px solid ${theme.border}`,
                color: theme.text,
              }}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="longest">Longest first</option>
            </select>
          </div>

          <div style={s.tableWrapper}>
            <div style={{ ...s.tableHeader, borderBottom: `1px solid ${theme.border}`, color: theme.textMuted }}>
              <span style={s.colDate}>Date</span>
              <span style={s.colCategory}>Category</span>
              <span style={s.colTime}>Time</span>
              <span style={s.colDesc}>Description</span>
              <span style={s.colDuration}>Duration</span>
              <span style={s.colAction}></span>
            </div>

            <div style={s.tableBody}>
              {filtered.length === 0 ? (
                <div style={{ ...s.emptyState, color: theme.textMuted }}>No sessions found</div>
              ) : (
                filtered.map((entry) => {
                  const color = CATEGORY_COLORS[entry.category] || theme.accent
                  return (
                    <div
                      key={entry.id}
                      style={{ ...s.row, borderBottom: `1px solid ${theme.border}` }}
                    >
                      <span style={{ ...s.colDate, color: theme.textMuted, fontSize: 12 }}>
                        {formatDate(entry.created_at)}
                      </span>
                      <span style={s.colCategory}>
                        <span style={{ ...s.categoryPill, background: `${color}22`, color }}>
                          {entry.category}
                        </span>
                        <span style={{ fontSize: 11, color: theme.textMuted, marginLeft: 6 }}>
                          {entry.subcategory}
                        </span>
                      </span>
                      <span style={{ ...s.colTime, color: theme.textSecondary, fontSize: 12 }}>
                        {formatClockTime(entry.start_time)} → {formatClockTime(entry.end_time)}
                      </span>
                      <span style={{ ...s.colDesc, color: theme.textMuted, fontSize: 12 }}>
                        {entry.description ? `"${entry.description}"` : '—'}
                      </span>
                      <span style={{ ...s.colDuration, color: theme.text, fontWeight: 600, fontSize: 13 }}>
                        {formatDuration(entry.duration_seconds)}
                      </span>
                      <span style={s.colAction}>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          style={{ ...s.deleteBtn, color: theme.textMuted }}
                        >
                          ✕
                        </button>
                      </span>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const s = {
  panel: {
    position: 'fixed', top: 0, right: 0, bottom: 0, left: 0,
    zIndex: 200, display: 'flex', flexDirection: 'column',
    transition: 'transform 0.3s ease',
    overflow: 'hidden',
  },
  scaleOuter: {
    flex: 1, display: 'flex', justifyContent: 'center',
    alignItems: 'center', overflow: 'hidden',
  },
  scaleInner: {
    width: 1600, height: 880, flexShrink: 0,
    transformOrigin: 'center center',
    display: 'flex', flexDirection: 'column',
  },
  header: {
    display: 'flex', alignItems: 'center', gap: 16,
    padding: '16px 24px', flexShrink: 0,
  },
  backBtn: {
    background: 'transparent', borderRadius: 8,
    padding: '8px 16px', cursor: 'pointer', fontSize: 13,
  },
  title: { fontSize: 18, fontWeight: 700, flex: 1 },
  count: { fontSize: 12 },
  controls: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', padding: '12px 24px', flexShrink: 0, flexWrap: 'wrap', gap: 10,
  },
  filterRow: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  filterBtn: {
    padding: '6px 14px', borderRadius: 20,
    cursor: 'pointer', fontSize: 12, fontWeight: 500,
  },
  sortSelect: {
    padding: '7px 12px', borderRadius: 8,
    fontSize: 12, cursor: 'pointer', outline: 'none',
  },
  tableWrapper: {
    flex: 1, overflow: 'hidden', display: 'flex',
    flexDirection: 'column', padding: '0 24px 24px',
    maxWidth: 1100, width: '100%', margin: '0 auto',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '90px 160px 150px 1fr 90px 40px',
    gap: 12, padding: '10px 16px',
    fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5,
    fontWeight: 600, flexShrink: 0,
  },
  tableBody: { flex: 1, overflowY: 'auto' },
  row: {
    display: 'grid',
    gridTemplateColumns: '90px 160px 150px 1fr 90px 40px',
    gap: 12, padding: '12px 16px', alignItems: 'center',
  },
  colDate: {},
  colCategory: { display: 'flex', alignItems: 'center' },
  colTime: {},
  colDesc: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  colDuration: { textAlign: 'right' },
  colAction: { textAlign: 'right' },
  categoryPill: {
    fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 12,
  },
  deleteBtn: {
    background: 'transparent', border: 'none',
    cursor: 'pointer', fontSize: 12,
  },
  emptyState: { textAlign: 'center', padding: '60px 0', fontSize: 14 },
}