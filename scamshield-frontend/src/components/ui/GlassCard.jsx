import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

export default function GlassCard({ children, className, hover = true, as: Comp = motion.div, ...props }) {
  return (
    <Comp
      className={cn('glass rounded-2xl shadow-glass', className)}
      whileHover={hover ? { y: -6, borderColor: 'rgba(0,229,255,0.35)' } : undefined}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      {...props}
    >
      {children}
    </Comp>
  )
}
