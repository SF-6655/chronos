import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../lib/ThemeContext'
import Navbar from '../components/Navbar'
import Timer from '../components/Timer'
import StatsCards from '../components/StatsCards'
import WeeklyChart from '../components/WeeklyChart'
import RecentSessions from '../components/RecentSessions'

export default function Dashboard() {
  const { user } = useAuth()
  const { theme } = useTheme()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchEntries = useCallback(async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('time_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100)

    if (!error) setEntries(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: theme.bg,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: theme.accent, marginBottom: 12 }}>⏱ Chronos</div>
          <p style={{ fontSize: 14, color: theme.textMuted }}>Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ ...s.page, background: theme.bg, color: theme.text }}>
      <Navbar user={user} />

      <div style={s.layout}>
        {/* Left Column — Timer */}
        <div style={s.leftCol}>
          <div style={{ ...s.colHeader, color: theme.textMuted }}>
            <span style={s.colLabel}>Timer</span>
            <span style={{ ...s.colDate, color: theme.textMuted }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <div style={s.timerWrapper}>
            <Timer user={user} onEntryAdded={fetchEntries} />
          </div>
        </div>

        {/* Middle Column — Chart + Sessions */}
        <div style={s.midCol}>
          <div style={{ ...s.colHeader, color: theme.textMuted }}>
            <span style={s.colLabel}>Weekly Overview</span>
          </div>
          <div style={s.chartWrapper}>
            <WeeklyChart entries={entries} />
          </div>
          <div style={{ ...s.colHeader, color: theme.textMuted, marginTop: 12 }}>
            <span style={s.colLabel}>Sessions</span>
          </div>
          <div style={s.sessionsWrapper}>
            <RecentSessions entries={entries} onDeleted={fetchEntries} />
          </div>
        </div>

        {/* Right Column — Stats */}
        <div style={s.rightCol}>
          <div style={{ ...s.colHeader, color: theme.textMuted }}>
            <span style={s.colLabel}>Stats</span>
          </div>
          <StatsCards entries={entries} />

          {/* Category breakdown */}
          <div style={{
            ...s.breakdown,
            background: theme.bgSecondary,
            border: `1px solid ${theme.border}`,
            boxShadow: theme.cardShadow,
          }}>
            <div style={{ ...s.breakdownTitle, color: theme.textSecondary }}>Category breakdown</div>
            {Object.entries(
              entries.reduce((acc, e) => {
                acc[e.category] = (acc[e.category] || 0) + e.duration_seconds
                return acc
              }, {})
            )
              .sort((a, b) => b[1] - a[1])
              .map(([cat, secs]) => {
                const total = entries.reduce((s, e) => s + e.duration_seconds, 0)
                const pct = total > 0 ? Math.round((secs / total) * 100) : 0
                const colors = {
                  Study: '#7c6ef5', Work: '#60a5fa', Health: '#4ade80',
                  Lifestyle: '#f59e0b', 'Side Project': '#f472b6', Social: '#34d399',
                }
                const color = colors[cat] || '#7c6ef5'
                return (
                  <div key={cat} style={s.breakdownRow}>
                    <div style={s.breakdownLeft}>
                      <div style={{ ...s.breakdownDot, background: color }} />
                      <span style={{ ...s.breakdownCat, color: theme.text }}>{cat}</span>
                    </div>
                    <div style={s.breakdownRight}>
                      <div style={{ ...s.breakdownBar, background: theme.bgTertiary }}>
                        <div style={{
                          ...s.breakdownFill,
                          width: `${pct}%`,
                          background: color,
                        }} />
                      </div>
                      <span style={{ ...s.breakdownPct, color: theme.textMuted }}>{pct}%</span>
                    </div>
                  </div>
                )
              })}
            {entries.length === 0 && (
              <p style={{ fontSize: 12, color: theme.textMuted, textAlign: 'center', padding: '16px 0' }}>
                No data yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const s = {
  page: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '300px 1fr 260px',
    gap: 16,
    padding: '16px 20px',
    flex: 1,
    overflow: 'hidden',
    maxWidth: 1400,
    width: '100%',
    margin: '0 auto',
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  midCol: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  colHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  colLabel: {
    fontSize: 11,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  colDate: { fontSize: 11 },
  timerWrapper: { flex: 1, overflow: 'hidden' },
  chartWrapper: { flexShrink: 0 },
  sessionsWrapper: {
    flex: 1,
    overflow: 'hidden',
    minHeight: 0,
  },
  breakdown: {
    borderRadius: 14,
    padding: '16px',
    marginTop: 10,
    flex: 1,
  },
  breakdownTitle: {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 14,
  },
  breakdownRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 8,
  },
  breakdownLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    minWidth: 90,
  },
  breakdownDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    flexShrink: 0,
  },
  breakdownCat: { fontSize: 12, fontWeight: 500 },
  breakdownRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  breakdownBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  breakdownFill: {
    height: '100%',
    borderRadius: 2,
    transition: 'width 0.6s ease',
  },
  breakdownPct: {
    fontSize: 11,
    minWidth: 28,
    textAlign: 'right',
  },
}