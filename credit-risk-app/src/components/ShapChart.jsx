import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Cell, ResponsiveContainer, ReferenceLine,
} from 'recharts'

const ChartTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-white border border-border rounded-lg px-3.5 py-2.5 shadow-lg text-sm">
      <p className="font-medium text-heading mb-0.5">{d.feature}</p>
      <p className={d.impact === 'positive' ? 'text-safe' : 'text-risk'}>
        {d.value > 0 ? '+' : ''}{d.value.toFixed(4)}
      </p>
      <p className="text-faint text-xs mt-0.5">{d.impact === 'positive' ? 'Lowers risk' : 'Raises risk'}</p>
    </div>
  )
}

export default function ShapChart({ shapValues = [] }) {
  if (!shapValues.length) {
    return (
      <div className="glass-strong rounded-2xl p-8 anim-enter-d2">
        <p className="text-xs font-semibold text-subtle uppercase tracking-wider mb-2">Contributing Factors</p>
        <p className="text-sm text-faint">No SHAP values returned for this assessment.</p>
      </div>
    )
  }

  const data = shapValues.map((s) => ({
    feature: s.feature,
    value: parseFloat(Number(s.value).toFixed(4)),
    impact: s.impact,
  }))

  return (
    <div className="glass-strong rounded-2xl p-8 anim-enter-d2">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-semibold text-subtle uppercase tracking-wider">Contributing Factors</p>
          <p className="text-xs text-faint mt-1">SHAP values — impact of each factor on default risk</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-subtle">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-safe" />Lowers risk</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-risk" />Raises risk</span>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 24, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
            <XAxis type="number" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={{ stroke: '#E2E8F0' }} tickLine={{ stroke: '#E2E8F0' }} />
            <YAxis type="category" dataKey="feature" width={120} tick={{ fill: '#334155', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(59,130,246,0.04)' }} />
            <ReferenceLine x={0} stroke="#94A3B8" strokeWidth={1} />
            <Bar dataKey="value" radius={[0, 3, 3, 0]} barSize={18}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.impact === 'positive' ? '#16A34A' : '#DC2626'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
