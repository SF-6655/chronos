import { useState, useEffect, useRef } from 'react'
import { useTheme } from '../lib/ThemeContext'

export default function DigitalClock() {
  const { theme } = useTheme()
  const [time, setTime] = useState(new Date())
  const [showSetter, setShowSetter] = useState(false)
  const [alarmTime, setAlarmTime] = useState(null)
  const [alarmRinging, setAlarmRinging] = useState(false)
  const [inputHour, setInputHour] = useState('07')
  const [inputMinute, setInputMinute] = useState('00')
  const [inputPeriod, setInputPeriod] = useState('AM')
  const audioContextRef = useRef(null)
  const ringIntervalRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!alarmTime) return
    const now = new Date()
    if (
      now.getHours() === alarmTime.hours &&
      now.getMinutes() === alarmTime.minutes &&
      now.getSeconds() === 0
    ) {
      triggerAlarm()
    }
  }, [time, alarmTime])

  function playBeep() {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
      }
      const ctx = audioContextRef.current
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      oscillator.frequency.value = 880
      oscillator.type = 'sine'
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)
      oscillator.start()
      oscillator.stop(ctx.currentTime + 0.4)
    } catch (e) {
      console.error('Audio error', e)
    }
  }

  function triggerAlarm() {
    setAlarmRinging(true)
    playBeep()
    ringIntervalRef.current = setInterval(playBeep, 600)
  }

  function dismissAlarm() {
    setAlarmRinging(false)
    setAlarmTime(null)
    clearInterval(ringIntervalRef.current)
  }

  function setAlarm() {
    let h = parseInt(inputHour, 10) % 12
    if (inputPeriod === 'PM') h += 12
    setAlarmTime({ hours: h, minutes: parseInt(inputMinute, 10) })
    setShowSetter(false)
  }

  function clearAlarm() {
    setAlarmTime(null)
    setShowSetter(false)
  }

  const hours = time.getHours()
  const displayHours = String(hours % 12 === 0 ? 12 : hours % 12).padStart(2, '0')
  const minutes = String(time.getMinutes()).padStart(2, '0')
  const seconds = String(time.getSeconds()).padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const dateLabel = time.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })

  function formatAlarmLabel() {
    if (!alarmTime) return null
    const h12 = alarmTime.hours % 12 === 0 ? 12 : alarmTime.hours % 12
    const period = alarmTime.hours >= 12 ? 'PM' : 'AM'
    return `${String(h12).padStart(2, '0')}:${String(alarmTime.minutes).padStart(2, '0')} ${period}`
  }

  return (
    <div style={{ position: 'relative', pointerEvents: 'auto' }}>
      <div
        onClick={() => setShowSetter(!showSetter)}
        style={{
          ...s.wrapper,
          background: theme.bgSecondary,
          border: `1px solid ${alarmRinging ? theme.danger : theme.border}`,
          boxShadow: alarmRinging ? `0 0 30px ${theme.danger}aa` : theme.glowAccent,
          backdropFilter: theme.glassBlur,
          WebkitBackdropFilter: theme.glassBlur,
          cursor: 'pointer',
          animation: alarmRinging ? 'shake 0.3s infinite' : 'none',
        }}
      >
        <div style={s.dotsRow}>
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{ ...s.dot, background: alarmRinging ? theme.danger : theme.accent, animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>

        <div style={{ ...s.timeDisplay, color: alarmRinging ? theme.danger : theme.accent }}>
          {displayHours}:{minutes}
          <span style={{ ...s.seconds, color: theme.textMuted }}>:{seconds}</span>
        </div>

        <div style={{ ...s.ampm, color: theme.textSecondary }}>{ampm}</div>
        <div style={{ ...s.date, color: theme.textMuted }}>{dateLabel}</div>

        {alarmTime && !alarmRinging && (
          <div style={{ ...s.alarmBadge, color: theme.accent, borderColor: theme.accent }}>
            ⏰ {formatAlarmLabel()}
          </div>
        )}

        {alarmRinging && (
          <button onClick={(e) => { e.stopPropagation(); dismissAlarm() }} style={{ ...s.dismissBtn, background: theme.danger }}>
            Dismiss
          </button>
        )}
      </div>

      {showSetter && !alarmRinging && (
        <div style={{
          ...s.setterPopup,
          background: theme.bgSecondary,
          border: `1px solid ${theme.border}`,
          backdropFilter: theme.glassBlur,
          WebkitBackdropFilter: theme.glassBlur,
        }}>
          <div style={{ ...s.setterTitle, color: theme.textSecondary }}>Set alarm</div>
          <div style={s.setterRow}>
            <select value={inputHour} onChange={(e) => setInputHour(e.target.value)} style={{ ...s.select, background: theme.bgTertiary, color: theme.text, border: `1px solid ${theme.border}` }}>
              {[...Array(12)].map((_, i) => {
                const v = String(i + 1).padStart(2, '0')
                return <option key={v} value={v}>{v}</option>
              })}
            </select>
            <span style={{ color: theme.textMuted }}>:</span>
            <select value={inputMinute} onChange={(e) => setInputMinute(e.target.value)} style={{ ...s.select, background: theme.bgTertiary, color: theme.text, border: `1px solid ${theme.border}` }}>
              {[...Array(60)].map((_, i) => {
                const v = String(i).padStart(2, '0')
                return <option key={v} value={v}>{v}</option>
              })}
            </select>
            <select value={inputPeriod} onChange={(e) => setInputPeriod(e.target.value)} style={{ ...s.select, background: theme.bgTertiary, color: theme.text, border: `1px solid ${theme.border}` }}>
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
          <div style={s.setterActions}>
            <button onClick={setAlarm} style={{ ...s.setBtn, background: theme.accent }}>Set</button>
            {alarmTime && (
              <button onClick={clearAlarm} style={{ ...s.clearBtn, color: theme.textMuted, border: `1px solid ${theme.border}` }}>Clear</button>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes dotPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
        }
      `}</style>
    </div>
  )
}

const s = {
  wrapper: {
    borderRadius: 18, padding: '28px 24px',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: 6, position: 'relative',
  },
  dotsRow: { display: 'flex', gap: 5, marginBottom: 8 },
  dot: { width: 5, height: 5, borderRadius: '50%', animation: 'dotPulse 1.5s infinite' },
  timeDisplay: { fontSize: 34, fontWeight: 800, fontFamily: 'monospace', letterSpacing: 1, lineHeight: 1 },
  seconds: { fontSize: 20, fontWeight: 600 },
  ampm: { fontSize: 13, fontWeight: 600, letterSpacing: 2, marginTop: 4 },
  date: { fontSize: 12, marginTop: 6 },
  alarmBadge: {
    marginTop: 10, fontSize: 12, fontWeight: 600,
    padding: '4px 12px', borderRadius: 20, border: '1px solid',
  },
  dismissBtn: {
    marginTop: 12, border: 'none', borderRadius: 10,
    color: '#fff', padding: '10px 20px', fontSize: 13,
    fontWeight: 700, cursor: 'pointer',
  },
  setterPopup: {
    position: 'absolute', top: '100%', left: '50%',
    transform: 'translateX(-50%)', marginTop: 12,
    borderRadius: 14, padding: '18px', width: 240,
    zIndex: 10,
  },
  setterTitle: { fontSize: 13, fontWeight: 600, marginBottom: 12, textAlign: 'center' },
  setterRow: { display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', marginBottom: 14 },
  select: { borderRadius: 8, padding: '6px 8px', fontSize: 13, outline: 'none', cursor: 'pointer' },
  setterActions: { display: 'flex', gap: 8, justifyContent: 'center' },
  setBtn: { border: 'none', borderRadius: 8, color: '#fff', padding: '8px 18px', fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  clearBtn: { background: 'transparent', borderRadius: 8, padding: '8px 14px', fontSize: 12, cursor: 'pointer' },
}