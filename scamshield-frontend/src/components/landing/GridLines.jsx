import { motion } from 'framer-motion'

export default function GridLines() {
  return (
    <div className="fixed inset-0 pointer-events-none hidden lg:block" style={{ zIndex: 1 }}>
      {[25, 50, 75].map((pct, i) => (
        <motion.div
          key={pct}
          className="grid-line"
          style={{ left: `${pct}%` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 + i * 0.15, duration: 1.2 }}
        />
      ))}
    </div>
  )
}
