import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

const VARIANTS = {
  primary: 'bg-[#e8c48d] text-[#201b13] font-semibold hover:bg-[#f3d5a7] border border-transparent',
  secondary: 'bg-slate-800 text-slate-100 border border-slate-600 hover:bg-slate-700',
  outline: 'bg-transparent text-slate-100 border border-slate-500 hover:bg-white/5',
  ghost: 'bg-transparent text-slate-300 border border-transparent hover:text-white hover:bg-white/5',
  danger: 'bg-rose-950/60 text-rose-100 border border-rose-400/40 hover:bg-rose-900/60',
}

const SIZES = {
  sm: 'px-3.5 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  className,
  disabled,
  ...props
}) {
  return (
    <motion.button
      disabled={disabled}
      className={cn(
        'ui-button inline-flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
        VARIANTS[variant],
        SIZES[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon size={16} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={16} />}
    </motion.button>
  )
}

