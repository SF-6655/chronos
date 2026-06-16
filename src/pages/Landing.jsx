import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <div style={s.logo}>⏱ Chronos</div>
        <div style={s.navLinks}>
          <button onClick={() => navigate('/login')} style={s.navBtn}>Log in</button>
          <button onClick={() => navigate('/signup')} style={s.navBtnPrimary}>Get started</button>
        </div>
      </nav>

      <div style={s.hero}>
        <div style={s.badge}>Personal Time Intelligence</div>
        <h1 style={s.title}>
          Know exactly where<br />your time actually goes
        </h1>
        <p style={s.subtitle}>
          Track time across every area of your life. Study, work, health, side projects.<br />
          See the truth in your weekly charts. Build better habits with real data.
        </p>
        <div style={s.ctaRow}>
          <button onClick={() => navigate('/signup')} style={s.ctaPrimary}>
            Start tracking free →
          </button>
          <button onClick={() => navigate('/login')} style={s.ctaSecondary}>
            I have an account
          </button>
        </div>
      </div>

      <div style={s.features}>
        {[
          { icon: '⏱', title: 'Live Timer', desc: 'One click to start tracking. Stop when you are done. That simple.' },
          { icon: '📊', title: 'Weekly Insights', desc: 'Beautiful charts showing exactly where your week went.' },
          { icon: '🗂', title: 'Smart Categories', desc: 'Study, Work, Health, Lifestyle, Side Projects and more.' },
          { icon: '🔒', title: 'Private & Secure', desc: 'Your data is yours. Row-level security means nobody else can see it.' },
        ].map((f) => (
          <div key={f.title} style={s.featureCard}>
            <div style={s.featureIcon}>{f.icon}</div>
            <div style={s.featureTitle}>{f.title}</div>
            <div style={s.featureDesc}>{f.desc}</div>
          </div>
        ))}
      </div>

      <div style={s.footer}>
        <span style={s.footerText}>© 2026 Chronos · Built for people who value their time</span>
      </div>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  nav: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '20px 48px', borderBottom: '1px solid #1a1a2e',
    position: 'sticky', top: 0, background: '#080810', zIndex: 10,
  },
  logo: { fontSize: 20, fontWeight: 700, color: '#7c6ef5', letterSpacing: -0.5 },
  navLinks: { display: 'flex', gap: 12, alignItems: 'center' },
  navBtn: {
    background: 'transparent', border: '1px solid #2a2a4a',
    borderRadius: 8, color: '#aaa', padding: '8px 18px',
    cursor: 'pointer', fontSize: 14,
  },
  navBtnPrimary: {
    background: '#7c6ef5', border: 'none',
    borderRadius: 8, color: '#fff', padding: '8px 18px',
    cursor: 'pointer', fontSize: 14, fontWeight: 500,
  },
  hero: {
    flex: 1, display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    textAlign: 'center', padding: '80px 24px 60px',
  },
  badge: {
    display: 'inline-block', background: '#1a1a2e',
    border: '1px solid #2a2a4a', borderRadius: 20,
    padding: '6px 16px', fontSize: 12, color: '#7c6ef5',
    fontWeight: 500, marginBottom: 24, letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 56, fontWeight: 800, lineHeight: 1.15,
    marginBottom: 24, letterSpacing: -1.5,
    background: 'linear-gradient(135deg, #ffffff 0%, #7c6ef5 100%)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: 18, color: '#666', lineHeight: 1.7,
    marginBottom: 40, maxWidth: 560,
  },
  ctaRow: { display: 'flex', gap: 12, alignItems: 'center' },
  ctaPrimary: {
    background: '#7c6ef5', border: 'none', borderRadius: 10,
    color: '#fff', padding: '14px 28px', fontSize: 16,
    fontWeight: 600, cursor: 'pointer',
  },
  ctaSecondary: {
    background: 'transparent', border: '1px solid #2a2a4a',
    borderRadius: 10, color: '#888', padding: '14px 28px',
    fontSize: 16, cursor: 'pointer',
  },
  features: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16, padding: '0 48px 80px', maxWidth: 1200, margin: '0 auto', width: '100%',
  },
  featureCard: {
    background: '#0f0f1a', border: '1px solid #1a1a2e',
    borderRadius: 16, padding: '28px 24px',
  },
  featureIcon: { fontSize: 28, marginBottom: 12 },
  featureTitle: { fontSize: 16, fontWeight: 600, marginBottom: 8 },
  featureDesc: { fontSize: 14, color: '#666', lineHeight: 1.6 },
  footer: {
    borderTop: '1px solid #1a1a2e', padding: '24px 48px',
    textAlign: 'center',
  },
  footerText: { fontSize: 13, color: '#444' },
}