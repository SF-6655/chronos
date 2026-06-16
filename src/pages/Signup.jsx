import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Signup() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSignup(e) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    navigate('/dashboard', { replace: true })
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <Link to="/" style={s.logo}>⏱ Chronos</Link>
        <h1 style={s.title}>Create your account</h1>
        <p style={s.subtitle}>Start tracking your time today — free forever</p>

        {error && <div style={s.error}>{error}</div>}

        <form onSubmit={handleSignup} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={s.input}
            />
          </div>

          <div style={s.field}>
            <label style={s.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 characters"
              required
              style={s.input}
            />
          </div>

          <div style={s.field}>
            <label style={s.label}>Confirm password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={s.input}
            />
          </div>

          <div style={s.passwordStrength}>
            {['8+ chars', 'Uppercase', 'Number'].map((req) => (
              <span
                key={req}
                style={{
                  ...s.reqBadge,
                  background: password.length >= 8 && req === '8+ chars'
                    ? '#1a2e1a' : password.match(/[A-Z]/) && req === 'Uppercase'
                    ? '#1a2e1a' : password.match(/[0-9]/) && req === 'Number'
                    ? '#1a2e1a' : '#1a1a2e',
                  color: password.length >= 8 && req === '8+ chars'
                    ? '#4ade80' : password.match(/[A-Z]/) && req === 'Uppercase'
                    ? '#4ade80' : password.match(/[0-9]/) && req === 'Number'
                    ? '#4ade80' : '#555',
                  border: password.length >= 8 && req === '8+ chars'
                    ? '1px solid #2a4a2a' : password.match(/[A-Z]/) && req === 'Uppercase'
                    ? '1px solid #2a4a2a' : password.match(/[0-9]/) && req === 'Number'
                    ? '1px solid #2a4a2a' : '1px solid #2a2a4a',
                }}
              >
                {req}
              </span>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ ...s.btn, opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Creating account...' : 'Create account →'}
          </button>
        </form>

        <p style={s.switchText}>
          Already have an account?{' '}
          <Link to="/login" style={s.switchLink}>Sign in</Link>
        </p>

        <p style={s.terms}>
          By signing up you agree to our terms of service and privacy policy.
        </p>
      </div>
    </div>
  )
}

const s = {
  page: {
    minHeight: '100vh', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    padding: '24px', background: '#080810',
  },
  card: {
    width: '100%', maxWidth: 420,
    background: '#0f0f1a', border: '1px solid #1a1a2e',
    borderRadius: 20, padding: '40px 36px',
  },
  logo: {
    display: 'block', fontSize: 18, fontWeight: 700,
    color: '#7c6ef5', marginBottom: 28,
  },
  title: { fontSize: 26, fontWeight: 700, marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 28 },
  error: {
    background: '#2a1a1a', border: '1px solid #5a2a2a',
    borderRadius: 8, padding: '12px 14px',
    fontSize: 13, color: '#f87171', marginBottom: 20,
  },
  form: { display: 'flex', flexDirection: 'column', gap: 18 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, color: '#888', fontWeight: 500 },
  input: {
    background: '#080810', border: '1px solid #2a2a4a',
    borderRadius: 10, padding: '12px 14px', color: '#f0f0f0',
    fontSize: 15, outline: 'none',
  },
  passwordStrength: { display: 'flex', gap: 8 },
  reqBadge: {
    fontSize: 11, padding: '4px 10px',
    borderRadius: 20, fontWeight: 500,
  },
  btn: {
    background: '#7c6ef5', border: 'none', borderRadius: 10,
    color: '#fff', padding: '13px', fontSize: 15,
    fontWeight: 600, cursor: 'pointer', marginTop: 4,
  },
  switchText: { fontSize: 13, color: '#555', textAlign: 'center', marginTop: 24 },
  switchLink: { color: '#7c6ef5', fontWeight: 500 },
  terms: { fontSize: 11, color: '#333', textAlign: 'center', marginTop: 12 },
}