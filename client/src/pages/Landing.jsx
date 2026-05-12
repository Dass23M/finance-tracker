import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const useScrollReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('revealed');
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
};

// Custom SVG Icons for a professional look
const Icons = {
  Dashboard: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  ),
  Transactions: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3v18" /><path d="m22 8-5-5-5 5" /><path d="M7 21V3" /><path d="m2 16 5 5 5-5" />
    </svg>
  ),
  Budget: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  ),
  Categories: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.586 5.586A2 2 0 0 0 8.172 5H3a1 1 0 0 0-1 1v5.172a2 2 0 0 0 .586 1.414l8.204 8.204a2.426 2.426 0 0 0 3.42 0l3.584-3.584a2.426 2.426 0 0 0 0-3.42z" />
      <circle cx="6.5" cy="9.5" r=".5" fill="currentColor" />
    </svg>
  ),
  Insights: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  Secure: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" />
    </svg>
  ),
};

const features = [
  { icon: <Icons.Dashboard />, color: '#f0f9ff', iconColor: '#0ea5e9', title: 'Smart Dashboard', description: "Bird's-eye view of your finances with live charts, balance summaries, and monthly trend analysis all in one place." },
  { icon: <Icons.Transactions />, color: '#f8fafc', iconColor: '#0f172a', title: 'Transaction Tracking', description: 'Log income and expenses with categories, dates, and notes. Filter, sort, and paginate — find any transaction instantly.' },
  { icon: <Icons.Budget />, color: '#f0f9ff', iconColor: '#0ea5e9', title: 'Budget Management', description: "Set monthly spending limits per category. Real-time progress bars and instant alerts when you're approaching limits." },
  { icon: <Icons.Categories />, color: '#f8fafc', iconColor: '#0f172a', title: 'Custom Categories', description: 'Organise transactions your way. 13 default categories get you started; add your own to personalise completely.' },
  { icon: <Icons.Insights />, color: '#f0f9ff', iconColor: '#0ea5e9', title: 'Visual Insights', description: 'Three interactive charts — expense distribution, monthly income vs expenses, and budget vs actual spending.' },
  { icon: <Icons.Secure />, color: '#f8fafc', iconColor: '#0f172a', title: 'Secure by Default', description: 'JWT access + refresh tokens, bcrypt hashing, HTTP-only cookies, rate limiting, and Helmet security headers.' },
];

const stack = [
  { label: 'React', dot: '#0ea5e9' },
  { label: 'Express.js', dot: '#0f172a' },
  { label: 'MongoDB Atlas', dot: '#0ea5e9' },
  { label: 'Node.js', dot: '#0f172a' },
  { label: 'Tailwind CSS', dot: '#0ea5e9' },
  { label: 'Recharts', dot: '#0f172a' },
  { label: 'JWT Auth', dot: '#0ea5e9' },
  { label: 'REST API', dot: '#0f172a' },
];

const stats = [
  { value: '20+', label: 'API Endpoints' },
  { value: '4', label: 'Core Pages' },
  { value: '13', label: 'Default Categories' },
  { value: '3', label: 'Live Charts' },
];

const howItWorks = [
  { step: '01', title: 'Create an account', desc: 'Register in seconds. Default categories seeded automatically so you can start immediately.' },
  { step: '02', title: 'Log your transactions', desc: 'Add income and expenses with categories, amounts, dates, and optional notes.' },
  { step: '03', title: 'Set spending budgets', desc: 'Define monthly limits per category and track real-time progress against them.' },
  { step: '04', title: 'Read your insights', desc: 'Use dashboard charts to understand your spending habits and improve over time.' },
];

const Landing = () => {
  useScrollReveal();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@500;700;800&display=swap');

        .lp { font-family: 'Inter', sans-serif; background: #ffffff; color: #0f172a; overflow-x: hidden; min-height: 100vh; }
        .lp * { box-sizing: border-box; margin: 0; padding: 0; }

        .lp-grad { color: #0ea5e9; }
        .lp-display { font-family: 'Outfit', sans-serif; font-weight: 800; line-height: 1.1; letter-spacing: -0.03em; }
        .lp-heading { font-family: 'Outfit', sans-serif; font-weight: 700; letter-spacing: -0.02em; }

        .reveal { opacity: 0; transform: translateY(28px); transition: opacity .65s ease, transform .65s ease; }
        .reveal.revealed { opacity: 1; transform: none; }
        .reveal-d1 { transition-delay: .08s; } .reveal-d2 { transition-delay: .16s; } .reveal-d3 { transition-delay: .24s; } .reveal-d4 { transition-delay: .32s; } .reveal-d5 { transition-delay: .40s; }

        /* NAV */
        .lp-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; height: 72px; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(12px); border-bottom: 1px solid #f1f5f9; }
        .lp-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; color: #000000; }
        .lp-logo-icon { width: 36px; height: 36px; background: #000000; color: #ffffff; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
        .lp-logo-text { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 19px; letter-spacing: -0.02em; }
        .lp-nav-links { display: flex; align-items: center; gap: 8px; }
        .lp-nav-a { text-decoration: none; font-size: 14px; font-weight: 500; color: #475569; padding: 8px 16px; border-radius: 8px; transition: all .2s; }
        .lp-nav-a:hover { color: #000000; background: #f8fafc; }
        .lp-nav-signin { color: #0f172a; border: 1px solid #e2e8f0; }
        .lp-nav-signin:hover { border-color: #0f172a; background: #ffffff; }
        .lp-nav-cta { background: #0ea5e9; color: #fff !important; font-weight: 600; }
        .lp-nav-cta:hover { background: #0284c7; transform: translateY(-1px); }

        /* HERO */
        .lp-hero { position: relative; padding: 160px 24px 80px; text-align: center; overflow: hidden; background: #ffffff; }
        .lp-hero::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(#e2e8f0 1px, transparent 1px); background-size: 32px 32px; opacity: 0.5; pointer-events: none; }
        .lp-hero-inner { position: relative; z-index: 1; max-width: 860px; margin: 0 auto; }
        .lp-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; border-radius: 100px; background: #f0f9ff; border: 1px solid #bae6fd; color: #0369a1; font-size: 13px; font-weight: 600; margin-bottom: 32px; }
        .lp-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #0ea5e9; animation: lp-pulse 2s infinite; }
        @keyframes lp-pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.5); opacity: .5; } }
        .lp-hero-title { font-size: clamp(46px, 7vw, 84px); color: #000000; margin-bottom: 24px; }
        .lp-hero-sub { font-size: clamp(16px, 2.2vw, 19px); color: #475569; max-width: 580px; margin: 0 auto 48px; line-height: 1.6; font-weight: 400; }
        .lp-btn-row { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-bottom: 80px; }
        .lp-btn { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; border-radius: 10px; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 15px; text-decoration: none; transition: all .2s ease; cursor: pointer; border: none; }
        .lp-btn-primary { background: #000000; color: #ffffff; box-shadow: 0 4px 14px rgba(0,0,0,0.15); }
        .lp-btn-primary:hover { background: #0ea5e9; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(14, 165, 233, 0.25); }
        .lp-btn-outline { background: #ffffff; color: #0f172a; border: 1px solid #cbd5e1; }
        .lp-btn-outline:hover { border-color: #0ea5e9; color: #0ea5e9; transform: translateY(-2px); }

        /* MOCKUP */
        .lp-mockup { max-width: 900px; margin: 0 auto; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 20px 40px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02); background: #ffffff; }
        .lp-mockup-bar { background: #f8fafc; padding: 12px 20px; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid #e2e8f0; }
        .lp-mockup-dot { width: 10px; height: 10px; border-radius: 50%; }
        .lp-mockup-url { flex: 1; margin: 0 16px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px 12px; font-size: 12px; color: #94a3b8; font-family: monospace; text-align: center; }
        .lp-mockup-body { background: #f8fafc; padding: 24px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .lp-mc { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; }
        .lp-mc-label { font-size: 12px; color: #64748b; margin-bottom: 8px; font-weight: 500; }
        .lp-mc-value { font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 22px; color: #000000; }
        .lp-mc-sub { font-size: 12px; margin-top: 6px; }
        .lp-mc-wide { grid-column: span 2; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; }
        .lp-bar-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
        .lp-bar-name { font-size: 12px; color: #475569; width: 64px; font-weight: 500; }
        .lp-bar-track { flex: 1; height: 6px; background: #f1f5f9; border-radius: 99px; overflow: hidden; }
        .lp-bar-fill { height: 100%; border-radius: 99px; }
        .lp-bar-pct { font-size: 12px; color: #64748b; width: 32px; text-align: right; }

        /* STATS */
        .lp-stats { background: #ffffff; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: center; flex-wrap: wrap; }
        .lp-stat { text-align: center; padding: 40px 64px; border-right: 1px solid #f1f5f9; }
        .lp-stat:last-child { border-right: none; }
        .lp-stat-val { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 40px; color: #000000; line-height: 1; margin-bottom: 8px; }
        .lp-stat-label { font-size: 14px; color: #64748b; font-weight: 500; }

        /* SECTION */
        .lp-sec { max-width: 1160px; margin: 0 auto; padding: 100px 24px; }
        .lp-sec-tag { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; color: #0ea5e9; margin-bottom: 20px; }
        .lp-sec-title { font-size: clamp(32px, 4vw, 48px); color: #000000; margin-bottom: 16px; }
        .lp-sec-sub { font-size: 17px; color: #475569; line-height: 1.7; max-width: 560px; font-weight: 400; }

        /* FEATURES */
        .lp-feat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; margin-top: 64px; }
        .lp-feat-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 32px; transition: all .2s ease; }
        .lp-feat-card:hover { border-color: #0ea5e9; box-shadow: 0 12px 32px rgba(14, 165, 233, 0.05); transform: translateY(-4px); }
        .lp-feat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; }
        .lp-feat-title { font-size: 18px; font-weight: 700; font-family: 'Outfit', sans-serif; color: #000000; margin-bottom: 12px; }
        .lp-feat-desc { font-size: 14px; color: #475569; line-height: 1.7; }

        /* HOW IT WORKS */
        .lp-steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; margin-top: 64px; }
        .lp-step { padding: 32px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; }
        .lp-step-num { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 48px; color: #f1f5f9; line-height: 1; margin-bottom: 20px; transition: color .3s; }
        .lp-step:hover .lp-step-num { color: #0ea5e9; }
        .lp-step-title { font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 18px; color: #000000; margin-bottom: 10px; }
        .lp-step-desc { font-size: 14px; color: #475569; line-height: 1.6; }

        /* STACK */
        .lp-stack-bg { background: #f8fafc; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; padding: 100px 24px; }
        .lp-stack-inner { max-width: 1160px; margin: 0 auto; text-align: center; }
        .lp-chips { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 48px; }
        .lp-chip { display: flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 100px; background: #ffffff; border: 1px solid #e2e8f0; font-size: 14px; font-weight: 500; color: #0f172a; transition: all .2s; }
        .lp-chip:hover { border-color: #0ea5e9; color: #0ea5e9; }
        .lp-chip-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        
        /* CTA */
        .lp-cta { background: #ffffff; padding: 120px 24px; text-align: center; }
        .lp-cta-inner { max-width: 640px; margin: 0 auto; padding: 64px 40px; background: #0f172a; border-radius: 24px; color: #ffffff; }
        .lp-cta-title { font-size: clamp(32px, 5vw, 48px); color: #ffffff; margin-bottom: 20px; }
        .lp-cta-sub { font-size: 17px; color: #94a3b8; line-height: 1.7; margin-bottom: 40px; font-weight: 400; }
        .lp-cta .lp-btn-primary { background: #ffffff; color: #000000; }
        .lp-cta .lp-btn-primary:hover { background: #0ea5e9; color: #ffffff; }
        .lp-cta .lp-btn-outline { background: transparent; color: #ffffff; border-color: #334155; }
        .lp-cta .lp-btn-outline:hover { border-color: #ffffff; }

        /* FOOTER */
        .lp-footer { background: #ffffff; border-top: 1px solid #e2e8f0; padding: 32px 40px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
        .lp-footer-left { display: flex; align-items: center; gap: 12px; }
        .lp-footer-logo { width: 28px; height: 28px; background: #000000; color: #ffffff; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 14px; }
        .lp-footer-name { font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 15px; color: #000000; }
        .lp-footer-right { display: flex; gap: 12px; flex-wrap: wrap; }
        .lp-footer-tag { font-size: 13px; color: #64748b; font-weight: 500; }

        @media(max-width: 768px) {
          .lp-nav { padding: 0 20px; }
          .lp-mockup-body { grid-template-columns: repeat(2, 1fr); }
          .lp-mc-wide { grid-column: span 2; }
          .lp-stat { padding: 32px; border-right: none; border-bottom: 1px solid #f1f5f9; width: 50%; }
          .lp-stat:nth-child(even) { border-right: none; }
          .lp-stat:nth-child(odd) { border-right: 1px solid #f1f5f9; }
          .lp-footer { flex-direction: column; text-align: center; }
          .lp-footer-right { justify-content: center; }
        }
        @media(max-width: 540px) {
          .lp-nav-a:not(.lp-nav-cta):not(.lp-nav-signin) { display: none; }
          .lp-stat { width: 100%; border-right: none !important; }
        }
      `}</style>

      <div className="lp">
        {/* NAV */}
        <nav className="lp-nav">
          <a href="/" className="lp-logo">
            <div className="lp-logo-icon">
              <Icons.Insights />
            </div>
            <span className="lp-logo-text">FinanceTracker</span>
          </a>
          <div className="lp-nav-links">
            <a href="#features" className="lp-nav-a">Features</a>
            <a href="#how" className="lp-nav-a">How it works</a>
            <a href="#stack" className="lp-nav-a">Tech</a>
            <Link to="/login" className="lp-nav-a lp-nav-signin">Sign In</Link>
            <Link to="/register" className="lp-nav-a lp-nav-cta">Get Started</Link>
          </div>
        </nav>

        {/* HERO */}
        <section className="lp-hero">
          <div className="lp-hero-inner">
            <div className="lp-badge reveal">
              <span className="lp-badge-dot" />
              Full-Stack Personal Finance Platform
            </div>

            <h1 className="lp-display lp-hero-title reveal reveal-d1">
              Track Every Detail. <br/>
              <span className="lp-grad">Spend Smarter.</span>
            </h1>

            <p className="lp-hero-sub reveal reveal-d2">
              Log income and expenses, set category budgets, and understand your
              financial health through a beautiful real-time dashboard —
              secured with industry-standard authentication.
            </p>

            <div className="lp-btn-row reveal reveal-d3">
              <Link to="/register" className="lp-btn lp-btn-primary">
                Start Tracking Free
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link to="/login" className="lp-btn lp-btn-outline">Sign In to Account</Link>
            </div>

            {/* Mockup */}
            <div className="lp-mockup reveal reveal-d4">
              <div className="lp-mockup-bar">
                <div className="lp-mockup-dot" style={{ background: '#e2e8f0' }} />
                <div className="lp-mockup-dot" style={{ background: '#e2e8f0' }} />
                <div className="lp-mockup-dot" style={{ background: '#e2e8f0' }} />
                <div className="lp-mockup-url">app.financetracker.com/dashboard</div>
              </div>
              <div className="lp-mockup-body">
                <div className="lp-mc">
                  <div className="lp-mc-label">Total Income</div>
                  <div className="lp-mc-value">LKR 150K</div>
                  <div className="lp-mc-sub" style={{ color: '#10b981' }}>↑ 3 transactions</div>
                </div>
                <div className="lp-mc">
                  <div className="lp-mc-label">Total Expenses</div>
                  <div className="lp-mc-value">LKR 42K</div>
                  <div className="lp-mc-sub" style={{ color: '#f43f5e' }}>↓ 8 transactions</div>
                </div>
                <div className="lp-mc">
                  <div className="lp-mc-label">Net Balance</div>
                  <div className="lp-mc-value" style={{ color: '#0ea5e9' }}>LKR 108K</div>
                  <div className="lp-mc-sub" style={{ color: '#64748b' }}>This month</div>
                </div>
                <div className="lp-mc">
                  <div className="lp-mc-label">Active Budgets</div>
                  <div className="lp-mc-value">4</div>
                  <div className="lp-mc-sub" style={{ color: '#f59e0b' }}>1 near limit</div>
                </div>
                
                <div className="lp-mc-wide">
                  <div className="lp-mc-label" style={{ marginBottom: '16px', color: '#000' }}>Budget vs Actual</div>
                  {[
                    { name: 'Food', pct: 72, color: '#0ea5e9' },
                    { name: 'Transport', pct: 45, color: '#0f172a' },
                    { name: 'Rent', pct: 100, color: '#f43f5e' },
                    { name: 'Shopping', pct: 30, color: '#94a3b8' },
                  ].map((b) => (
                    <div key={b.name} className="lp-bar-row">
                      <div className="lp-bar-name">{b.name}</div>
                      <div className="lp-bar-track">
                        <div className="lp-bar-fill" style={{ width: `${b.pct}%`, background: b.color }} />
                      </div>
                      <div className="lp-bar-pct">{b.pct}%</div>
                    </div>
                  ))}
                </div>
                
                <div className="lp-mc-wide">
                  <div className="lp-mc-label" style={{ marginBottom: '14px', color: '#000' }}>Monthly Trend</div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '80px' }}>
                    {[
                      [40, '#e2e8f0'], [55, '#e2e8f0'], [35, '#e2e8f0'], [70, '#e2e8f0'],
                      [50, '#e2e8f0'], [80, '#0ea5e9'], [30, '#0f172a'], [45, '#0f172a'],
                      [60, '#0f172a'], [25, '#0f172a'], [70, '#0f172a'], [55, '#0f172a'],
                    ].map(([h, c], i) => (
                      <div key={i} style={{ flex: 1, height: `${h}%`, background: c, borderRadius: '4px 4px 0 0' }} />
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginTop: '8px' }}>
                    {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'].map((m, i) => <span key={i}>{m}</span>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <div className="lp-stats">
          {stats.map((s, i) => (
            <div key={i} className="lp-stat reveal" style={{ transitionDelay: `${i * .1}s` }}>
              <div className="lp-stat-val">{s.value}</div>
              <div className="lp-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* FEATURES */}
        <section className="lp-sec" id="features">
          <div className="lp-sec-tag reveal">Platform Features</div>
          <h2 className="lp-heading lp-sec-title reveal reveal-d1">
            Everything you need to manage <span className="lp-grad">wealth.</span>
          </h2>
          <p className="lp-sec-sub reveal reveal-d2">
            A complete full-stack solution built with clean architecture, 
            designed to scale and perform effortlessly.
          </p>
          <div className="lp-feat-grid">
            {features.map((f, i) => (
              <div key={i} className={`lp-feat-card reveal reveal-d${Math.min(i + 1, 5)}`}>
                <div className="lp-feat-icon" style={{ background: f.color, color: f.iconColor }}>
                  {f.icon}
                </div>
                <div className="lp-feat-title">{f.title}</div>
                <div className="lp-feat-desc">{f.description}</div>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '100px 24px' }}>
          <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
            <div className="lp-sec-tag reveal">How it works</div>
            <h2 className="lp-heading lp-sec-title reveal reveal-d1">
              Up and running in <span className="lp-grad">4 simple steps</span>
            </h2>
            <p className="lp-sec-sub reveal reveal-d2">
              No complex setup. Register, add transactions, set budgets,
              and your dashboard comes alive immediately.
            </p>
            <div className="lp-steps">
              {howItWorks.map((s, i) => (
                <div key={i} className={`lp-step reveal reveal-d${i + 1}`}>
                  <div className="lp-step-num">{s.step}</div>
                  <div className="lp-step-title">{s.title}</div>
                  <div className="lp-step-desc">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STACK */}
        <section className="lp-stack-bg" id="stack" style={{ background: '#ffffff', border: 'none' }}>
          <div className="lp-stack-inner">
            <div className="lp-sec-tag reveal">Tech Stack</div>
            <h2 className="lp-heading lp-sec-title reveal reveal-d1">
              Built with <span className="lp-grad">production-grade</span> tools
            </h2>
            <p className="lp-sec-sub reveal reveal-d2" style={{ margin: '0 auto' }}>
              Every technology choice is deliberate — chosen for performance,
              developer experience, and real-world scalability.
            </p>
            <div className="lp-chips reveal reveal-d3">
              {stack.map((s, i) => (
                <div key={i} className="lp-chip">
                  <div className="lp-chip-dot" style={{ background: s.dot }} />
                  {s.label}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="lp-cta">
          <div className="lp-cta-inner reveal">
            <h2 className="lp-display lp-cta-title">
              Take control of your money today.
            </h2>
            <p className="lp-cta-sub">
              Create a free account in seconds. Default categories are set up
              automatically so you can start tracking right away.
            </p>
            <div className="lp-btn-row" style={{ marginBottom: 0 }}>
              <Link to="/register" className="lp-btn lp-btn-primary">
                Create Free Account
              </Link>
              <Link to="/login" className="lp-btn lp-btn-outline">
                Sign In
              </Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="lp-footer">
          <div className="lp-footer-left">
            <div className="lp-footer-logo">
               <Icons.Insights />
            </div>
            <span className="lp-footer-name">FinanceTracker</span>
            <span style={{ fontSize: '13px', color: '#94a3b8', marginLeft: '8px' }}>
              — Personal Finance App
            </span>
          </div>
          <div className="lp-footer-right">
            {['React', 'Express.js', 'MongoDB', 'Node.js'].map((t) => (
              <span key={t} className="lp-footer-tag">{t}</span>
            ))}
          </div>
        </footer>

      </div>
    </>
  );
};

export default Landing;