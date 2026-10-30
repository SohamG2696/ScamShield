import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiClipboard, FiTrash2, FiFileText, FiZap, FiAlertCircle } from 'react-icons/fi'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import ScanningLoader from '../components/ui/ScanningLoader'
import { useToast } from '../hooks/useToast.jsx'
import { predictText } from '../services/predictService'
import { makeDummyResult } from '../utils/dummyData'

const MAX_CHARS = 6000

export default function TextScan() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [notJobReason, setNotJobReason] = useState(null)
  const navigate = useNavigate()
  const { push } = useToast()

  const handlePaste = async () => {
    try {
      const clip = await navigator.clipboard.readText()
      setText((t) => (t + clip).slice(0, MAX_CHARS))
      setNotJobReason(null)
    } catch {
      push('Clipboard access was blocked by your browser.', { type: 'warning' })
    }
  }

  const handleAnalyze = async () => {
    if (!text.trim()) {
      push('Paste a job description first.', { type: 'warning' })
      return
    }
    setNotJobReason(null)
    setLoading(true)
    try {
      const data = await predictText(text)

      // Backend flagged the text as not a job/internship posting
      if (data?.prediction === 'NOT_JOB_RELATED') {
        setNotJobReason(data.reason || 'This does not appear to be a job or internship posting.')
        return
      }

      navigate('/result', { state: { result: data, source: 'text' } })
    } catch (err) {
      push(err.friendlyMessage || 'Could not connect to ScamShield backend at http://localhost:8000. Please start the backend server.', { type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-display font-semibold flex items-center gap-3">
          <FiFileText className="text-cyan" />
          Scan a job description
        </h1>
        <p className="text-slate-400 mt-1.5">Paste the full listing text — the more context, the more accurate the verdict.</p>
      </div>

      <GlassCard hover={false} className="p-6">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" exit={{ opacity: 0 }}>
              <ScanningLoader label="Analyzing job description" />
            </motion.div>
          ) : (
            <motion.div key="editor" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <textarea
                value={text}
                onChange={(e) => { setText(e.target.value.slice(0, MAX_CHARS)); setNotJobReason(null) }}
                placeholder="Paste the job posting here — title, description, salary, and any recruiter contact details…"
                rows={14}
                className="w-full bg-white/[0.08] border border-white/25 rounded-xl p-4 text-sm text-white placeholder:text-slate-400 outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/40 focus:bg-white/[0.12] transition-all resize-none font-body shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs font-mono text-slate-300 font-semibold">
                  {text.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" icon={FiClipboard} onClick={handlePaste}>
                    Paste
                  </Button>
                  <Button variant="ghost" size="sm" icon={FiTrash2} onClick={() => { setText(''); setNotJobReason(null) }} disabled={!text}>
                    Clear
                  </Button>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button size="lg" icon={FiZap} onClick={handleAnalyze} disabled={!text.trim()}>
                  Analyze posting
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>

      {/* ── Not a job posting banner ── */}
      <AnimatePresence>
        {notJobReason && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="mt-4 relative overflow-hidden rounded-2xl p-[1px]"
            style={{ background: 'linear-gradient(135deg, rgba(251,146,60,0.5) 0%, rgba(239,68,68,0.3) 100%)' }}
          >
            <div
              className="rounded-2xl px-5 py-4 flex items-start gap-4"
              style={{ background: 'linear-gradient(135deg, rgba(251,146,60,0.08) 0%, rgba(239,68,68,0.06) 100%)' }}
            >
              {/* Icon */}
              <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center mt-0.5"
                style={{ background: 'rgba(251,146,60,0.15)', border: '1px solid rgba(251,146,60,0.3)' }}>
                <FiAlertCircle size={20} style={{ color: '#FB923C' }} />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm mb-1" style={{ color: '#FB923C' }}>
                  Not a job or internship posting
                </p>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {notJobReason}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  ScamShield only analyzes job postings, offer letters, internship listings, and recruitment messages.
                  Please paste the relevant content and try again.
                </p>
              </div>

              {/* Dismiss */}
              <button
                onClick={() => setNotJobReason(null)}
                className="shrink-0 text-slate-500 hover:text-slate-300 transition-colors mt-0.5"
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
