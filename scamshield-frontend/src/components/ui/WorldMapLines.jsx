import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

// Simplified dot-matrix world map continents (normalized 0-1 x,y coords)
// Each entry: [cx, cy] on a 800x400 equirectangular projection
const CONTINENT_DOTS = [
  // North America
  [0.13,0.28],[0.16,0.25],[0.19,0.22],[0.22,0.22],[0.24,0.24],[0.21,0.27],[0.18,0.3],[0.15,0.33],[0.19,0.35],[0.22,0.32],[0.25,0.3],[0.23,0.35],[0.2,0.38],[0.17,0.4],[0.2,0.42],
  // South America
  [0.27,0.48],[0.29,0.5],[0.31,0.52],[0.3,0.56],[0.28,0.6],[0.26,0.64],[0.28,0.68],[0.3,0.72],[0.32,0.68],[0.34,0.64],[0.33,0.58],[0.32,0.54],[0.31,0.5],
  // Europe
  [0.46,0.22],[0.48,0.2],[0.5,0.18],[0.52,0.2],[0.54,0.22],[0.51,0.24],[0.49,0.26],[0.47,0.28],[0.5,0.28],[0.52,0.26],[0.54,0.24],[0.56,0.22],[0.53,0.28],
  // Africa
  [0.48,0.35],[0.5,0.33],[0.52,0.35],[0.5,0.38],[0.48,0.41],[0.5,0.44],[0.52,0.47],[0.5,0.5],[0.48,0.53],[0.5,0.56],[0.52,0.53],[0.54,0.5],[0.53,0.46],[0.51,0.42],
  // Asia
  [0.58,0.2],[0.61,0.18],[0.64,0.2],[0.67,0.22],[0.7,0.24],[0.68,0.28],[0.65,0.3],[0.63,0.27],[0.6,0.25],[0.63,0.32],[0.66,0.34],[0.69,0.32],[0.72,0.3],[0.74,0.28],[0.71,0.26],[0.68,0.35],[0.65,0.38],[0.62,0.36],
  // Australia
  [0.75,0.56],[0.77,0.54],[0.79,0.56],[0.81,0.58],[0.79,0.6],[0.77,0.62],[0.75,0.6],[0.78,0.58],
]

// Animated threat lines: from → to (coords 0-1)
const THREAT_LINES = [
  { from: [0.2, 0.3],  to: [0.5, 0.24], color: '#F43F5E', delay: 0 },
  { from: [0.65,0.25], to: [0.5, 0.24], color: '#F43F5E', delay: 0.8 },
  { from: [0.3, 0.55], to: [0.18, 0.3], color: '#FBBF24', delay: 1.6 },
  { from: [0.77,0.57], to: [0.65, 0.3], color: '#F43F5E', delay: 2.2 },
  { from: [0.5, 0.44], to: [0.5, 0.24], color: '#FBBF24', delay: 0.4 },
  { from: [0.68,0.3],  to: [0.25, 0.3], color: '#F43F5E', delay: 1.2 },
]

function lerp(a, b, t) { return a + (b - a) * t }

export default function WorldMapLines({ className = '' }) {
  const svgRef = useRef(null)
  const W = 800
  const H = 400

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-full opacity-60"
        style={{ filter: 'drop-shadow(0 0 8px rgba(0,229,255,0.15))' }}
      >
        {/* Continent dots */}
        {CONTINENT_DOTS.map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx * W}
            cy={cy * H}
            r="2.5"
            fill="rgba(0,229,255,0.25)"
          />
        ))}

        {/* Animated threat lines */}
        {THREAT_LINES.map((line, i) => {
          const x1 = line.from[0] * W
          const y1 = line.from[1] * H
          const x2 = line.to[0] * W
          const y2 = line.to[1] * H
          // Arc control point (midpoint lifted up)
          const mx = (x1 + x2) / 2
          const my = (y1 + y2) / 2 - 40
          const pathD = `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`

          return (
            <motion.path
              key={i}
              d={pathD}
              fill="none"
              stroke={line.color}
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity={0.6}
              strokeDasharray="1000"
              initial={{ strokeDashoffset: 1000, opacity: 0 }}
              animate={{
                strokeDashoffset: [1000, 0, 0, 1000],
                opacity: [0, 0.8, 0.8, 0],
              }}
              transition={{
                duration: 3.5,
                delay: line.delay,
                repeat: Infinity,
                ease: 'easeInOut',
                times: [0, 0.3, 0.7, 1],
              }}
            />
          )
        })}

        {/* Attack origin dots — pulsing */}
        {THREAT_LINES.map((line, i) => (
          <motion.circle
            key={`dot-${i}`}
            cx={line.from[0] * W}
            cy={line.from[1] * H}
            r="4"
            fill={line.color}
            initial={{ r: 3, opacity: 0.4 }}
            animate={{ r: [3, 7, 3], opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 2,
              delay: line.delay + 0.2,
              repeat: Infinity,
            }}
          />
        ))}
      </svg>
    </div>
  )
}
