import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

export default function GlassCard({ children, className, hover = true, as: Comp = motion.div, ...props }) {
  return (
    <Comp
      className={cn('glass rounded-2xl shadow-glass', className)}
      whileHover={hover ? { borderColor: 'rgba(166,187,211,0.4)' } : undefined}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      {...props}
    >
      {children}
    </Comp>
  )
}
