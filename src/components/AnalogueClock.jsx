import { useState, useEffect } from 'react'
import { useTheme } from '../lib/ThemeContext'

export default function AnalogueClock() {
  const { theme } = useTheme()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const seconds = time.getSeconds()
  const minutes = time.getMinutes()
  const hours = time.getHours() % 12

  const secAngle = seconds * 6
  const minAngle = minutes * 6 + seconds * 0.1
  const hourAngle = hours * 30 + minutes * 0.5

  const size = 200
  const center = size / 2

  function getHandPoint(angle, length) {
    const rad = (angle - 90) * (Math.PI / 180)
    return {
      x: center + length * Math.cos(rad),
      y: center + length * Math.sin(rad),
    }
  }

  const hourPoint = getHandPoint(hourAngle, 50)
  const minPoint = getHandPoint(minAngle, 70)
  const secPoint = getHandPoint(secAngle, 78)

  const timezoneLabel = Intl.DateTimeFormat().resolvedOptions().timeZone

  return (
    <div style={s.wrapper}>
      <svg width={size} height={size} style={{ filter: `drop-shadow(0 0 16px ${theme.accent}55)` }}>
        <circle cx={center} cy={center} r={94} fill="none" stroke={theme.borderLight} strokeWidth={2} />
        <circle cx={center} cy={center} r={88} fill={theme.bgSecondary} stroke={theme.border} strokeWidth={1} />

        {[...Array(12)].map((_, i) => {
          const angle = i * 30
          const outer = getHandPoint(angle, 80)
          const inner = getHandPoint(angle, 70)
          return (
            <line
              key={i}
              x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
              stroke={theme.textMuted} strokeWidth={i % 3 === 0 ? 2.5 : 1.5}
            />
          )
        })}

        <line x1={center} y1={center} x2={hourPoint.x} y2={hourPoint.y} stroke={theme.text} strokeWidth={4} strokeLinecap="round" />
        <line x1={center} y1={center} x2={minPoint.x} y2={minPoint.y} stroke={theme.text} strokeWidth={3} strokeLinecap="round" />
        <line x1={center} y1={center} x2={secPoint.x} y2={secPoint.y} stroke={theme.accent} strokeWidth={1.5} strokeLinecap="round" />

        <circle cx={center} cy={center} r={4} fill={theme.accent} />
      </svg>

      <div style={{ ...s.digital, color: theme.textSecondary }}>
        {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
      </div>
      <div style={{ ...s.timezone, color: theme.textMuted }}>{timezoneLabel}</div>
    </div>
  )
}

const s = {
  wrapper: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: 10,
  },
  digital: {
    fontSize: 16, fontWeight: 600, fontFamily: 'monospace', letterSpacing: 1,
  },
  timezone: {
    fontSize: 11, textTransform: 'uppercase', letterSpacing: 1,
  },
}