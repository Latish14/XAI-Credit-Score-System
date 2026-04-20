import { useEffect, useState } from 'react'

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

  // Helper: angle in degrees → SVG point on the arc
  // 0° = left end, 180° = right end (left-to-right sweep)
  const toPoint = (angleDeg) => {
    const rad = (Math.PI / 180) * angleDeg
    return {
      x: cx + radius * Math.cos(Math.PI - rad),   // mirror so 0°=left
      y: cy - radius * Math.sin(Math.PI - rad),
    }
  }

  // Background arc: full 180° from left to right
  const start = toPoint(0)
  const end   = toPoint(180)
  const bgPath = `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${end.x} ${end.y}`

  // Fill arc: 0 → animatedValue (left → right)
  const fillDeg  = animatedValue * 180
  const fillEnd  = toPoint(fillDeg)
  const largeArc = fillDeg > 180 ? 1 : 0
  const fillPath = animatedValue > 0.01
  ? `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 0 ${fillEnd.x} ${fillEnd.y}`
  : ''

  const color = getColor(animatedValue)
  const pct   = (animatedValue * 100).toFixed(1)

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size / 2 + 30} viewBox={`0 0 ${size} ${size / 2 + 30}`}>
        {/* Background track */}
        <path
          d={bgPath}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Filled arc */}
        {fillPath && (
          <path
            d={fillPath}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{ transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        )}
        {/* Percentage label */}
        <text
          x={cx} y={cy - 8}
          textAnchor="middle"
          style={{ fontSize: '32px', fontWeight: 700, fill: color, fontFamily: 'Inter, sans-serif' }}
        >
          {pct}%
        </text>
        {/* Sub-label */}
        <text
          x={cx} y={cy + 14}
          textAnchor="middle"
          style={{ fontSize: '11px', fontWeight: 500, fill: '#64748B', fontFamily: 'Inter, sans-serif', letterSpacing: '0.05em' }}
        >
          DEFAULT RISK
        </text>
      </svg>

      {/* Tick labels */}
      <div className="flex justify-between w-full px-4 -mt-1 text-[10px] text-faint">
        <span>0%</span><span>50%</span><span>100%</span>
      </div>
    </div>
  )
}
