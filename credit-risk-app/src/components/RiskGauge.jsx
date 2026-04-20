import { useEffect, useState } from 'react'

function getColor(p) {
  if (p < 0.25) return '#16A34A'
  if (p < 0.5)  return '#22C55E'
  if (p < 0.65) return '#D97706'
  if (p < 0.8)  return '#DC2626'
  return '#B91C1C'
}

export default function RiskGauge({ probability, size = 210 }) {
  const [animatedValue, setAnimatedValue] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(probability), 100)
    return () => clearTimeout(timer)
  }, [probability])

  const sw = 16
  const r  = (size - sw) / 2
  const cx = size / 2
  const cy = size / 2
  const totalLength = Math.PI * r
  const fillLength  = totalLength * animatedValue
  const dashOffset  = totalLength - fillLength
  const color       = getColor(animatedValue)
  const pct         = (animatedValue * 100).toFixed(1)
  const svgH        = size / 2 + 36
  const arcPath     = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`
  const rotateAttr  = `rotate(180, ${cx}, ${cy})`

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={svgH} viewBox={`0 0 ${size} ${svgH}`}>
        <path
          d={arcPath}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={sw}
          strokeLinecap="round"
        />
        <path
          d={arcPath}
          fill="none"
          stroke={color}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={totalLength}
          strokeDashoffset={dashOffset}
          transform={rotateAttr}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1), stroke 0.5s ease' }}
        />
        <text
          x={cx} y={cy - 10}
          textAnchor="middle"
          style={{ fontSize: '34px', fontWeight: 700, fill: color, fontFamily: 'Inter, sans-serif', transition: 'fill 0.5s ease' }}
        >
          {pct}%
        </text>
        <text
          x={cx} y={cy + 14}
          textAnchor="middle"
          style={{ fontSize: '11px', fontWeight: 500, fill: '#64748B', fontFamily: 'Inter, sans-serif', letterSpacing: '0.06em' }}
        >
          DEFAULT RISK
        </text>
      </svg>
      <div className="flex justify-between w-full px-4 -mt-2 text-[10px] text-faint">
        <span>0%</span><span>50%</span><span>100%</span>
      </div>
    </div>
  )
}
