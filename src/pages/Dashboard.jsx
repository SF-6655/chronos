import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../lib/ThemeContext'
import { useAutoScale } from '../hooks/useAutoScale'
import Navbar from '../components/Navbar'
import Timer from '../components/Timer'
import StatsCards from '../components/StatsCards'
import WeeklyChart from '../components/WeeklyChart'
import RecentSessions from '../components/RecentSessions'
import SessionsTable from '../components/SessionsTable'
import StreakBadge from '../components/StreakBadge'
import SmartInsight from '../components/SmartInsight'
import DayRing from '../components/DayRing'
import GridBackground from '../components/GridBackground'
import AmbientOrbs from '../components/AmbientOrbs'

export default function Dashboard() {
  const { user } = useAuth()
  const { theme } = useTheme()
  const { scale } = useAutoScale(1600, 880)
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [showTable, setShowTable] = useState(false)
  const timerActionRef = useRef(null)

  const fetchEntries = useCallback(async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('time_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(150)

    if (!error) setEntries(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  useEffect(() => {
    function handleKeyPress(e) {
      if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA' && !showTable) {
        e.preventDefault()
        if (timerActionRef.current) timerActionRef.current()
      }
      if (e.code === 'Escape' && showTable) {
        setShowTable(false)
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [showTable])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: theme.bg }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: theme.accent, marginBottom: 12 }}>⏱ Chronos</div>
          <p style={{ fontSize: 14, color: theme.textMuted }}>Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const categoryTotals = entries.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.duration_seconds
    return acc
  }, {})
  const categoryColors = {
    Study: '#7c6ef5', Work: '#60a5fa', Health: '#4ade80',
    Lifestyle: '#f59e0b', 'Side Project': '#f472b6', Social: '#34d399',
  }
  const totalSeconds = entries.reduce((sum, e) => sum + e.duration_seconds, 0)
  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])

return (
  <div style={{ ...s.page, background: theme.bg, color: theme.text }}>
    <AmbientOrbs />
    <GridBackground />

      <div style={s.content}>
        <Navbar user={user} />

        <div style={s.scaleOuter}>
          <div style={{ ...s.scaleInner, transform: `scale(${scale})` }}>
            <div style={{ padding: '0 0 12px' }}>
              <SmartInsight entries={entries} />
            </div>

            <div style={s.layout}>
              {/* Left Column — Timer + Breakdown */}
              <div style={s.leftCol}>
                <div style={s.colHeader}>
                  <span style={{ ...s.colLabel, color: theme.textMuted }}>Timer</span>
                  <StreakBadge entries={entries} />
                </div>
                <div style={s.timerWrapper}>
                  <Timer user={user} onEntryAdded={fetchEntries} triggerRef={timerActionRef} />
                </div>

                <div style={{
                  ...s.breakdown,
                  background: theme.bgSecondary,
                  border: `1px solid ${theme.border}`,
                  boxShadow: theme.cardShadow,
                  backdropFilter: 'blur(12px)',
                }}>
                  <div style={{ ...s.breakdownTitle, color: theme.textSecondary }}>Category breakdown</div>
                  {sortedCategories.map(([cat, secs]) => {
                    const pct = totalSeconds > 0 ? Math.round((secs / totalSeconds) * 100) : 0
                    const color = categoryColors[cat] || '#7c6ef5'
                    return (
                      <div key={cat} style={s.breakdownRow}>
                        <div style={s.breakdownLeft}>
                          <div style={{ ...s.breakdownDot, background: color, boxShadow: `0 0 8px ${color}88` }} />
                          <span style={{ ...s.breakdownCat, color: theme.text }}>{cat}</span>
                        </div>
                        <div style={s.breakdownRight}>
                          <div style={{ ...s.breakdownBar, background: theme.bgTertiary }}>
                            <div style={{ ...s.breakdownFill, width: `${pct}%`, background: color }} />
                          </div>
                          <span style={{ ...s.breakdownPct, color: theme.textMuted }}>{pct}%</span>
                        </div>
                      </div>
                    )
                  })}
                  {entries.length === 0 && (
                    <p style={{ fontSize: 12, color: theme.textMuted, textAlign: 'center', padding: '16px 0' }}>No data yet</p>
                  )}
                </div>
              </div>

              {/* Middle Column — Chart + Sessions */}
              <div style={s.midCol}>
                <div style={s.colHeader}>
                  <span style={{ ...s.colLabel, color: theme.textMuted }}>Weekly Overview</span>
                </div>
                <div style={s.chartWrapper}>
                  <WeeklyChart entries={entries} />
                </div>
                <div style={{ ...s.colHeader, marginTop: 10 }}>
                  <span style={{ ...s.colLabel, color: theme.textMuted }}>Sessions</span>
                </div>
                <div style={s.sessionsWrapper}>
                  <RecentSessions entries={entries} onViewAll={() => setShowTable(true)} />
                </div>
              </div>

              {/* Right Column — Stats only */}
              <div style={s.rightCol}>
                <div style={s.colHeader}>
                  <span style={{ ...s.colLabel, color: theme.textMuted }}>Stats</span>
                </div>

                <DayRing entries={entries} />

                <div style={{ marginTop: 8, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <StatsCards entries={entries} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SessionsTable
        entries={entries}
        isOpen={showTable}
        onClose={() => setShowTable(false)}
        onDeleted={fetchEntries}
      />
    </div>
  )
}

const s = {
  page: { height: '100vh', position: 'relative', overflow: 'hidden' },
  content: {
    position: 'relative', zIndex: 1, height: '100%',
    display: 'flex', flexDirection: 'column',
  },
  scaleOuter: {
    flex: 1, display: 'flex', justifyContent: 'center',
    alignItems: 'center', overflow: 'hidden', position: 'relative',
  },
  scaleInner: {
    width: 1600, flexShrink: 0, transformOrigin: 'center center',
    padding: '14px 20px 0',
  },
  layout: {
    display: 'grid', gridTemplateColumns: '300px 1fr 280px', gap: 16,
  },
  leftCol: { display: 'flex', flexDirection: 'column', height: 800 },
  midCol: { display: 'flex', flexDirection: 'column', height: 800 },
  rightCol: { display: 'flex', flexDirection: 'column', height: 800 },
  colHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  colLabel: { fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 },
  timerWrapper: { flexShrink: 0 },
  chartWrapper: { flexShrink: 0 },
  sessionsWrapper: { flex: 1, minHeight: 0, overflow: 'hidden' },
  breakdown: { borderRadius: 14, padding: '16px', marginTop: 10, flex: 1, overflowY: 'auto', minHeight: 0 },
  breakdownTitle: { fontSize: 14, fontWeight: 600, marginBottom: 14 },
  breakdownRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, gap: 8 },
  breakdownLeft: { display: 'flex', alignItems: 'center', gap: 7, minWidth: 90 },
  breakdownDot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
  breakdownCat: { fontSize: 12, fontWeight: 500 },
  breakdownRight: { display: 'flex', alignItems: 'center', gap: 8, flex: 1 },
  breakdownBar: { flex: 1, height: 4, borderRadius: 2, overflow: 'hidden' },
  breakdownFill: { height: '100%', borderRadius: 2, transition: 'width 0.6s ease' },
  breakdownPct: { fontSize: 11, minWidth: 28, textAlign: 'right' },
}