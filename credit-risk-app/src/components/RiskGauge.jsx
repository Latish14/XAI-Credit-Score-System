import { useEffect, useState } from 'react'

/*
  RiskGauge — SVG semi-circular gauge for the light right panel.
*/
function getColor(p) {
  if (p < 0.25) return '#16A34A'
  if (p < 0.5)  return '#22C55E'
  if (p < 0.65) return '#D97706'
  if (p < 0.8)  return '#DC2626'
  return '#B91C1C'
}

export default function RiskGauge({ probability, size = 200 }) {
  const [animatedValue, setAnimatedValue] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(probability), 100)
    return () => clearTimeout(timer)
  }, [probability])

  const strokeWidth = 16
  const radius = (size - strokeWidth) / 2
  const cx = size / 2
  const cy = size / 2 + 10

  const toRad = (deg) => (deg * Math.PI) / 180
  const x1 = cx + radius * Math.cos(toRad(180))
  const y1 = cy - radius * Math.sin(toRad(180))
  const x2 = cx + radius * Math.cos(toRad(0))
  const y2 = cy - radius * Math.sin(toRad(0))
  const bgPath = `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`

  const fillAngle = 180 - (animatedValue * 180)
  const fx = cx + radius * Math.cos(toRad(fillAngle))
  const fy = cy - radius * Math.sin(toRad(fillAngle))
  const largeArc = animatedValue > 0.5 ? 1 : 0
  const fillPath = animatedValue > 0.01
    ? `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${fx} ${fy}`
    : ''

  const color = getColor(animatedValue)
  const pct = (animatedValue * 100).toFixed(1)

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size / 2 + 30} viewBox={`0 0 ${size} ${size / 2 + 30}`}>
        <path d={bgPath} fill="none" stroke="#E2E8F0" strokeWidth={strokeWidth} strokeLinecap="round" />
        {fillPath && (
          <path d={fillPath} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
            style={{ transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }} />
        )}
        <text x={cx} y={cy - 8} textAnchor="middle"
          style={{ fontSize: '32px', fontWeight: 700, fill: color, fontFamily: 'Inter, sans-serif' }}>
          {pct}%
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle"
          style={{ fontSize: '11px', fontWeight: 500, fill: '#64748B', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Default Risk
        </text>
      </svg>
      <div className="flex justify-between w-full px-4 -mt-1 text-[10px] text-faint">
        <span>0%</span><span>50%</span><span>100%</span>
      </div>
    </div>
  )
}
