import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiShield } from 'react-icons/fi'

const DEFAULT_LINES = [
  'Parsing document structure…',
  'Cross-referencing recruiter domain…',
  'Checking salary against market data…',
  'Scanning for red-flag phrasing…',
  'Synthesizing threat intelligence…',
]

const EMAIL_LINES = [
  'Inspecting sender headers & domain…',
  'Checking for free email domain spoofing…',
  'Analyzing recruitment communication…',
  'Scanning for advance-fee fraud signals…',
  'Generating fraud intelligence report…',
]

const PDF_LINES = [
  'Extracting text from PDF document…',
  'Verifying company credentials…',
  'Checking salary and offer terms…',
  'Scanning for advance-fee clauses…',
  'Synthesizing threat assessment…',
]

const IMAGE_LINES = [
  'Running OCR text recognition…',
  'Extracting contact & compensation details…',
  'Analyzing recruitment patterns…',
  'Scanning for scam triggers…',
  'Compiling forensic findings…',
]

export default function ScanningLoader({ label = 'Analyzing job posting' }) {
  const lowerLabel = label.toLowerCase()
  const lines = lowerLabel.includes('email') || lowerLabel.includes('inbox')
    ? EMAIL_LINES
    : lowerLabel.includes('pdf')
    ? PDF_LINES
    : lowerLabel.includes('image')
    ? IMAGE_LINES
    : DEFAULT_LINES

  const [activeLine, setActiveLine] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveLine((prev) => (prev + 1) % lines.length)
    }, 1800)
    return () => clearInterval(timer)
  }, [lines.length])

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
        <span className="font-mono text-xs tracking-wider uppercase font-semibold">{label}</span>
      </motion.div>

      {/* Rotating status line with single-item AnimatePresence (no text merging) */}
      <div className="relative mt-4 h-6 w-full max-w-sm flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={activeLine}
            className="text-xs text-slate-400 font-mono tracking-wide text-center"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {lines[activeLine]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}
