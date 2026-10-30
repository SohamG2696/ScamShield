import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

// World map connection points (approximate lat/lng → screen %)
const NODES = [
  { id: 'ny',     x: 22, y: 38, label: 'New York' },
  { id: 'london', x: 47, y: 28, label: 'London' },
  { id: 'berlin', x: 51, y: 26, label: 'Berlin' },
  { id: 'dubai',  x: 59, y: 40, label: 'Dubai' },
  { id: 'mumbai', x: 63, y: 44, label: 'Mumbai' },
  { id: 'sg',     x: 73, y: 52, label: 'Singapore' },
  { id: 'tokyo',  x: 82, y: 33, label: 'Tokyo' },
  { id: 'lagos',  x: 48, y: 52, label: 'Lagos' },
  { id: 'sydney', x: 83, y: 70, label: 'Sydney' },
  { id: 'sao',    x: 30, y: 62, label: 'São Paulo' },
]

const CONNECTIONS = [
  ['ny', 'london'], ['london', 'berlin'], ['berlin', 'dubai'],
  ['dubai', 'mumbai'], ['mumbai', 'sg'], ['sg', 'tokyo'],
  ['london', 'lagos'], ['sao', 'ny'], ['sg', 'sydney'],
  ['ny', 'sao'], ['mumbai', 'dubai'], ['tokyo', 'sg'],
]

const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 1,
  delay: Math.random() * 8,
  duration: Math.random() * 6 + 6,
}))

const BINARY_CHARS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  char: Math.random() > 0.5 ? '1' : '0',
  delay: Math.random() * 6,
  duration: Math.random() * 8 + 8,
}))

export default function AuroraBackground() {
  const spotlightRef = useRef(null)

  useEffect(() => {
    const onMove = (e) => {
      document.documentElement.style.setProperty('--spotlight-x', `${e.clientX}px`)
      document.documentElement.style.setProperty('--spotlight-y', `${e.clientY}px`)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>

      {/* ── Layer 1: Deep space base ── */}
      <div className="absolute inset-0 transition-colors duration-500"
        style={{ backgroundColor: 'var(--bg-base)' }}
      />

      {/* ── Layer 2: Aurora gradient (animated) ── */}
      <div className="absolute inset-0 aurora-bg" />

      {/* ── Layer 3: Secondary aurora blobs (subtle glowing atmosphere) ── */}
      <motion.div
        className="absolute w-[900px] h-[700px] rounded-full blur-3xl opacity-[0.14]"
        style={{
          background: 'radial-gradient(ellipse, #00F5D4, transparent 70%)',
          left: '-10%', top: '-10%',
        }}
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[800px] h-[600px] rounded-full blur-3xl opacity-[0.14]"
        style={{
          background: 'radial-gradient(ellipse, #8B5CF6, transparent 70%)',
          right: '-5%', top: '10%',
        }}
        animate={{ x: [0, -40, 0], y: [0, 60, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      <motion.div
        className="absolute w-[700px] h-[500px] rounded-full blur-3xl opacity-[0.12]"
        style={{
          background: 'radial-gradient(ellipse, #34D399, transparent 70%)',
          left: '30%', bottom: '0%',
        }}
        animate={{ x: [0, 30, -20, 0], y: [0, -30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
      />

      {/* ── Layer 4: Cyber Grid ── */}
      <div
        className="absolute inset-0 cyber-grid opacity-70"
        style={{ backgroundSize: '55px 55px' }}
      />

      {/* ── Layer 5: World Map Outline (SVG, 10% opacity) ── */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.07]">
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-auto"
          style={{ maxWidth: '1200px' }}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Simplified world continent outlines */}
          {/* North America */}
          <path d="M 180 80 L 220 70 L 240 90 L 260 85 L 280 100 L 270 130 L 240 150 L 220 180 L 200 200 L 180 220 L 170 200 L 160 170 L 150 140 L 160 110 Z"
            stroke="#22D3EE" strokeWidth="0.8" fill="none" />
          {/* South America */}
          <path d="M 220 230 L 250 220 L 270 240 L 280 280 L 270 330 L 250 370 L 230 360 L 215 320 L 210 280 L 215 250 Z"
            stroke="#22D3EE" strokeWidth="0.8" fill="none" />
          {/* Europe */}
          <path d="M 450 60 L 490 55 L 510 70 L 520 85 L 500 100 L 480 110 L 460 105 L 445 90 L 440 75 Z"
            stroke="#22D3EE" strokeWidth="0.8" fill="none" />
          {/* Africa */}
          <path d="M 460 120 L 500 115 L 530 130 L 540 160 L 545 210 L 530 260 L 510 300 L 490 310 L 470 290 L 455 250 L 450 200 L 445 160 L 450 130 Z"
            stroke="#22D3EE" strokeWidth="0.8" fill="none" />
          {/* Asia */}
          <path d="M 530 60 L 600 50 L 680 60 L 740 80 L 780 100 L 790 130 L 760 150 L 720 160 L 680 155 L 640 140 L 600 130 L 570 115 L 545 100 L 535 80 Z"
            stroke="#22D3EE" strokeWidth="0.8" fill="none" />
          {/* Australia */}
          <path d="M 750 300 L 810 290 L 850 310 L 860 350 L 840 380 L 800 390 L 760 375 L 740 340 L 740 310 Z"
            stroke="#22D3EE" strokeWidth="0.8" fill="none" />
        </svg>
      </div>

      {/* ── Layer 6: SVG Connection Lines between cities ── */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter id="lineGlow">
            <feGaussianBlur stdDeviation="0.3" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        {CONNECTIONS.map(([fromId, toId], i) => {
          const from = NODES.find(n => n.id === fromId)
          const to = NODES.find(n => n.id === toId)
          const mx = (from.x + to.x) / 2
          const my = Math.min(from.y, to.y) - 8
          return (
            <motion.path
              key={`${fromId}-${toId}`}
              d={`M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`}
              stroke="rgba(34,211,238,0.35)"
              strokeWidth="0.15"
              fill="none"
              filter="url(#lineGlow)"
              strokeDasharray="4 2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.6, 0.6, 0] }}
              transition={{
                duration: 3.5,
                delay: i * 0.7,
                repeat: Infinity,
                repeatDelay: CONNECTIONS.length * 0.7 - 3.5,
                ease: 'easeInOut',
              }}
            />
          )
        })}

        {/* Nodes (city dots) */}
        {NODES.map((node, i) => (
          <motion.circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r="0.4"
            fill="#22D3EE"
            animate={{ opacity: [0.3, 1, 0.3], r: [0.3, 0.5, 0.3] }}
            transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
          />
        ))}
      </svg>

      {/* ── Layer 7: Floating blue particles ── */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: `rgba(34, 211, 238, ${0.3 + Math.random() * 0.4})`,
            boxShadow: `0 0 ${p.size * 3}px rgba(34, 211, 238, 0.5)`,
          }}
          animate={{
            y: [0, -80, -160],
            x: [0, Math.random() * 30 - 15],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* ── Layer 8: Binary code drifting up ── */}
      {BINARY_CHARS.map((b) => (
        <motion.span
          key={b.id}
          className="binary-char"
          style={{ left: `${b.x}%`, bottom: '-5%' }}
          animate={{ y: [0, '-110vh'], opacity: [0, 0.4, 0] }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {b.char}
        </motion.span>
      ))}

      {/* ── Mouse spotlight ── */}
      <div className="mouse-spotlight" ref={spotlightRef} />

      {/* ── Bottom dark gradient overlay ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, #050811 0%, transparent 100%)',
        }}
      />

      {/* ── Left dark gradient overlay ── */}
      <div
        className="absolute top-0 bottom-0 left-0 w-48 pointer-events-none"
        style={{
          background: 'linear-gradient(to right, #050811 0%, transparent 100%)',
        }}
      />
      {/* ── Right dark gradient overlay ── */}
      <div
        className="absolute top-0 bottom-0 right-0 w-48 pointer-events-none"
        style={{
          background: 'linear-gradient(to left, #050811 0%, transparent 100%)',
        }}
      />
    </div>
  )
}
