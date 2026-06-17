import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useTimer } from '../hooks/useTimer'
import { useTheme } from '../lib/ThemeContext'

const CATEGORIES = {
  Study: ['Lectures', 'Assignments', 'Revision', 'Research', 'Reading'],
  Work: ['Deep Work', 'Meetings', 'Admin', 'Emails', 'Planning'],
  Health: ['Gym', 'Running', 'Walking', 'Meditation', 'Sleep'],
  Lifestyle: ['Cooking', 'Cleaning', 'Shopping', 'Family', 'Hobbies'],
  'Side Project': ['Coding', 'Design', 'Research', 'Marketing', 'Writing'],
  Social: ['Friends', 'Dating', 'Gaming', 'Events', 'Travel'],
}

const CATEGORY_COLORS = {
  Study: '#7c6ef5',
  Work: '#60a5fa',
  Health: '#4ade80',
  Lifestyle: '#f59e0b',
  'Side Project': '#f472b6',
  Social: '#34d399',
}

function CircularTimer({ elapsed, isRunning, color, formatTime, justStopped }) {
  const size = 180
  const radius = 78
  const circumference = 2 * Math.PI * radius
  const maxSeconds = 3600
  const progress = Math.min(elapsed / maxSeconds, 1)
  const strokeDashoffset = circumference - progress * circumference

  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto 20px' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#2a2a4a" strokeWidth={6} />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={6}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 1s linear',
            filter: isRunning ? `drop-shadow(0 0 6px ${color}88)` : 'none',
          }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        {justStopped ? (
          <div style={{ fontSize: 40, animation: 'fadeIn 0.3s ease' }}>✓</div>
        ) : (
          <>
            <div style={{
              fontSize: 32, fontWeight: 800, color, letterSpacing: -1,
              fontVariantNumeric: 'tabular-nums',
            }}>
              {formatTime(elapsed)}
            </div>
            {isRunning && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, animation: 'pulse 1.5s infinite' }} />
                <span style={{ fontSize: 11, color, fontWeight: 500 }}>LIVE</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function Timer({ user, onEntryAdded, triggerRef }) {
  const { theme } = useTheme()
  const { isRunning, elapsed, start, stop, formatTime, showIdleNudge, dismissNudge } = useTimer()
  const [category, setCategory] = useState('Study')
  const [subcategory, setSubcategory] = useState('Lectures')
  const [description, setDescription] = useState('')
  const [startTimeISO, setStartTimeISO] = useState(null)
  const [saving, setSaving] = useState(false)
  const [justStopped, setJustStopped] = useState(false)

  const color = CATEGORY_COLORS[category]

  function handleCategoryChange(cat) {
    if (isRunning) return
    setCategory(cat)
    setSubcategory(CATEGORIES[cat][0])
  }

  function handleStart() {
    const iso = start()
    setStartTimeISO(iso)
  }

  async function handleStop() {
    const { endTime, duration } = stop()
    if (duration < 5) return
    setSaving(true)

    const { error } = await supabase.from('time_entries').insert({
      user_id: user.id,
      category,
      subcategory,
      description,
      start_time: startTimeISO,
      end_time: endTime,
      duration_seconds: duration,
    })

    if (!error) {
      onEntryAdded()
      setDescription('')
      setJustStopped(true)
      setTimeout(() => setJustStopped(false), 1200)
    }
    setSaving(false)
  }

  useEffect(() => {
    if (triggerRef) {
      triggerRef.current = isRunning ? handleStop : handleStart
    }
  }, [isRunning])

  return (
      <div style={{
        ...s.wrapper,
        background: theme.bgSecondary,
        border: `1px solid ${theme.border}`,
        boxShadow: theme.cardShadow,
        backdropFilter: theme.glassBlur,
        WebkitBackdropFilter: theme.glassBlur,
      }}>
      {showIdleNudge && (
        <div style={{ ...s.nudge, background: theme.accentSoft, border: `1px solid ${theme.accent}` }}>
          <span style={{ fontSize: 12, color: theme.textSecondary }}>Still working on this? You've been going for 2h+</span>
          <button onClick={dismissNudge} style={{ ...s.nudgeBtn, color: theme.accent }}>Dismiss</button>
        </div>
      )}

      <CircularTimer
        elapsed={elapsed}
        isRunning={isRunning}
        color={color}
        formatTime={formatTime}
        justStopped={justStopped}
      />

      <div style={s.categoryGrid}>
        {Object.keys(CATEGORIES).map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            disabled={isRunning}
            style={{
              ...s.catBtn,
              background: category === cat ? CATEGORY_COLORS[cat] : theme.bgTertiary,
              color: category === cat ? '#fff' : theme.textMuted,
              border: `1px solid ${category === cat ? CATEGORY_COLORS[cat] : theme.border}`,
              opacity: isRunning && category !== cat ? 0.4 : 1,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={s.subcategoryRow}>
        {CATEGORIES[category].map((sub) => (
          <button
            key={sub}
            onClick={() => !isRunning && setSubcategory(sub)}
            style={{
              ...s.subBtn,
              background: subcategory === sub ? theme.accentSoft : 'transparent',
              color: subcategory === sub ? color : theme.textMuted,
              border: `1px solid ${subcategory === sub ? color : theme.borderLight}`,
            }}
          >
            {sub}
          </button>
        ))}
      </div>

      <input
        style={{
          ...s.descInput,
          background: theme.bgTertiary,
          border: `1px solid ${theme.border}`,
          color: theme.text,
        }}
        placeholder="What are you working on? (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={isRunning}
      />

      <button
        onClick={isRunning ? handleStop : handleStart}
        disabled={saving}
        style={{
          ...s.mainBtn,
          background: isRunning ? 'transparent' : color,
          border: isRunning ? `2px solid ${theme.danger}` : 'none',
          color: isRunning ? theme.danger : '#fff',
          opacity: saving ? 0.6 : 1,
        }}
      >
        {saving ? 'Saving...' : isRunning ? '⏹ Stop & Save' : '▶ Start Timer'}
      </button>

      <div style={{ fontSize: 11, color: theme.textMuted, textAlign: 'center', marginTop: 2 }}>
        Tip: Press <kbd style={{ ...s.kbd, borderColor: theme.border, background: theme.bgTertiary }}>Space</kbd> to start/stop
      </div>
    </div>
  )
}

const s = {
  wrapper: { borderRadius: 16, padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 12, height: '100%' },
  nudge: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '8px 12px', borderRadius: 10, marginBottom: 4 },
  nudgeBtn: { background: 'transparent', border: 'none', fontSize: 11, fontWeight: 600, cursor: 'pointer', flexShrink: 0 },
  categoryGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 },
  catBtn: { padding: '8px 4px', borderRadius: 10, cursor: 'pointer', fontSize: 12, fontWeight: 500, transition: 'all 0.15s', textAlign: 'center' },
  subcategoryRow: { display: 'flex', flexWrap: 'wrap', gap: 5 },
  subBtn: { padding: '4px 10px', borderRadius: 20, cursor: 'pointer', fontSize: 11, transition: 'all 0.15s' },
  descInput: { borderRadius: 10, padding: '10px 14px', fontSize: 13, outline: 'none', width: '100%' },
  mainBtn: { width: '100%', padding: '13px', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', letterSpacing: 0.3, marginTop: 4 },
  kbd: { padding: '1px 6px', borderRadius: 4, border: '1px solid', fontSize: 10, fontFamily: 'monospace' },
}