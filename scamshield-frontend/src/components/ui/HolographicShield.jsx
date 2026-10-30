import { motion } from 'framer-motion'

const THREATS = [
  { angle: 0,   label: 'Identity Theft',   delay: 0 },
  { angle: 72,  label: 'Advance Fee',      delay: 0.4 },
  { angle: 144, label: 'Phishing',         delay: 0.8 },
  { angle: 216, label: 'Fake Recruiter',   delay: 1.2 },
  { angle: 288, label: 'Data Harvesting',  delay: 1.6 },
]

function polarToXY(angle, radius) {
  const rad = ((angle - 90) * Math.PI) / 180
  return { x: Math.cos(rad) * radius, y: Math.sin(rad) * radius }
}

export default function HolographicShield({ className = '' }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer glow aura */}
      <div className="absolute w-[340px] h-[340px] rounded-full bg-cyan/5 blur-3xl" />
      <div className="absolute w-[240px] h-[240px] rounded-full bg-violet/8 blur-2xl" />

      {/* Scan rings */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute rounded-full border border-cyan/20"
          style={{
            width: 280 + i * 40,
            height: 280 + i * 40,
            animation: `scanRing 2.4s ease-out ${i * 0.8}s infinite`,
          }}
        />
      ))}

      {/* Main shield body */}
      <motion.div
        className="relative w-52 h-52 flex items-center justify-center"
        animate={{ rotateY: [0, 8, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{ perspective: 800 }}
      >
        {/* Hex grid background */}
        <div className="absolute inset-0 rounded-full hex-grid opacity-60" />

        {/* Shield SVG */}
        <svg viewBox="0 0 120 140" className="w-40 h-40 drop-shadow-[0_0_40px_rgba(0,229,255,0.5)]">
          <defs>
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#6C63FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="shieldFill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#6C63FF" stopOpacity="0.12" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {/* Shield fill */}
          <path
            d="M60 4 L108 24 L108 68 Q108 110 60 136 Q12 110 12 68 L12 24 Z"
            fill="url(#shieldFill)"
            stroke="url(#shieldGrad)"
            strokeWidth="1.5"
            filter="url(#glow)"
          />
          {/* Inner shield line */}
          <path
            d="M60 18 L96 34 L96 68 Q96 100 60 120 Q24 100 24 68 L24 34 Z"
            fill="none"
            stroke="url(#shieldGrad)"
            strokeWidth="0.6"
            opacity="0.5"
          />
          {/* Check mark */}
          <motion.path
            d="M40 70 L55 85 L80 55"
            fill="none"
            stroke="#00E5FF"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, delay: 0.5, ease: 'easeInOut' }}
            filter="url(#glow)"
          />
        </svg>

        {/* Rotating inner ring */}
        <motion.div
          className="absolute inset-0 rounded-full border border-cyan/30 border-dashed"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-4 rounded-full border border-violet/20 border-dashed"
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>

      {/* Floating threat category badges */}
      {THREATS.map((t) => {
        const pos = polarToXY(t.angle, 148)
        return (
          <motion.div
            key={t.label}
            className="absolute flex items-center gap-1.5 px-2.5 py-1 rounded-full glass border border-white/10 text-[10px] font-mono text-cyan/80 whitespace-nowrap"
            style={{ left: `calc(50% + ${pos.x}px)`, top: `calc(50% + ${pos.y}px)`, transform: 'translate(-50%, -50%)' }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1, 0.95] }}
            transition={{ duration: 3, delay: t.delay, repeat: Infinity }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-danger animate-threat-pulse flex-shrink-0" />
            {t.label}
          </motion.div>
        )
      })}

      {/* Central "AI scanning" label */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs font-mono text-cyan/60 tracking-widest uppercase"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        Scanning…
      </motion.div>
    </div>
  )
}
