import { useTheme } from '../lib/ThemeContext'

export default function AmbientOrbs() {
  const { isDark } = useTheme()

  const orbs = isDark
    ? [
        { color: '#7c6ef5', top: '-10%', left: '5%', size: 500, opacity: 0.35 },
        { color: '#3b82f6', top: '40%', left: '75%', size: 450, opacity: 0.25 },
        { color: '#ec4899', top: '70%', left: '15%', size: 400, opacity: 0.18 },
        { color: '#34d399', top: '10%', left: '85%', size: 350, opacity: 0.15 },
      ]
    : [
        { color: '#a78bfa', top: '-10%', left: '5%', size: 500, opacity: 0.25 },
        { color: '#93c5fd', top: '40%', left: '75%', size: 450, opacity: 0.2 },
        { color: '#f9a8d4', top: '70%', left: '15%', size: 400, opacity: 0.15 },
        { color: '#86efac', top: '10%', left: '85%', size: 350, opacity: 0.12 },
      ]

  return (
    <div style={s.wrapper}>
      {orbs.map((orb, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: orb.top,
            left: orb.left,
            width: orb.size,
            height: orb.size,
            borderRadius: '50%',
            background: orb.color,
            opacity: orb.opacity,
            filter: 'blur(80px)',
            animation: `float${i % 2} ${18 + i * 4}s ease-in-out infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes float0 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, -30px) scale(1.1); }
        }
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 40px) scale(0.95); }
        }
      `}</style>
    </div>
  )
}

const s = {
  wrapper: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100%', height: '100%',
    zIndex: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
}