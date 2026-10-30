import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useCountUp } from '../../hooks/useCountUp'

export default function AnimatedCounter({ value, suffix = '', label }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (inView) setStarted(true)
  }, [inView])

  const count = useCountUp(value, { start: started })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <p className="text-4xl md:text-5xl font-display font-semibold text-gradient">
        {count.toLocaleString()}
        {suffix}
      </p>
      <p className="text-sm text-slate-400 mt-2">{label}</p>
    </motion.div>
  )
}
