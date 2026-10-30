import { motion } from 'framer-motion'

function ScanRing({ size, delay, color = '#22D3EE' }) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        border: `1px solid ${color}`,
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
      animate={{ scale: [0.7, 1.8], opacity: [0.7, 0] }}
      transition={{ duration: 2.5, delay, repeat: Infinity, ease: 'easeOut' }}
    />
  )
}

function FloatingCard({ children, style, delay = 0, amplitude = 10 }) {
  return (
    <motion.div
      className="absolute"
      style={style}
      animate={{ y: [0, -amplitude, 0], rotate: [-1, 1, -1] }}
      transition={{ duration: 5 + delay, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}

const BINARY_PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  char: Math.random() > 0.5 ? '1' : '0',
  delay: Math.random() * 3,
  size: 8 + Math.random() * 4,
  opacity: 0.1 + Math.random() * 0.2,
}))

export default function HeroVisual({ className = '' }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ minHeight: 480 }}>

      {/* Center glow ellipse (holographic) */}
      <div
        className="absolute"
        style={{
          width: 340,
          height: 340,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(ellipse, rgba(34,211,238,0.12) 0%, rgba(94,210,156,0.06) 40%, transparent 70%)',
          filter: 'blur(20px)',
          borderRadius: '50%',
        }}
      />

      {/* Scan rings */}
      <ScanRing size={200} delay={0}    color="rgba(34,211,238,0.4)" />
      <ScanRing size={280} delay={0.8}  color="rgba(94,210,156,0.3)" />
      <ScanRing size={360} delay={1.6}  color="rgba(34,211,238,0.15)" />

      {/* Rotating orbit ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 300,
          height: 300,
          border: '1px dashed rgba(34,211,238,0.18)',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%,-50%)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 220,
          height: 220,
          border: '1px dashed rgba(124,58,237,0.15)',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%,-50%)',
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      />

      {/* Binary particles in background */}
      {BINARY_PARTICLES.map((b) => (
        <span
          key={b.id}
          className="absolute font-mono select-none pointer-events-none"
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            fontSize: b.size,
            color: `rgba(34,211,238,${b.opacity})`,
          }}
        >
          {b.char}
        </span>
      ))}

      {/* ── Central Shield SVG ── */}
      <motion.div
        className="relative z-10 flex items-center justify-center"
        animate={{ rotateY: [0, 10, -10, 0], rotateX: [0, -5, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ perspective: 800 }}
      >
        <svg viewBox="0 0 140 165" width={160} height={160}
          style={{ filter: 'drop-shadow(0 0 30px rgba(34,211,238,0.5))' }}
        >
          <defs>
            <linearGradient id="hShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.9" />
              <stop offset="45%" stopColor="#7C3AED" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#5ED29C" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id="hShieldFill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.07" />
              <stop offset="100%" stopColor="#5ED29C" stopOpacity="0.1" />
            </linearGradient>
            <filter id="hGlow">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          {/* Shield body */}
          <path
            d="M70 6 L126 28 L126 80 Q126 128 70 158 Q14 128 14 80 L14 28 Z"
            fill="url(#hShieldFill)"
            stroke="url(#hShieldGrad)"
            strokeWidth="1.5"
            filter="url(#hGlow)"
          />
          {/* Inner shield */}
          <path
            d="M70 20 L112 38 L112 80 Q112 115 70 138 Q28 115 28 80 L28 38 Z"
            fill="none"
            stroke="url(#hShieldGrad)"
            strokeWidth="0.6"
            opacity="0.4"
          />
          {/* Animated check */}
          <motion.path
            d="M46 82 L63 99 L96 65"
            fill="none"
            stroke="#5ED29C"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, delay: 0.6, ease: 'easeInOut', repeat: Infinity, repeatDelay: 4 }}
            filter="url(#hGlow)"
          />
          {/* Hex grid fill inside shield */}
          <clipPath id="shieldClip">
            <path d="M70 6 L126 28 L126 80 Q126 128 70 158 Q14 128 14 80 L14 28 Z" />
          </clipPath>
          <g clipPath="url(#shieldClip)" opacity="0.3">
            {Array.from({ length: 8 }, (_, i) =>
              Array.from({ length: 6 }, (_, j) => (
                <rect
                  key={`${i}-${j}`}
                  x={14 + i * 16}
                  y={6 + j * 26}
                  width={14}
                  height={24}
                  fill="none"
                  stroke="rgba(34,211,238,0.15)"
                  strokeWidth="0.4"
                  rx="2"
                />
              ))
            )}
          </g>
        </svg>

        {/* Rotating glow dot on orbit */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 8, height: 8,
            background: '#5ED29C',
            boxShadow: '0 0 12px #5ED29C, 0 0 20px rgba(94,210,156,0.5)',
            left: '50%',
            top: '50%',
            transformOrigin: '150px 0',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>

      {/* ── Floating Email card ── */}
      <FloatingCard
        delay={0}
        amplitude={12}
        style={{ top: '8%', left: '-5%' }}
      >
        <div
          className="px-3 py-2 rounded-xl text-xs font-mono"
          data-scan-zone="email"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(34,211,238,0.2)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full" style={{ background: '#EF4444' }} />
            <span className="text-slate-400 text-[10px]">mail@offers.io</span>
          </div>
          <div className="text-[10px] text-slate-300">⚠ Suspicious Email</div>
          <div className="mt-1 h-1 rounded-full" style={{ background: 'rgba(239,68,68,0.3)', width: 80 }}>
            <div className="h-full rounded-full" style={{ background: '#EF4444', width: '78%' }} />
          </div>
        </div>
      </FloatingCard>

      {/* ── Floating PDF icon ── */}
      <FloatingCard
        delay={1.5}
        amplitude={10}
        style={{ bottom: '12%', left: '-8%' }}
      >
        <div
          className="px-3 py-2 rounded-xl flex items-center gap-2"
          data-scan-zone="pdf"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(94,210,156,0.2)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}
        >
          <div className="w-7 h-8 rounded flex items-center justify-center text-[9px] font-bold"
            style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444' }}
          >
            PDF
          </div>
          <div>
            <div className="text-[10px] text-slate-300 font-medium">offer_letter.pdf</div>
            <div className="text-[9px] flex items-center gap-1" style={{ color: '#5ED29C' }}>
              <span>✓</span> Analyzed by AI
            </div>
          </div>
        </div>
      </FloatingCard>

      {/* ── Floating Threat Indicator ── */}
      <FloatingCard
        delay={0.8}
        amplitude={14}
        style={{ top: '15%', right: '-5%' }}
      >
        <div
          className="px-3 py-2 rounded-xl text-xs"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(239,68,68,0.25)',
            boxShadow: '0 0 20px rgba(239,68,68,0.15)',
          }}
        >
          <div className="flex items-center gap-2">
            <motion.span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: '#EF4444' }}
              animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="font-mono text-[10px]" style={{ color: '#EF4444' }}>HIGH RISK</span>
          </div>
          <div className="text-[9px] text-slate-400 mt-0.5">Fake Recruiter • 94%</div>
        </div>
      </FloatingCard>

      {/* ── Floating AI Verdict badge ── */}
      <FloatingCard
        delay={2.5}
        amplitude={8}
        style={{ bottom: '18%', right: '-10%' }}
      >
        <div
          className="px-3 py-2 rounded-xl"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(94,210,156,0.25)',
            boxShadow: '0 0 20px rgba(94,210,156,0.15)',
          }}
        >
          <div className="flex items-center gap-2">
            <motion.span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: '#5ED29C' }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="font-mono text-[10px] font-bold" style={{ color: '#5ED29C' }}>SAFE ✓</span>
          </div>
          <div className="text-[9px] text-slate-400 mt-0.5">Groq AI • 2.1s</div>
        </div>
      </FloatingCard>

      {/* ── Cyber pulse at center bottom ── */}
      <motion.div
        className="absolute font-mono text-[9px] tracking-widest"
        style={{
          bottom: '2%',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(34,211,238,0.5)',
        }}
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        ◆ AI SCAN ENGINE ACTIVE
      </motion.div>
    </div>
  )
}
