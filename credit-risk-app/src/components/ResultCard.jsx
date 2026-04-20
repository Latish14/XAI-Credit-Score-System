import RiskGauge from './RiskGauge'

/*
  ResultCard — report hero for the right panel (light background).
  White card with subtle shadow, gauge, verdict, and metric tiles.
*/
export default function ResultCard({ result }) {
  const { prediction, probability } = result
  const isDefault = prediction === 'Default'
  const pct = (probability * 100).toFixed(1)

  const level =
    probability < 0.2  ? { label: 'Low Risk',       color: 'text-safe',  tagBg: 'bg-safe-bg',  tagBorder: 'border-safe-border' }
  : probability < 0.4  ? { label: 'Moderate',       color: 'text-safe',  tagBg: 'bg-safe-bg',  tagBorder: 'border-safe-border' }
  : probability < 0.6  ? { label: 'Elevated',       color: 'text-warn',  tagBg: 'bg-warn-bg',  tagBorder: 'border-warn/20' }
  : probability < 0.8  ? { label: 'High Risk',      color: 'text-risk',  tagBg: 'bg-risk-bg',  tagBorder: 'border-risk-border' }
  :                       { label: 'Very High Risk', color: 'text-risk',  tagBg: 'bg-risk-bg',  tagBorder: 'border-risk-border' }

  return (
    <div className="glass-strong rounded-2xl anim-enter-d1 overflow-hidden">
      {/* Header bar */}
      <div className="px-6 py-3 border-b border-white/20 flex items-center justify-between">
        <p className="text-[11px] font-semibold text-subtle uppercase tracking-wider">Risk Report</p>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${level.tagBg} ${level.tagBorder} ${level.color}`}>
          {level.label}
        </span>
      </div>

      <div className="p-8">
        <div className="flex flex-col sm:flex-row items-center gap-10">
          <div className="flex-shrink-0">
            <RiskGauge probability={probability} size={210} />
          </div>

          <div className="flex-1 text-center sm:text-left space-y-6">
            {/* Verdict */}
            <div>
              <p className="text-sm text-subtle mb-1">Assessment Verdict</p>
              <div className="flex items-center justify-center sm:justify-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDefault ? 'bg-risk-bg border border-risk-border' : 'bg-safe-bg border border-safe-border'}`}>
                  {isDefault ? (
                    <svg className="w-5 h-5 text-risk" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-safe" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  )}
                </div>
                <p className={`text-3xl font-bold ${isDefault ? 'text-risk' : 'text-safe'}`}>{prediction}</p>
              </div>
            </div>

            {/* Metric tiles */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Probability', value: `${pct}%`, cls: level.color },
                { label: 'Confidence', value: 'High', cls: 'text-heading' },
              ].map(m => (
                <div key={m.label} className="glass-subtle rounded-xl p-4 text-center">
                  <p className="text-[11px] text-faint uppercase tracking-wider mb-1">{m.label}</p>
                  <p className={`text-xl font-bold tabular-nums ${m.cls}`}>{m.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
