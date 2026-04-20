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

  const sw = 16
  const r  = (size - sw) / 2
  const cx = size / 2
  const cy = size / 2 + 10

  // Semicircle: starts at left (180°), ends at right (0°) in standard math coords
  // SVG y-axis is flipped, so we compute manually
  const leftX  = cx - r
  const leftY  = cy
  const rightX = cx + r
  const rightY = cy

  // Background: full half-circle left → right, clockwise (sweep=1)
  const bgPath = `M ${leftX} ${leftY} A ${r} ${r} 0 0 1 ${rightX} ${rightY}`

  // Fill arc: sweep clockwise from left, stop at animatedValue * 180°
  // angleDeg=0 → left end, angleDeg=180 → right end
  const deg = animatedValue * 180
  const rad = (deg * Math.PI) / 180
  // Point on semicircle at `deg` degrees from left
  const fx = cx + r * Math.cos(Math.PI - rad)
  const fy = cy - r * Math.sin(Math.PI - rad)

  // largeArc=1 when more than half the semicircle is filled (>90°)
  const largeArc = deg > 90 ? 1 : 0
  const fillPath = animatedValue > 0.005
    ? `M ${leftX} ${leftY} A ${r} ${r} 0 ${largeArc} 1 ${fx} ${fy}`
    : ''

  const color = getColor(animatedValue)
  const pct   = (animatedValue * 100).toFixed(1)

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size / 2 + 30} viewBox={`0 0 ${size} ${size / 2 + 30}`}>
        <path d={bgPath} fill="none" stroke="#E2E8F0" strokeWidth={sw} strokeLinecap="round" />
        {fillPath && (
          <path
            d={fillPath}
            fill="none"
            stroke={color}
            strokeWidth={sw}
            strokeLinecap="round"
            style={{ transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        )}
        <text x={cx} y={cy - 8} textAnchor="middle"
          style={{ fontSize: '32px', fontWeight: 700, fill: color, fontFamily: 'Inter, sans-serif' }}>
          {pct}%
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle"
          style={{ fontSize: '11px', fontWeight: 500, fill: '#64748B', fontFamily: 'Inter, sans-serif', letterSpacing: '0.05em' }}>
          DEFAULT RISK
        </text>
      </svg>
      <div className="flex justify-between w-full px-4 -mt-1 text-[10px] text-faint">
        <span>0%</span><span>50%</span><span>100%</span>
      </div>
    </div>
  )
}
