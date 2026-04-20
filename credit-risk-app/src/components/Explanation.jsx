export default function Explanation({ text, prediction }) {
  const isDefault = prediction === 'Default'

  return (
    <div className="glass-strong rounded-2xl p-6 anim-enter-d3">
      <p className="text-[11px] font-semibold text-subtle uppercase tracking-wider mb-4">
        Assessment Summary
      </p>
      <div className={`rounded-lg p-4 border-l-[3px] ${isDefault ? 'bg-risk-bg border-risk' : 'bg-safe-bg border-safe'}`}>
        <p className="text-sm text-body leading-relaxed">{text}</p>
      </div>
    </div>
  )
}
