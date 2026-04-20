import { useState, useRef } from 'react'
import HomePage from './components/HomePage'
import InputForm from './components/InputForm'
import ResultCard from './components/ResultCard'
import ShapChart from './components/ShapChart'
import Explanation from './components/Explanation'
import { predictRisk } from './services/api'

/*
  App — Two-page layout:
  1. HomePage  → landing with hero, glass tiles, CTA
  2. Assessment → glass form tile + glass results
*/
export default function App() {
  const [page, setPage] = useState('home')        // 'home' | 'assess'
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const resultRef = useRef(null)

  const handleSubmit = async (formData) => {
    setLoading(true)
    setResult(null)
    setError('')
    try {
      const data = await predictRisk(formData)
      setResult(data)
      // scroll to results after short delay for animation
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 200)
    } catch (err) {
      console.error('Prediction error:', err)
      const msg =
        err instanceof Error && err.message
          ? err.message
          : 'Unable to generate assessment. Please check your inputs and try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const goToAssess = () => {
    setPage('assess')
    setResult(null)
    setError('')
  }

  // ─── HOMEPAGE ───
  if (page === 'home') {
    return <HomePage onNavigate={goToAssess} />
  }

  // ─── ASSESSMENT PAGE ───
  return (
    <div className="page-bg flex flex-col min-h-screen">
      {/* Header */}
      <header className="glass-strong sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setPage('home')}
              className="flex items-center gap-1.5 text-xs text-subtle hover:text-heading transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back
            </button>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center">
                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-heading">CreditGuard</span>
            </div>
          </div>
          <p className="text-xs text-faint">Risk Assessment</p>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-[1400px] mx-auto w-full px-8 py-8">
        {/* Page title */}
        <div className="mb-6 anim-enter">
          <p className="text-[11px] font-semibold text-accent uppercase tracking-widest mb-1">New Assessment</p>
          <h1 className="text-2xl font-bold text-heading">Credit Risk Evaluation</h1>
        </div>

        {/* Two-column: Form tile + Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left — Form tile (half screen) */}
          <div>
            <InputForm onSubmit={handleSubmit} isLoading={loading} />
          </div>

          {/* Right — Results or placeholder */}
          <div className="space-y-6">
            {!result && !loading && !error && (
              <div className="glass rounded-2xl p-10 text-center anim-enter-d2 min-h-[400px] flex flex-col items-center justify-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl glass-subtle flex items-center justify-center">
                  <svg className="w-10 h-10 text-accent/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-heading mb-2">Ready for Assessment</h3>
                <p className="text-sm text-subtle max-w-md mx-auto leading-relaxed mb-8">
                  Fill in the borrower details and click "Run Assessment" to generate a comprehensive risk report.
                </p>

                {/* Feature tiles */}
                <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                  {[
                    { label: 'Risk Score', icon: '◎' },
                    { label: 'Factors', icon: '◫' },
                    { label: 'Summary', icon: '◧' },
                  ].map((t, i) => (
                    <div key={t.label} className={`glass-subtle glass-hover rounded-xl py-5 px-3 cursor-default anim-enter-d${i + 3}`}>
                      <div className="text-2xl text-accent/40 mb-2">{t.icon}</div>
                      <p className="text-xs font-medium text-subtle">{t.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error state */}
            {error && !loading && (
              <div className="glass rounded-2xl p-10 text-center anim-enter min-h-[400px] flex flex-col items-center justify-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-risk-bg border border-risk-border flex items-center justify-center">
                  <svg className="w-10 h-10 text-risk" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-heading mb-2">Assessment Failed</h3>
                <p className="text-sm text-subtle max-w-md mx-auto leading-relaxed mb-6">{error}</p>
                <button
                  onClick={() => setError('')}
                  className="text-sm font-medium text-accent hover:text-accent-hover transition-colors cursor-pointer"
                >
                  ← Try Again
                </button>
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div className="glass rounded-2xl p-16 min-h-[400px] flex flex-col items-center justify-center anim-fade">
                <div className="w-14 h-14 rounded-full border-3 border-accent/20 border-t-accent animate-spin mb-5" />
                <p className="text-base font-medium text-heading">Analyzing borrower data…</p>
                <p className="text-xs text-faint mt-1.5">Running credit risk evaluation</p>
              </div>
            )}

            {/* Results */}
            {result && !loading && (
              <div ref={resultRef} className="space-y-6">
                <div className="anim-enter">
                  <p className="text-[11px] font-semibold text-accent uppercase tracking-widest mb-1">Generated Report</p>
                  <h2 className="text-2xl font-bold text-heading">Risk Assessment Results</h2>
                </div>
                <ResultCard result={result} />
                <ShapChart shapValues={result.shapValues} />
                <Explanation text={result.explanation} prediction={result.prediction} />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-6 mt-auto">
        <div className="max-w-[1400px] mx-auto text-center text-xs text-faint">
          © 2026 CreditGuard. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
