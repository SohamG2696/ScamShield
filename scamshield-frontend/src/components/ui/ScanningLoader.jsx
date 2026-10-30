import { motion } from 'framer-motion'
import { FiShield } from 'react-icons/fi'

const LINES = [
  'Parsing document structure…',
  'Cross-referencing recruiter domain…',
  'Checking salary against market data…',
  'Scanning for red-flag phrasing…',
  'Weighing evidence…',
]

export default function ScanningLoader({ label = 'Analyzing job posting' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="relative w-64 h-40 rounded-xl glass-strong overflow-hidden border border-cyan/20">
        {/* mock document lines */}
        <div className="p-4 space-y-2 opacity-70">
          <div className="h-2.5 w-3/4 rounded bg-white/10" />
          <div className="h-2.5 w-1/2 rounded bg-white/10" />
          <div className="h-2.5 w-5/6 rounded bg-white/10" />
          <div className="h-2.5 w-2/3 rounded bg-white/10" />
          <div className="h-2.5 w-1/3 rounded bg-white/10" />
          <div className="h-2.5 w-4/5 rounded bg-white/10" />
        </div>
        {/* scanning beam */}
        <motion.div
          className="absolute inset-x-0 h-16 bg-scan-beam"
          initial={{ y: '-100%' }}
          animate={{ y: ['-100%', '260%'] }}
          transition={{ duration: 2.1, repeat: Infinity, ease: [0.65, 0, 0.35, 1] }}
        />
        {/* corner brackets */}
        <div className="absolute inset-2 border border-cyan/30 rounded-lg pointer-events-none" />
        <span className="absolute -top-px -left-px w-4 h-4 border-t-2 border-l-2 border-cyan rounded-tl-lg" />
        <span className="absolute -top-px -right-px w-4 h-4 border-t-2 border-r-2 border-cyan rounded-tr-lg" />
        <span className="absolute -bottom-px -left-px w-4 h-4 border-b-2 border-l-2 border-violet rounded-bl-lg" />
        <span className="absolute -bottom-px -right-px w-4 h-4 border-b-2 border-r-2 border-violet rounded-br-lg" />
      </div>

      <motion.div
        className="flex items-center gap-2 mt-6 text-cyan"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      >
        <FiShield size={16} />
        <span className="font-mono text-xs tracking-wide uppercase">{label}</span>
      </motion.div>

      <div className="mt-4 h-5 overflow-hidden text-center">
        {LINES.map((line, i) => (
          <motion.p
            key={line}
            className="text-xs text-slate-500 font-mono absolute left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{
              duration: LINES.length * 1.1,
              repeat: Infinity,
              delay: i * 1.1,
              times: [0, 0.05, 0.85, 1],
            }}
          >
            {line}
          </motion.p>
        ))}
      </div>
    </div>
  )
}
