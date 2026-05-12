import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// ── Tiny hook: reveal elements on scroll ──────────────────
const useScrollReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
};

// ── Data ──────────────────────────────────────────────────
const features = [
  {
    icon: '📊',
    title: 'Smart Dashboard',
    description:
      'Get a bird's-eye view of your finances with live charts, balance summaries, and monthly trend analysis — all in one place.',
  },
  {
    icon: '💸',
    title: 'Transaction Tracking',
    description:
      'Log income and expenses with categories, dates, and notes. Filter by type, date range, or search — find anything instantly.',
  },
  {
    icon: '🎯',
    title: 'Budget Management',
    description:
      'Set monthly spending limits per category. Get real-time progress bars and instant alerts when you're approaching your limit.',
  },
  {
    icon: '🏷️',
    title: 'Custom Categories',
    description:
      'Organise transactions your way. Default categories get you started immediately; custom ones let you personalise completely.',
  },
  {
    icon: '📈',
    title: 'Visual Insights',
    description:
      'Three interactive charts — expense distribution, monthly income vs expenses, and budget vs actual spending — tell your full financial story.',
  },
  {
    icon: '🔒',
    title: 'Secure by Default',
    description:
      'JWT access + refresh tokens, bcrypt password hashing, HTTP-only cookies, rate limiting, and Helmet security headers out of the box.',
  },
];

const stack = [
  { label: 'React',       color: '#61dafb' },
  { label: 'Node.js',     color: '#84cc16' },
  { label: 'Express.js',  color: '#94a3b8' },
  { label: 'MongoDB',     color: '#22c55e' },
  { label: 'Tailwind CSS',color: '#38bdf8' },
  { label: 'Recharts',    color: '#a78bfa' },
  { label: 'JWT Auth',    color: '#fbbf24' },
  { label: 'REST API',    color: '#fb923c' },
];

const stats = [
  { value: '20+', label: 'API Endpoints' },
  { value: '4',   label: 'Core Pages'    },
  { value: '13',  label: 'Default Categories' },
  { value: '3',   label: 'Live Charts'   },
];

// ── Component ─────────────────────────────────────────────
const Landing = () => {
  useScrollReveal();

  return (
    <>
      {/* ── Global styles injected once ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --bg:        #080c14;
          --bg2:       #0d1322;
          --bg3:       #111827;
          --border:    rgba(99,102,241,0.18);
          --primary:   #6366f1;
          --primary-l: #818cf8;
          --gold:      #f59e0b;
          --gold-l:    #fbbf24;
          --text:      #f1f5f9;
          --muted:     #94a3b8;
          --card-bg:   rgba(17,24,39,0.7);
        }

        .landing * { box-sizing: border-box; }

        .landing {
          font-family: 'DM Sans', sans-serif;
          background: var(--bg);
          color: var(--text);
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* ── typography ── */
        .display {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -0.03em;
        }
        .heading {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        /* ── gradient text ── */
        .gradient-text {
          background: linear-gradient(135deg, var(--primary-l) 0%, var(--gold-l) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ── noise overlay on hero ── */
        .noise::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }

        /* ── grid bg ── */
        .grid-bg {
          background-image:
            linear-gradient(var(--border) 1px, transparent 1px),
            linear-gradient(90deg, var(--border) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        /* ── glow orbs ── */
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
        }
        .orb-1 {
          width: 600px; height: 600px;
          background: rgba(99,102,241,0.15);
          top: -200px; left: -100px;
        }
        .orb-2 {
          width: 500px; height: 500px;
          background: rgba(245,158,11,0.08);
          top: 100px; right: -150px;
        }

        /* ── scroll reveal ── */
        .reveal {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .reveal.revealed {
          opacity: 1;
          transform: none;
        }
        .reveal-d1 { transition-delay: 0.1s; }
        .reveal-d2 { transition-delay: 0.2s; }
        .reveal-d3 { transition-delay: 0.3s; }
        .reveal-d4 { transition-delay: 0.4s; }
        .reveal-d5 { transition-delay: 0.5s; }

        /* ── buttons ── */
        .btn-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          border-radius: 14px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 15px;
          letter-spacing: -0.01em;
          transition: all 0.25s ease;
          cursor: pointer;
          border: none;
          text-decoration: none;
        }
        .btn-cta-primary {
          background: linear-gradient(135deg, var(--primary) 0%, #4f46e5 100%);
          color: #fff;
          box-shadow: 0 0 32px rgba(99,102,241,0.35);
        }
        .btn-cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 48px rgba(99,102,241,0.55);
        }
        .btn-cta-outline {
          background: transparent;
          color: var(--text);
          border: 1.5px solid var(--border);
          backdrop-filter: blur(10px);
        }
        .btn-cta-outline:hover {
          border-color: var(--primary-l);
          color: var(--primary-l);
          transform: translateY(-2px);
        }

        /* ── nav ── */
        .nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 40px;
          background: rgba(8,12,20,0.7);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 18px;
          color: var(--text);
          text-decoration: none;
        }
        .nav-logo-icon {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, var(--primary), #4f46e5);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .nav-link {
          color: var(--muted);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 10px;
          transition: all 0.2s;
        }
        .nav-link:hover { color: var(--text); background: rgba(255,255,255,0.05); }
        .nav-link-cta {
          background: linear-gradient(135deg, var(--primary), #4f46e5);
          color: #fff !important;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          box-shadow: 0 0 20px rgba(99,102,241,0.3);
        }
        .nav-link-cta:hover {
          box-shadow: 0 0 32px rgba(99,102,241,0.5);
          transform: translateY(-1px);
        }

        /* ── hero ── */
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 140px 24px 100px;
          overflow: hidden;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 100px;
          border: 1px solid rgba(99,102,241,0.35);
          background: rgba(99,102,241,0.08);
          color: var(--primary-l);
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 32px;
        }
        .hero-badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--primary-l);
          animation: pulse-dot 2s infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.4); }
        }
        .hero-title {
          font-size: clamp(48px, 8vw, 88px);
          margin: 0 0 24px;
          max-width: 900px;
        }
        .hero-sub {
          font-size: clamp(16px, 2.5vw, 20px);
          color: var(--muted);
          max-width: 560px;
          line-height: 1.7;
          margin: 0 auto 48px;
          font-weight: 300;
        }
        .hero-cta-row {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 80px;
        }

        /* ── stats strip ── */
        .stats-strip {
          display: flex;
          gap: 48px;
          justify-content: center;
          flex-wrap: wrap;
          padding: 32px 40px;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          background: rgba(17,24,39,0.5);
          backdrop-filter: blur(10px);
        }
        .stat-item { text-align: center; }
        .stat-value {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 32px;
          background: linear-gradient(135deg, var(--primary-l), var(--gold-l));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .stat-label {
          font-size: 13px;
          color: var(--muted);
          margin-top: 4px;
        }

        /* ── section ── */
        .section {
          padding: 100px 24px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .section-label {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--primary-l);
          margin-bottom: 12px;
        }
        .section-title {
          font-size: clamp(30px, 4vw, 46px);
          margin: 0 0 16px;
        }
        .section-sub {
          color: var(--muted);
          font-size: 17px;
          line-height: 1.7;
          max-width: 540px;
          font-weight: 300;
        }

        /* ── feature cards ── */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 20px;
          margin-top: 60px;
        }
        .feature-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 32px;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .feature-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--primary), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .feature-card:hover {
          border-color: rgba(99,102,241,0.4);
          transform: translateY(-4px);
          box-shadow: 0 24px 48px rgba(0,0,0,0.3);
        }
        .feature-card:hover::before { opacity: 1; }
        .feature-icon {
          font-size: 32px;
          margin-bottom: 20px;
          display: block;
        }
        .feature-title {
          font-size: 18px;
          font-weight: 700;
          margin: 0 0 10px;
          font-family: 'Syne', sans-serif;
        }
        .feature-desc {
          font-size: 14px;
          color: var(--muted);
          line-height: 1.7;
          font-weight: 300;
        }

        /* ── stack badges ── */
        .stack-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 40px;
        }
        .stack-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 100px;
          border: 1px solid var(--border);
          background: var(--card-bg);
          font-size: 14px;
          font-weight: 500;
          backdrop-filter: blur(10px);
          transition: all 0.2s;
        }
        .stack-badge:hover {
          border-color: rgba(255,255,255,0.2);
          transform: translateY(-2px);
        }
        .stack-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* ── CTA section ── */
        .cta-section {
          position: relative;
          padding: 100px 24px;
          text-align: center;
          overflow: hidden;
          background: var(--bg2);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .cta-orb {
          position: absolute;
          width: 800px; height: 800px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .cta-title {
          font-size: clamp(32px, 5vw, 56px);
          margin: 0 0 20px;
          position: relative;
          z-index: 1;
        }
        .cta-sub {
          color: var(--muted);
          font-size: 17px;
          max-width: 500px;
          margin: 0 auto 40px;
          font-weight: 300;
          line-height: 1.7;
          position: relative;
          z-index: 1;
        }
        .cta-btn-row {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
          position: relative;
          z-index: 1;
        }

        /* ── footer ── */
        .footer {
          padding: 40px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          border-top: 1px solid var(--border);
        }
        .footer-text {
          font-size: 13px;
          color: var(--muted);
        }
        .footer-stack {
          display: flex;
          gap: 6px;
          font-size: 12px;
          color: var(--muted);
          align-items: center;
          flex-wrap: wrap;
        }
        .footer-tag {
          padding: 3px 10px;
          border-radius: 100px;
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.2);
          color: var(--primary-l);
          font-size: 11px;
          font-weight: 500;
        }

        /* ── hero mockup preview ── */
        .mockup {
          position: relative;
          max-width: 880px;
          margin: 0 auto;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid var(--border);
          box-shadow: 0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1);
        }
        .mockup-bar {
          background: rgba(17,24,39,0.95);
          padding: 12px 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px solid var(--border);
        }
        .mockup-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
        }
        .mockup-url {
          flex: 1;
          margin: 0 16px;
          background: rgba(255,255,255,0.05);
          border-radius: 6px;
          padding: 4px 12px;
          font-size: 12px;
          color: var(--muted);
          font-family: monospace;
        }
        .mockup-body {
          background: #0d1322;
          padding: 24px;
          min-height: 320px;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          gap: 16px;
        }
        .mock-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 18px;
        }
        .mock-card-label {
          font-size: 11px;
          color: var(--muted);
          margin-bottom: 8px;
        }
        .mock-card-value {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 20px;
        }
        .mock-bar-wrap {
          grid-column: span 2;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 18px;
        }
        .mock-bar-label {
          font-size: 11px;
          color: var(--muted);
          margin-bottom: 16px;
        }
        .mock-bar-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }
        .mock-bar-name { font-size: 11px; color: var(--muted); width: 60px; }
        .mock-bar-track {
          flex: 1;
          height: 6px;
          background: rgba(255,255,255,0.08);
          border-radius: 99px;
          overflow: hidden;
        }
        .mock-bar-fill {
          height: 100%;
          border-radius: 99px;
        }

        @media (max-width: 768px) {
          .nav { padding: 16px 20px; }
          .mockup-body { grid-template-columns: 1fr 1fr; }
          .mock-bar-wrap { grid-column: span 2; }
          .stats-strip { gap: 32px; padding: 24px; }
          .footer { flex-direction: column; text-align: center; }
        }

        @media (max-width: 480px) {
          .mockup-body { display: none; }
          .nav-links .nav-link:not(.nav-link-cta) { display: none; }
        }
      `}</style>

      <div className="landing">

        {/* ── Navbar ── */}
        <nav className="nav">
          <a href="#" className="nav-logo">
            <div className="nav-logo-icon">💰</div>
            FinanceTracker
          </a>
          <div className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#stack"    className="nav-link">Stack</a>
            <Link to="/login"    className="nav-link">Sign In</Link>
            <Link to="/register" className="nav-link nav-link-cta">Get Started</Link>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="hero grid-bg noise">
          <div className="orb orb-1" />
          <div className="orb orb-2" />

          {/* Content above mockup */}
          <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '900px' }}>
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              Full-Stack Personal Finance App
            </div>

            <h1 className="display hero-title">
              Take Control of{' '}
              <span className="gradient-text">Your Money.</span>
              <br />Finally.
            </h1>

            <p className="hero-sub">
              Track income and expenses, set smart budgets, and visualise your
              financial health with a beautiful real-time dashboard — all secured
              with industry-standard authentication.
            </p>

            <div className="hero-cta-row">
              <Link to="/register" className="btn-cta btn-cta-primary">
                Start for Free
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link to="/login" className="btn-cta btn-cta-outline">
                Sign In
              </Link>
            </div>

            {/* Browser mockup */}
            <div className="mockup reveal">
              <div className="mockup-bar">
                <div className="mockup-dot" style={{ background: '#ef4444' }} />
                <div className="mockup-dot" style={{ background: '#f59e0b' }} />
                <div className="mockup-dot" style={{ background: '#22c55e' }} />
                <div className="mockup-url">localhost:5173/dashboard</div>
              </div>
              <div className="mockup-body">
                <div className="mock-card">
                  <div className="mock-card-label">Total Income</div>
                  <div className="mock-card-value" style={{ color: '#22c55e' }}>LKR 150K</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>↑ 3 transactions</div>
                </div>
                <div className="mock-card">
                  <div className="mock-card-label">Total Expenses</div>
                  <div className="mock-card-value" style={{ color: '#ef4444' }}>LKR 42K</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>↓ 8 transactions</div>
                </div>
                <div className="mock-card">
                  <div className="mock-card-label">Net Balance</div>
                  <div className="mock-card-value" style={{ color: '#818cf8' }}>LKR 108K</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>This month</div>
                </div>
                <div className="mock-card">
                  <div className="mock-card-label">Active Budgets</div>
                  <div className="mock-card-value" style={{ color: '#f59e0b' }}>4</div>
                  <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '6px' }}>1 exceeded</div>
                </div>
                <div className="mock-bar-wrap">
                  <div className="mock-bar-label">Budget vs Actual</div>
                  {[
                    { name: 'Food',       pct: 72,  color: '#f97316' },
                    { name: 'Transport',  pct: 45,  color: '#f59e0b' },
                    { name: 'Rent',       pct: 100, color: '#ef4444' },
                    { name: 'Shopping',   pct: 30,  color: '#ec4899' },
                  ].map((b) => (
                    <div key={b.name} className="mock-bar-row">
                      <div className="mock-bar-name">{b.name}</div>
                      <div className="mock-bar-track">
                        <div
                          className="mock-bar-fill"
                          style={{ width: `${b.pct}%`, background: b.color }}
                        />
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', width: '32px', textAlign: 'right' }}>
                        {b.pct}%
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mock-bar-wrap">
                  <div className="mock-bar-label">Monthly Trend</div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '80px', paddingBottom: '4px' }}>
                    {[
                      { h: 40, c: '#6366f1' }, { h: 55, c: '#6366f1' },
                      { h: 35, c: '#6366f1' }, { h: 70, c: '#6366f1' },
                      { h: 50, c: '#6366f1' }, { h: 80, c: '#818cf8' },
                      { h: 30, c: '#ef4444' }, { h: 45, c: '#ef4444' },
                      { h: 60, c: '#ef4444' }, { h: 25, c: '#ef4444' },
                      { h: 70, c: '#ef4444' }, { h: 55, c: '#ef4444' },
                    ].map((bar, i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: `${bar.h}%`,
                          background: bar.c,
                          borderRadius: '4px 4px 0 0',
                          opacity: 0.8,
                        }}
                      />
                    ))}
                  </div>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    fontSize: '10px', color: '#475569', marginTop: '6px',
                  }}>
                    {['J','F','M','A','M','J','J','A','S','O','N','D'].map((m) => (
                      <span key={m}>{m}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats Strip ── */}
        <div className="stats-strip">
          {stats.map((s, i) => (
            <div key={i} className="stat-item reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Features ── */}
        <section className="section" id="features">
          <p className="section-label reveal">Features</p>
          <h2 className="heading section-title reveal reveal-d1">
            Everything you need to{' '}
            <span className="gradient-text">manage finances</span>
          </h2>
          <p className="section-sub reveal reveal-d2">
            A complete full-stack solution — from authentication to analytics —
            built with a clean architecture designed to scale.
          </p>

          <div className="features-grid">
            {features.map((f, i) => (
              <div
                key={i}
                className={`feature-card reveal reveal-d${Math.min(i + 1, 5)}`}
              >
                <span className="feature-icon">{f.icon}</span>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Tech Stack ── */}
        <section
          id="stack"
          style={{
            background: 'var(--bg2)',
            borderTop: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
            padding: '80px 24px',
          }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <p className="section-label reveal">Tech Stack</p>
            <h2 className="heading section-title reveal reveal-d1">
              Built with modern,{' '}
              <span className="gradient-text">production-grade</span> tools
            </h2>
            <p className="section-sub reveal reveal-d2">
              Every technology choice is deliberate — chosen for performance,
              developer experience, and real-world scalability.
            </p>

            <div className="stack-grid reveal reveal-d3">
              {stack.map((s, i) => (
                <div key={i} className="stack-badge">
                  <div className="stack-dot" style={{ background: s.color }} />
                  {s.label}
                </div>
              ))}
            </div>

            {/* Architecture callout */}
            <div style={{
              marginTop: '48px',
              background: 'var(--card-bg)',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              padding: '32px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '24px',
              backdropFilter: 'blur(10px)',
            }}
              className="reveal reveal-d4"
            >
              {[
                { icon: '⚡', title: 'REST API', desc: '20+ endpoints with proper validation, error handling, and consistent response format' },
                { icon: '🔐', title: 'JWT Auth',  desc: 'Access + refresh token pattern with HTTP-only cookies and auto-renewal' },
                { icon: '🧩', title: 'Clean Architecture', desc: 'Separate layers for routes, controllers, services, and models — easy to extend' },
                { icon: '📦', title: 'MongoDB Atlas', desc: 'Cloud-hosted with Mongoose ODM, indexed queries, and aggregation pipelines' },
              ].map((item, i) => (
                <div key={i}>
                  <div style={{ fontSize: '24px', marginBottom: '10px' }}>{item.icon}</div>
                  <h4 style={{
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: 700,
                    fontSize: '15px',
                    margin: '0 0 6px',
                  }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: '1.6', margin: 0, fontWeight: 300 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="cta-section">
          <div className="cta-orb" />
          <p className="section-label reveal" style={{ position: 'relative', zIndex: 1 }}>
            Get Started
          </p>
          <h2 className="display cta-title reveal reveal-d1">
            Ready to track your{' '}
            <span className="gradient-text">finances?</span>
          </h2>
          <p className="cta-sub reveal reveal-d2">
            Create a free account in seconds. Default categories are set up
            automatically so you can start adding transactions right away.
          </p>
          <div className="cta-btn-row reveal reveal-d3">
            <Link to="/register" className="btn-cta btn-cta-primary">
              Create Free Account
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link to="/login" className="btn-cta btn-cta-outline">
              Sign In
            </Link>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="footer">
          <div className="footer-text">
            FinanceTracker — Personal Finance & Budget Tracking Application
          </div>
          <div className="footer-stack">
            <span>Built with</span>
            {['React', 'Express.js', 'MongoDB'].map((t) => (
              <span key={t} className="footer-tag">{t}</span>
            ))}
          </div>
        </footer>

      </div>
    </>
  );
};

export default Landing;