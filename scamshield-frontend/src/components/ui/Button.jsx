import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

const VARIANTS = {
  primary:
    'bg-gradient-to-r from-[#efc57f] to-[#d8a451] text-stone-950 font-semibold hover:brightness-110 border border-amber-200/30',
  secondary:
    'bg-white/15 text-white font-semibold border border-white/30 hover:bg-white/25 hover:border-white/60 shadow-[0_0_20px_rgba(255,255,255,0.18)] hover:shadow-[0_0_30px_rgba(255,255,255,0.35)]',
  outline:
    'border-2 border-cyan/60 bg-cyan-950/40 text-cyan-200 font-semibold hover:border-cyan-300 hover:text-white hover:bg-cyan/25 hover:shadow-[0_0_30px_rgba(0,245,212,0.55)] shadow-[0_0_18px_rgba(0,245,212,0.25)]',
  ghost:
    'text-slate-100 font-semibold bg-white/10 hover:text-white hover:bg-white/20 border border-white/20 hover:border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.12)]',
  danger:
    'bg-rose-500/30 text-rose-100 font-bold border-2 border-rose-500/60 hover:bg-rose-500/45 hover:border-rose-400 hover:text-white shadow-[0_0_25px_rgba(244,63,94,0.5)] hover:shadow-[0_0_40px_rgba(244,63,94,0.8)]',
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
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      disabled={disabled}
      className={cn(
        'btn-glow inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
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

