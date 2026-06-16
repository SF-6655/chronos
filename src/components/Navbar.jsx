import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useTheme } from '../lib/ThemeContext'

export default function Navbar({ user }) {
  const navigate = useNavigate()
  const { theme, isDark, toggleTheme } = useTheme()

  async function handleSignOut() {
    await supabase.auth.signOut()
    sessionStorage.clear()
    localStorage.clear()
    navigate('/login', { replace: true })
  }

  return (
    <nav style={{ ...s.nav, background: theme.bgSecondary, borderBottom: `1px solid ${theme.border}` }}>
      <div style={s.logo}>
        <span style={s.logoIcon}>⏱</span>
        <span style={{ ...s.logoText, color: theme.accent }}>Chronos</span>
      </div>

      <div style={s.right}>
        <button onClick={toggleTheme} style={{ ...s.themeBtn, background: theme.bgTertiary, border: `1px solid ${theme.border}`, color: theme.textSecondary }}>
          {isDark ? '☀️ Light' : '🌙 Dark'}
        </button>
        <span style={{ ...s.email, color: theme.textMuted }}>{user?.email}</span>
        <button onClick={handleSignOut} style={{ ...s.signOutBtn, border: `1px solid ${theme.border}`, color: theme.textMuted }}>
          Sign out
        </button>
      </div>
    </nav>
  )
}

const s = {
  nav: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0 28px', height: 56, position: 'sticky', top: 0, zIndex: 100,
    backdropFilter: 'blur(12px)',
  },
  logo: { display: 'flex', alignItems: 'center', gap: 8 },
  logoIcon: { fontSize: 20 },
  logoText: { fontSize: 18, fontWeight: 700, letterSpacing: -0.5 },
  right: { display: 'flex', alignItems: 'center', gap: 12 },
  themeBtn: {
    padding: '6px 14px', borderRadius: 20,
    cursor: 'pointer', fontSize: 12, fontWeight: 500,
  },
  email: { fontSize: 12 },
  signOutBtn: {
    background: 'transparent', borderRadius: 8,
    padding: '6px 14px', cursor: 'pointer', fontSize: 13,
  },
}