import { motion } from 'framer-motion'
import { Brain } from 'lucide-react'

const BADGES = [
  { icon: '✓', label: 'Gmail Security', color: '#5ED29C' },
  { icon: '✓', label: 'AI Analysis',    color: '#22D3EE' },
  { icon: '✓', label: 'PDF Scanner',    color: '#5ED29C' },
  { icon: '✓', label: 'Groq Intelligence', color: '#22D3EE' },
]

const FEATURES = [
  'Scan Emails',
  'Analyze PDFs',
  'Detect Fake Jobs',
  'Protect Your Identity',
]

export default function HeroGlassCard() {
  return (
    <motion.div
      className="relative"
      animate={{ y: [0, -16, 0], rotate: [-0.5, 0.5, -0.5] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      style={{ width: 220, height: 220 }}
    >
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-[28px] blur-2xl"
        style={{
          background: 'radial-gradient(ellipse, rgba(34,211,238,0.18) 0%, rgba(94,210,156,0.1) 50%, transparent 100%)',
          transform: 'scale(1.4)',
        }}
      />

      {/* Animated rotating border gradient */}
      <div
        className="absolute inset-0 rounded-[28px] overflow-hidden"
        style={{ padding: '1.5px' }}
      >
        <div className="neon-border absolute inset-0" />
      </div>

      {/* Card body */}
      <div
        className="relative w-full h-full rounded-[28px] flex flex-col items-center justify-center gap-2 overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(34,211,238,0.12)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        {/* Top label */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{
            background: 'rgba(34,211,238,0.08)',
            border: '1px solid rgba(34,211,238,0.2)',
          }}
        >
          <Brain size={11} style={{ color: '#22D3EE' }} />
          <span className="font-mono text-[10px] tracking-widest" style={{ color: '#22D3EE' }}>
            AI SECURITY
          </span>
        </div>

        {/* Title */}
        <div className="text-center px-3">
          <p className="text-white text-sm font-semibold leading-snug">
            Real-Time{' '}
            <em
              className="not-italic"
              style={{
                fontFamily: '"Instrument Serif", serif',
                fontStyle: 'italic',
                color: '#5ED29C',
              }}
            >
              Scam Detection
            </em>
          </p>
        </div>

        {/* Feature list */}
        <div className="flex flex-col gap-0.5 w-full px-4 mt-1">
          {FEATURES.map((feat) => (
            <div key={feat} className="flex items-center gap-1.5">
              <span style={{ color: '#5ED29C', fontSize: 8 }}>▸</span>
              <span className="text-[10px] text-slate-400 font-medium">{feat}</span>
            </div>
          ))}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1 justify-center px-3 mt-1">
          {BADGES.map((b) => (
            <span
              key={b.label}
              className="text-[9px] font-mono px-1.5 py-0.5 rounded"
              style={{
                background: `${b.color}12`,
                border: `1px solid ${b.color}30`,
                color: b.color,
              }}
            >
              {b.icon} {b.label}
            </span>
          ))}
        </div>

        {/* Inner glow pulse */}
        <motion.div
          className="absolute inset-0 rounded-[28px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(34,211,238,0.08) 0%, transparent 60%)',
          }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>
    </motion.div>
  )
}
