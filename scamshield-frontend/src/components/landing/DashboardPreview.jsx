import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const STATS = [
  {
    label: 'Threat Score',
    value: 87,
    suffix: '',
    unit: '/ 100',
    color: '#EF4444',
    bg: 'rgba(239,68,68,0.08)',
    border: 'rgba(239,68,68,0.2)',
    description: 'Current email under review',
    ring: true,
    ringColor: '#EF4444',
    ringBg: 'rgba(239,68,68,0.12)',
  },
  {
    label: 'AI Confidence',
    value: 96,
    suffix: '%',
    color: '#5ED29C',
    bg: 'rgba(94,210,156,0.08)',
    border: 'rgba(94,210,156,0.2)',
    description: 'Model prediction accuracy',
    ring: true,
    ringColor: '#5ED29C',
    ringBg: 'rgba(94,210,156,0.12)',
  },
  {
    label: 'Emails Scanned',
    value: 128400,
    suffix: '+',
    color: '#22D3EE',
    bg: 'rgba(34,211,238,0.08)',
    border: 'rgba(34,211,238,0.2)',
    description: 'Since platform launch',
    ring: false,
  },
  {
    label: 'Fraud Detected',
    value: 31400,
    suffix: '+',
    color: '#FBBF24',
    bg: 'rgba(251,191,36,0.08)',
    border: 'rgba(251,191,36,0.2)',
    description: 'Scams stopped this year',
    ring: false,
  },
]

function RingChart({ pct, color, bg }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const r = 28
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ

  return (
    <div ref={ref} className="relative w-20 h-20 flex items-center justify-center">
      <svg viewBox="0 0 72 72" className="w-20 h-20 -rotate-90">
        <circle cx="36" cy="36" r={r} fill="none" stroke={bg} strokeWidth="5" />
        <motion.circle
          cx="36" cy="36" r={r}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={inView ? { strokeDashoffset: circ - dash } : { strokeDashoffset: circ }}
          transition={{ duration: 1.8, ease: 'easeOut', delay: 0.2 }}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
    </div>
  )
}

function MiniChart({ color, inView }) {
  const bars = [35, 55, 40, 70, 45, 80, 50, 65, 38, 90, 48, 75]
  return (
    <div className="flex items-end gap-1 h-8 mt-auto">
      {bars.map((h, j) => (
        <motion.div
          key={j}
          className="flex-1 rounded-sm"
          style={{ background: `${color}35` }}
          initial={{ height: 0 }}
          animate={inView ? { height: `${h}%` } : { height: 0 }}
          transition={{ duration: 0.5, delay: 0.3 + j * 0.04, ease: 'easeOut' }}
        />
      ))}
      <motion.div
        className="flex-1 rounded-sm"
        style={{ background: color, boxShadow: `0 0 8px ${color}` }}
        initial={{ height: 0 }}
        animate={inView ? { height: '90%' } : { height: 0 }}
        transition={{ duration: 0.5, delay: 0.9, ease: 'easeOut' }}
      />
    </div>
  )
}

function StatCard({ stat, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const s = stat

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="rounded-2xl p-6 flex flex-col gap-4 cursor-default"
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
        backdropFilter: 'blur(12px)',
        boxShadow: `0 8px 32px rgba(0,0,0,0.3), 0 0 40px ${s.bg}`,
      }}
    >
      {s.ring ? (
        <div className="flex items-center gap-4">
          <RingChart pct={s.value} color={s.ringColor} bg={s.ringBg} />
          <div>
            <p className="text-2xl font-extrabold" style={{ color: s.color }}>
              <motion.span
                initial={0}
                animate={inView ? s.value : 0}
                transition={{ duration: 2, ease: 'easeOut', delay: 0.3 }}
              >
                {(v) => `${Math.round(v)}${s.suffix || ''}`}
              </motion.span>
              {s.unit && (
                <span className="text-sm text-slate-500 font-normal ml-1">{s.unit}</span>
              )}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-3xl font-extrabold mb-1" style={{ color: s.color }}>
            <motion.span
              initial={0}
              animate={inView ? s.value : 0}
              transition={{ duration: 2.2, ease: 'easeOut', delay: 0.2 }}
            >
              {(v) => `${Math.round(v).toLocaleString()}${s.suffix}`}
            </motion.span>
          </p>
          <p className="text-sm font-semibold text-white mb-1">{s.label}</p>
        </div>
      )}
      <p className="text-xs text-slate-500">{s.description}</p>
      <MiniChart color={s.color} inView={inView} />
    </motion.div>
  )
}

const THREAT_ACTIVITY = Array.from({ length: 24 }, (_, i) => {
  const isHigh = [6, 7, 8, 14, 15, 22, 23].includes(i)
  return {
    height: isHigh ? 60 + Math.floor(Math.random() * 40) : 20 + Math.floor(Math.random() * 35),
    color: isHigh ? '#EF4444' : '#22D3EE',
  }
})

export default function DashboardPreview() {
  return (
    <section className="relative py-24 px-6">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(94,210,156,0.03) 0%, transparent 70%)' }}
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p
            className="text-xs font-semibold tracking-[0.25em] uppercase mb-4"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#5ED29C' }}
          >
            Analytics Dashboard
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Your{' '}
            <span className="text-gradient">security at a glance</span>
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            Real-time metrics across every scan, threat, and AI analysis — in one premium dashboard.
          </p>
        </motion.div>

        {/* Stats cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {STATS.map((s, i) => (
            <StatCard key={s.label} stat={s} index={i} />
          ))}
        </div>

        {/* Threat activity bar chart */}
        <motion.div
          className="rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <p className="text-sm font-semibold text-white">Threat Activity — Last 24 Hours</p>
              <p className="text-xs text-slate-500 mt-0.5">Live scam detection feed</p>
            </div>
            <div className="flex items-center gap-2">
              <motion.span
                className="w-2 h-2 rounded-full"
                style={{ background: '#5ED29C' }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-xs font-mono text-slate-400">LIVE</span>
            </div>
          </div>

          <div className="flex items-end gap-1 h-16">
            {THREAT_ACTIVITY.map((bar, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-sm"
                style={{ background: `${bar.color}50` }}
                initial={{ height: 0 }}
                whileInView={{ height: `${bar.height}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.03, ease: 'easeOut' }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] font-mono text-slate-600">00:00</span>
            <span className="text-[10px] font-mono text-slate-600">12:00</span>
            <span className="text-[10px] font-mono text-slate-600">23:59</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
