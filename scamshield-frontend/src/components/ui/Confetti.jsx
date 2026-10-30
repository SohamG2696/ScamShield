import { motion } from 'framer-motion'

const COLORS = ['#00E5FF', '#6C63FF', '#10B981', '#FBBF24', '#5CF2FF']

export default function Confetti({ count = 24 }) {
  const pieces = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 500,
    rotate: Math.random() * 360,
    delay: Math.random() * 0.3,
    color: COLORS[i % COLORS.length],
    size: 6 + Math.random() * 6,
  }))

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden flex items-start justify-center">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x: 0, y: -20, opacity: 1, rotate: 0 }}
          animate={{ x: p.x, y: 340, opacity: 0, rotate: p.rotate }}
          transition={{ duration: 1.6 + Math.random() * 0.6, delay: p.delay, ease: 'easeOut' }}
          style={{ background: p.color, width: p.size, height: p.size * 0.4, position: 'absolute', top: 0 }}
          className="rounded-sm"
        />
      ))}
    </div>
  )
}
