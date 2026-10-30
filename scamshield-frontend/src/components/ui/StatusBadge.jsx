import { motion } from 'framer-motion'
import { FiCheckCircle, FiAlertTriangle } from 'react-icons/fi'
import { cn } from '../../utils/cn'

export default function StatusBadge({ verdict, size = 'md' }) {
  const isScam = verdict === 'scam'
  const Icon = isScam ? FiAlertTriangle : FiCheckCircle
  return (
    <motion.div
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 16 }}
      className={cn(
        'inline-flex items-center gap-2 rounded-full font-semibold border',
        isScam ? 'bg-danger/10 border-danger/40 text-danger' : 'bg-safe/10 border-safe/40 text-safe',
        size === 'lg' ? 'px-5 py-2 text-base' : 'px-3.5 py-1.5 text-xs'
      )}
    >
      <Icon size={size === 'lg' ? 20 : 14} />
      {isScam ? 'Likely Scam' : 'Likely Genuine'}
    </motion.div>
  )
}
