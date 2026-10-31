import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiShield, FiArrowLeft } from 'react-icons/fi'
import Button from '../components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950/40 flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan to-violet flex items-center justify-center mb-6 shadow-glow"
      >
        <FiShield className="text-base-950" size={28} />
      </motion.div>
      <h1 className="text-5xl font-display font-semibold text-gradient mb-3">404</h1>
      <p className="text-slate-400 mb-8">This page didn't pass the scan — it doesn't exist.</p>
      <Link to="/">
        <Button icon={FiArrowLeft}>Back to safety</Button>
      </Link>
    </div>
  )
}
