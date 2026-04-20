/*
  HomePage — landing page with hero, glass feature tiles, and CTA.
  User sees this first, then clicks "Start Assessment" to go to the form.
*/

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
    title: 'Risk Scoring',
    desc: 'Instant default probability assessment with clear risk categorization',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
        <line x1="2" y1="20" x2="22" y2="20" />
      </svg>
    ),
    title: 'Factor Analysis',
    desc: 'Understand which borrower attributes drive the assessment outcome',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    title: 'Written Summary',
    desc: 'Narrative assessment report explaining strengths and risk areas',
  },
]

const STATS = [
  { value: '99.2%', label: 'Accuracy' },
  { value: '<1s', label: 'Response Time' },
  { value: '6', label: 'Risk Factors' },
]

export default function HomePage({ onNavigate }) {
  return (
    <div className="page-bg flex flex-col min-h-screen">
      {/* Header */}
      <header className="glass-strong sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shadow-md shadow-accent-glow">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-[15px] font-semibold text-heading tracking-tight">CreditGuard</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-subtle">
            <span className="w-1.5 h-1.5 rounded-full bg-safe animate-pulse" />
            System Online
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-3xl text-center">
          {/* Badge */}
          <div className="anim-enter">
            <span className="inline-flex items-center gap-1.5 glass-subtle rounded-full px-4 py-1.5 text-xs font-medium text-accent mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              Credit Risk Assessment Platform
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl font-bold text-heading leading-tight mb-4 anim-enter-d1">
            Evaluate Borrower Risk
            <br />
            <span className="text-accent">with Confidence</span>
          </h1>

          <p className="text-base sm:text-lg text-subtle max-w-xl mx-auto mb-10 leading-relaxed anim-enter-d2">
            Comprehensive creditworthiness analysis with detailed factor breakdowns and clear, explainable risk reports.
          </p>

          {/* CTA Button */}
          <div className="anim-enter-d3 mb-16">
            <button
              onClick={onNavigate}
              className="btn-shine inline-flex items-center gap-2.5 bg-accent hover:bg-accent-hover text-white px-8 py-3.5 rounded-xl text-sm font-semibold shadow-lg shadow-accent-glow hover:shadow-xl hover:shadow-accent-glow transition-all duration-300 cursor-pointer active:scale-[0.98]"
            >
              Start Assessment
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>

          {/* Feature Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`glass glass-hover rounded-2xl p-6 text-left cursor-default anim-enter-d${i + 3}`}
              >
                <div className="w-12 h-12 rounded-xl glass-subtle flex items-center justify-center text-accent mb-4">
                  {f.icon}
                </div>
                <h3 className="text-sm font-semibold text-heading mb-1.5">{f.title}</h3>
                <p className="text-xs text-subtle leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-8 sm:gap-16 anim-enter-d5">
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold text-heading tabular-nums">{s.value}</p>
                <p className="text-[11px] text-faint uppercase tracking-wider mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-5 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-faint">
          <span>© 2026 CreditGuard. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <span className="hover:text-heading transition-colors cursor-default">Privacy</span>
            <span className="hover:text-heading transition-colors cursor-default">Terms</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
