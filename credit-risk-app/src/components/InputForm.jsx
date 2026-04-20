import { useState } from 'react'

/*
  InputForm — Glass tile card version.
  Styled for the light page background with glassmorphism effects.
*/

const FIELDS = [
  {
    key: 'loanAmount',
    label: 'Loan Amount',
    unit: 'USD',
    placeholder: '25,000',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
  },
  {
  key: 'intRate',
  label: 'Interest Rate',
  unit: '%',
  placeholder: '13.5',
  icon: (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="5" x2="5" y2="19" />
      <circle cx="6.5" cy="6.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  ),
},
  {
    key: 'annualIncome',
    label: 'Annual Income',
    unit: 'USD',
    placeholder: '75,000',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" />
      </svg>
    ),
  },
  {
    key: 'dti',
    label: 'Debt-to-Income',
    unit: '%',
    placeholder: '18.5',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="5" x2="5" y2="19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" />
      </svg>
    ),
  },
  {
    key: 'ficoScore',
    label: 'FICO Score',
    unit: '',
    placeholder: '720',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    key: 'empLength',
    label: 'Employment',
    unit: 'yrs',
    placeholder: '5',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
      </svg>
    ),
  },
  {
    key: 'creditHistory',
    label: 'Credit History',
    unit: 'yrs',
    placeholder: '10',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
]

const SAMPLE_DATA = {
  loanAmount: '25000',
  annualIncome: '85000',
  dti: '18.5',
  ficoScore: '720',
  empLength: '6',
  creditHistory: '12',
  intRate: '13.5',
}

export default function InputForm({ onSubmit, isLoading }) {
  const [form, setForm] = useState({
    loanAmount: '', annualIncome: '', dti: '',
    ficoScore: '', empLength: '', creditHistory: '',intRate: '',
  })
  const [error, setError] = useState('')

  const update = (key, val) => {
    setError('')
    setForm(prev => ({ ...prev, [key]: val }))
  }

  const loadSample = () => {
    setError('')
    setForm(SAMPLE_DATA)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    for (const f of FIELDS) {
      if (!form[f.key]) {
        setError(`Please fill in ${f.label}`)
        return
      }
    }
    setError('')
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="glass-strong rounded-2xl p-8 anim-enter-d1">
      {/* Title bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-heading">Borrower Details</h2>
          <p className="text-xs text-faint mt-1">Enter the applicant information below</p>
        </div>
        <button
          type="button"
          onClick={loadSample}
          className="text-xs text-accent hover:text-accent-hover font-medium transition-colors cursor-pointer"
        >
          Load sample data
        </button>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-2 gap-x-5 gap-y-5">
        {FIELDS.map(f => (
          <div key={f.key}>
            <label className="flex items-center gap-1.5 text-xs font-medium text-subtle mb-1.5">
              <span className="text-accent/60">{f.icon}</span>
              {f.label}
            </label>
            <div className="relative">
              <input
                type="number"
                step="any"
                placeholder={f.placeholder}
                value={form[f.key]}
                onChange={e => update(f.key, e.target.value)}
                className="
                  w-full glass-subtle rounded-xl px-4 py-3 text-sm text-heading
                  placeholder:text-placeholder
                  focus:outline-none focus:ring-2 focus:ring-accent/30 focus:bg-white/60
                  transition-all duration-200
                "
              />
              {f.unit && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-faint uppercase tracking-wider pointer-events-none">
                  {f.unit}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="mt-3 text-xs text-risk flex items-center gap-1.5 anim-enter">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="
          btn-shine mt-6 w-full py-3.5 rounded-xl text-sm font-semibold
          bg-accent hover:bg-accent-hover text-white
          shadow-md shadow-accent-glow hover:shadow-lg hover:shadow-accent-glow
          transition-all duration-300 cursor-pointer
          disabled:opacity-60 disabled:cursor-not-allowed
          active:scale-[0.98]
        "
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4 31.4" strokeLinecap="round" />
            </svg>
            Analyzing…
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            Run Assessment
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        )}
      </button>
    </form>
  )
}
