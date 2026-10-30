import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─── Circuit node positions on the brain grid ─── */
const CIRCUIT_NODES = [
  // Top-left quadrant
  { id: 0,  x: 62,  y: 58  },
  { id: 1,  x: 95,  y: 42  },
  { id: 2,  x: 42,  y: 88  },
  { id: 3,  x: 78,  y: 90  },
  // Top-right quadrant
  { id: 4,  x: 138, y: 42  },
  { id: 5,  x: 158, y: 68  },
  { id: 6,  x: 122, y: 88  },
  // Bottom-left quadrant
  { id: 7,  x: 42,  y: 130 },
  { id: 8,  x: 72,  y: 148 },
  { id: 9,  x: 90,  y: 118 },
  // Bottom-right quadrant
  { id: 10, x: 148, y: 118 },
  { id: 11, x: 158, y: 148 },
  { id: 12, x: 118, y: 148 },
  // Center ring connectors
  { id: 13, x: 100, y: 52  },
  { id: 14, x: 52,  y: 110 },
  { id: 15, x: 148, y: 110 },
  { id: 16, x: 100, y: 162 },
]

/* ─── Circuit traces (orthogonal L-shaped paths) ─── */
const TRACES = [
  // Horizontal + vertical runs
  'M 62 58 L 95 58 L 95 42',
  'M 95 42 L 138 42 L 138 68 L 158 68',
  'M 62 58 L 62 88 L 78 88',
  'M 42 88 L 62 88',
  'M 42 88 L 42 130',
  'M 42 130 L 72 130 L 72 148',
  'M 78 88 L 78 118 L 90 118',
  'M 100 52 L 100 78',       // top to center
  'M 52 110 L 78 110',       // left to center
  'M 122 110 L 148 110',     // right to center
  'M 100 122 L 100 162',     // center to bottom
  'M 122 88 L 122 118',
  'M 138 68 L 138 110 L 148 110',
  'M 158 68 L 158 148 L 118 148',
  'M 118 148 L 100 148 L 100 162',
  'M 72 148 L 100 148',
  'M 90 118 L 100 118 L 100 122',
]

/* ─── Scan status messages cycling ─── */
const STATUS_MSGS = [
  '◆ SCANNING JOB POSTING...',
  '◆ EXTRACTING FEATURES...',
  '◆ RUNNING INFERENCE...',
  '◆ ANALYZING PATTERNS...',
  '◆ AI MODEL ACTIVE',
]

/* ─── Pulse dot that travels along a trace path ─── */
function TracePulse({ path, delay, color = '#22D3EE' }) {
  return (
    <motion.circle r="2.2" fill={color} opacity={0}>
      <animateMotion
        dur="2.2s"
        begin={`${delay}s`}
        repeatCount="indefinite"
        path={path}
      />
      <animate
        attributeName="opacity"
        values="0;1;1;0"
        dur="2.2s"
        begin={`${delay}s`}
        repeatCount="indefinite"
      />
    </motion.circle>
  )
}

export default function AIScanAnimation({ className = '' }) {
  const [msgIdx, setMsgIdx] = useState(0)
  const [scanLine, setScanLine] = useState(0)

  // Cycle status messages
  useEffect(() => {
    const t = setInterval(() => setMsgIdx(i => (i + 1) % STATUS_MSGS.length), 2200)
    return () => clearInterval(t)
  }, [])

  // Animate vertical scan line
  useEffect(() => {
    let frame
    let start = null
    const animate = (ts) => {
      if (!start) start = ts
      const progress = ((ts - start) % 2400) / 2400
      setScanLine(Math.round(progress * 200))
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* ── Outer glow halo ── */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(34,211,238,0.07) 0%, transparent 70%)',
        }}
      />

      {/* ── Main SVG canvas ── */}
      <svg
        viewBox="0 0 200 210"
        className="w-full max-w-[200px] drop-shadow-[0_0_24px_rgba(34,211,238,0.25)]"
        style={{ filter: 'drop-shadow(0 0 16px rgba(34,211,238,0.18))' }}
      >
        <defs>
          {/* Circuit glow filter */}
          <filter id="glow-trace" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Shield glow filter */}
          <filter id="shield-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Scan line gradient */}
          <linearGradient id="scanGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(34,211,238,0)" />
            <stop offset="50%" stopColor="rgba(34,211,238,0.35)" />
            <stop offset="100%" stopColor="rgba(34,211,238,0)" />
          </linearGradient>

          {/* Radial center gradient */}
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(34,211,238,0.18)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* Background chip gradient */}
          <linearGradient id="chipBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0d1520" />
            <stop offset="100%" stopColor="#060c14" />
          </linearGradient>
        </defs>

        {/* ── Chip background ── */}
        <rect x="20" y="20" width="160" height="160" rx="20" fill="url(#chipBg)" />
        <rect x="20" y="20" width="160" height="160" rx="20"
          fill="none" stroke="rgba(34,211,238,0.18)" strokeWidth="1" />

        {/* ── Corner notches (IC chip style) ── */}
        {[
          [20,35, 20,20, 35,20],
          [165,20, 180,20, 180,35],
          [180,165, 180,180, 165,180],
          [35,180, 20,180, 20,165],
        ].map(([x1,y1,x2,y2,x3,y3], i) => (
          <polyline key={i}
            points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`}
            fill="none" stroke="rgba(34,211,238,0.5)" strokeWidth="1.5"
            strokeLinecap="round"
          />
        ))}

        {/* ── IC pins (left & right sides) ── */}
        {[50, 75, 100, 125, 150].map((y, i) => (
          <g key={`pins-${i}`}>
            <line x1="8" y1={y} x2="20" y2={y}
              stroke="rgba(34,211,238,0.4)" strokeWidth="1.5" />
            <line x1="180" y1={y} x2="192" y2={y}
              stroke="rgba(34,211,238,0.4)" strokeWidth="1.5" />
            <circle cx="8"   cy={y} r="2" fill="rgba(34,211,238,0.5)" />
            <circle cx="192" cy={y} r="2" fill="rgba(34,211,238,0.5)" />
          </g>
        ))}
        {/* Top & bottom pins */}
        {[60, 100, 140].map((x, i) => (
          <g key={`tpins-${i}`}>
            <line x1={x} y1="8"  x2={x} y2="20"
              stroke="rgba(34,211,238,0.4)" strokeWidth="1.5" />
            <line x1={x} y1="180" x2={x} y2="192"
              stroke="rgba(34,211,238,0.4)" strokeWidth="1.5" />
            <circle cx={x} cy="8"   r="2" fill="rgba(34,211,238,0.5)" />
            <circle cx={x} cy="192" r="2" fill="rgba(34,211,238,0.5)" />
          </g>
        ))}

        {/* ── Circuit traces ── */}
        <g filter="url(#glow-trace)">
          {TRACES.map((d, i) => (
            <motion.path
              key={i} d={d}
              fill="none"
              stroke="rgba(34,211,238,0.22)"
              strokeWidth="1"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: i * 0.06, ease: 'easeOut' }}
            />
          ))}
        </g>

        {/* ── Circuit node dots ── */}
        {CIRCUIT_NODES.map((n) => (
          <motion.circle
            key={n.id}
            cx={n.x} cy={n.y} r="2.5"
            fill="rgba(34,211,238,0.9)"
            animate={{ opacity: [0.4, 1, 0.4], r: [2, 3, 2] }}
            transition={{
              duration: 2,
              delay: n.id * 0.13,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* ── Pulse dots travelling circuit traces ── */}
        {TRACES.filter((_, i) => i % 3 === 0).map((path, i) => (
          <TracePulse
            key={`pulse-${i}`}
            path={path}
            delay={i * 0.55}
            color={i % 2 === 0 ? '#22D3EE' : '#5ED29C'}
          />
        ))}

        {/* ── Center glow blob ── */}
        <circle cx="100" cy="100" r="36" fill="url(#centerGlow)" />

        {/* ── Scan rings (pulsing outward) ── */}
        {[1, 2, 3].map((k) => (
          <motion.circle
            key={`ring-${k}`}
            cx="100" cy="100"
            r={28 + k * 9}
            fill="none"
            stroke="rgba(34,211,238,0.4)"
            strokeWidth="0.8"
            initial={{ opacity: 0.6, scale: 1 }}
            animate={{ opacity: 0, scale: 1.6 }}
            transition={{
              duration: 2.2,
              delay: k * 0.55,
              repeat: Infinity,
              ease: 'easeOut',
            }}
            style={{ transformOrigin: '100px 100px' }}
          />
        ))}

        {/* ── Shield body ── */}
        <motion.g
          filter="url(#shield-glow)"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '100px 98px' }}
        >
          {/* Shield outer shape */}
          <path
            d="M100 74 L120 82 L120 100 Q120 114 100 122 Q80 114 80 100 L80 82 Z"
            fill="rgba(34,211,238,0.10)"
            stroke="rgba(34,211,238,0.85)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Shield inner highlight */}
          <path
            d="M100 79 L115 86 L115 100 Q115 111 100 118 Q85 111 85 100 L85 86 Z"
            fill="rgba(34,211,238,0.06)"
            stroke="rgba(34,211,238,0.3)"
            strokeWidth="0.8"
          />
          {/* Shield check mark */}
          <polyline
            points="91,99 97,106 110,92"
            fill="none"
            stroke="#22D3EE"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.g>

        {/* ── Horizontal scan sweep ── */}
        <rect
          x="20" y={20 + scanLine} width="160" height="6"
          fill="url(#scanGrad)"
          opacity={0.6}
        />

        {/* ── Small status indicator LEDs (bottom) ── */}
        <g transform="translate(100, 192)">
          {['#22D3EE', '#5ED29C', '#7C3AED'].map((c, i) => (
            <motion.circle
              key={i}
              cx={(i - 1) * 10} cy="0" r="2.5"
              fill={c}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 1.2,
                delay: i * 0.4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </g>
      </svg>

      {/* ── Live scanning status text ── */}
      <div className="mt-3 flex items-center gap-2">
        {/* Pulsing dot */}
        <motion.span
          className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0"
          animate={{ opacity: [1, 0.2, 1], scale: [1, 0.6, 1] }}
          transition={{ duration: 1.1, repeat: Infinity }}
        />
        <AnimatePresence mode="wait">
          <motion.span
            key={msgIdx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="text-[9px] font-mono text-cyan-400/70 tracking-widest select-none"
          >
            {STATUS_MSGS[msgIdx]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  )
}
