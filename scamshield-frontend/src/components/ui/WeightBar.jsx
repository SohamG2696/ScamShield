import { motion } from 'framer-motion'

export default function WeightBar({ label, weight, color = '#00E5FF', index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.15 + index * 0.08, duration: 0.4 }}
      className="space-y-1.5"
    >
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="font-mono text-xs text-slate-500">{Math.round(weight * 100)}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${weight * 100}%` }}
          transition={{ delay: 0.25 + index * 0.08, duration: 0.7, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  )
}
