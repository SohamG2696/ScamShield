import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Loader, AlertTriangle, ShieldCheck } from 'lucide-react'

const STAGES = [
  { id: 'upload',     label: 'Uploading Email…',            duration: 1200 },
  { id: 'extract',    label: 'Extracting Features',         duration: 1000 },
  { id: 'embed',      label: 'Generating Embeddings',       duration: 1100 },
  { id: 'groq',       label: 'Running Groq Analysis',       duration: 1300 },
  { id: 'predict',    label: 'Predicting Risk Score',       duration: 900  },
]

const RESULTS = [
  { label: 'HIGH RISK', color: '#EF4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.3)', icon: AlertTriangle, text: 'Phishing detected · 94% confidence' },
  { label: 'SAFE',      color: '#5ED29C', bg: 'rgba(94,210,156,0.08)', border: 'rgba(94,210,156,0.3)', icon: ShieldCheck, text: 'Legitimate offer · 97% confidence' },
]

export default function LiveAIDemo() {
  const [activeStage, setActiveStage] = useState(-1)  // -1 = idle
  const [completedStages, setCompletedStages] = useState([])
  const [result, setResult] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [progressWidth, setProgressWidth] = useState(0)
  const timerRef = useRef(null)

  const runDemo = () => {
    if (isRunning) return
    setIsRunning(true)
    setActiveStage(0)
    setCompletedStages([])
    setResult(null)
    setProgressWidth(0)
  }

  useEffect(() => {
    if (activeStage < 0 || !isRunning) return
    if (activeStage >= STAGES.length) {
      setResult(RESULTS[Math.random() > 0.4 ? 0 : 1])
      setProgressWidth(100)
      setIsRunning(false)
      return
    }

    const stage = STAGES[activeStage]
    const target = ((activeStage + 1) / STAGES.length) * 100

    // Progress animation
    const startProgress = (activeStage / STAGES.length) * 100
    const startTime = Date.now()
    const animProg = () => {
      const elapsed = Date.now() - startTime
      const frac = Math.min(elapsed / stage.duration, 1)
      setProgressWidth(startProgress + (target - startProgress) * frac)
      if (frac < 1) requestAnimationFrame(animProg)
    }
    requestAnimationFrame(animProg)

    timerRef.current = setTimeout(() => {
      setCompletedStages((prev) => [...prev, activeStage])
      setActiveStage((prev) => prev + 1)
    }, stage.duration)

    return () => clearTimeout(timerRef.current)
  }, [activeStage, isRunning])

  // Reset after result shown
  useEffect(() => {
    if (!result) return
    const t = setTimeout(() => {
      setActiveStage(-1)
      setCompletedStages([])
      setResult(null)
      setProgressWidth(0)
    }, 5000)
    return () => clearTimeout(t)
  }, [result])

  // Auto-start after mount
  useEffect(() => {
    const t = setTimeout(runDemo, 1200)
    return () => clearTimeout(t)
  }, [])

  const isIdle = activeStage === -1 && !result

  return (
    <section className="relative py-24 px-6">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 60% at 50% 50%, rgba(124,58,237,0.04) 0%, transparent 70%)' }}
      />

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p
            className="text-xs font-semibold tracking-[0.25em] uppercase mb-4"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#22D3EE' }}
          >
            Live Demo
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Watch the AI{' '}
            <span className="text-gradient">scan in real time</span>
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            Every scan runs through 5 stages of AI analysis. Click below to see it happen.
          </p>
        </motion.div>

        {/* Demo terminal */}
        <motion.div
          className="relative mx-auto"
          style={{ maxWidth: 620 }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
            }}
          >
            {/* Terminal chrome */}
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06]">
              <span className="w-3 h-3 rounded-full bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <span className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="text-xs font-mono text-slate-500 ml-2">scamshield — scan engine v2.1</span>
              <div className="ml-auto flex items-center gap-2">
                <motion.span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: isRunning ? '#5ED29C' : '#EF4444' }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-[10px] font-mono text-slate-500">
                  {isRunning ? 'SCANNING' : 'READY'}
                </span>
              </div>
            </div>

            {/* Content area */}
            <div className="p-6 space-y-5">

              {/* Input preview */}
              <div className="rounded-xl p-3.5"
                data-scan-zone="email"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <p className="text-[10px] font-mono text-slate-500 mb-2">INPUT</p>
                <div className="space-y-1.5">
                  {['From: recruiter@quick-hire.io', 'Subject: Urgent Job Offer — $120/hr Remote', 'Attachment: offer_letter.pdf (2.1MB)'].map((line, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-500">{'>'}</span>
                      <span className={`text-[11px] font-mono ${i === 0 ? 'text-red-400' : 'text-slate-300'}`}>{line}</span>
                    </div>
                  ))}
                </div>
              </div>


              {/* Progress bar */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-mono text-slate-500">ANALYSIS PROGRESS</span>
                  <span className="text-[10px] font-mono" style={{ color: '#22D3EE' }}>
                    {Math.round(progressWidth)}%
                  </span>
                </div>
                <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      width: `${progressWidth}%`,
                      background: 'linear-gradient(90deg, #22D3EE, #5ED29C)',
                      boxShadow: '0 0 10px rgba(34,211,238,0.5)',
                    }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              </div>

              {/* Stages */}
              <div className="space-y-2.5">
                {STAGES.map((stage, i) => {
                  const isActive = activeStage === i
                  const isDone = completedStages.includes(i)
                  const isPending = !isActive && !isDone

                  return (
                    <motion.div
                      key={stage.id}
                      className="flex items-center gap-3"
                      animate={{ opacity: isPending ? 0.35 : 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Status icon */}
                      <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                        {isDone ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                          >
                            <CheckCircle size={16} style={{ color: '#5ED29C' }} />
                          </motion.div>
                        ) : isActive ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          >
                            <Loader size={16} style={{ color: '#22D3EE' }} />
                          </motion.div>
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-white/15" />
                        )}
                      </div>

                      {/* Stage label */}
                      <span
                        className="text-sm font-mono flex-1"
                        style={{
                          color: isDone ? '#5ED29C' : isActive ? '#22D3EE' : 'rgba(148,163,184,0.4)',
                        }}
                      >
                        {stage.label}
                        {isDone && ' ✓'}
                      </span>

                      {/* Active shimmer bar */}
                      {isActive && (
                        <div className="w-16 h-1 rounded-full overflow-hidden bg-white/5">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: 'linear-gradient(90deg, transparent, #22D3EE, transparent)' }}
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          />
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>

              {/* Result */}
              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="rounded-xl p-4 flex items-center gap-4"
                    style={{
                      background: result.bg,
                      border: `1px solid ${result.border}`,
                      boxShadow: `0 0 30px ${result.border}`,
                    }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <result.icon size={28} style={{ color: result.color }} />
                    </motion.div>
                    <div className="flex-1">
                      <p className="font-mono font-bold text-lg" style={{ color: result.color }}>
                        {result.label}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{result.text}</p>
                    </div>
                    <div
                      className="px-2.5 py-1 rounded-full text-[10px] font-mono"
                      style={{
                        background: `${result.color}15`,
                        border: `1px solid ${result.border}`,
                        color: result.color,
                      }}
                    >
                      2.4s
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* CTA button */}
              {isIdle && (
                <motion.button
                  onClick={runDemo}
                  className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200"
                  style={{
                    background: 'rgba(34,211,238,0.08)',
                    border: '1px solid rgba(34,211,238,0.3)',
                    color: '#22D3EE',
                  }}
                  whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(34,211,238,0.3)' }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  ▶ Run Demo Scan
                </motion.button>
              )}
            </div>
          </div>

          {/* Outer card glow */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none -z-10"
            style={{
              background: 'radial-gradient(ellipse at 50% 100%, rgba(34,211,238,0.08) 0%, transparent 60%)',
              filter: 'blur(20px)',
              transform: 'scale(1.1)',
            }}
          />
        </motion.div>
      </div>
    </section>
  )
}
