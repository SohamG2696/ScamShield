import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUpload, FiZap, FiAlertCircle } from 'react-icons/fi'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import UploadDropzone from '../components/ui/UploadDropzone'
import ScanningLoader from '../components/ui/ScanningLoader'
import { useToast } from '../hooks/useToast.jsx'
import { predictPdf } from '../services/predictService'

export default function PdfScan() {
  const [file, setFile] = useState(null)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)
  const [notJobReason, setNotJobReason] = useState(null)
  const navigate = useNavigate()
  const { push } = useToast()

  const handleFile = (f) => {
    if (f.type !== 'application/pdf') {
      push('Please upload a PDF file.', { type: 'warning' })
      return
    }
    setFile(f)
    setProgress(0)
    setNotJobReason(null)
  }

  const handleAnalyze = async () => {
    if (!file) return
    setNotJobReason(null)
    setLoading(true)
    setProgress(0)
    try {
      const data = await predictPdf(file, setProgress)

      if (data?.prediction === 'NOT_JOB_RELATED') {
        setNotJobReason(data.reason || 'This PDF does not appear to contain a job or internship posting.')
        return
      }

      navigate('/result', { state: { result: data, source: 'pdf' } })
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
          <FiUpload className="text-violet" />
          Scan a PDF listing
        </h1>
        <p className="text-slate-400 mt-1.5">Upload an offer letter or exported job post — we'll extract the text automatically.</p>
      </div>

      <GlassCard hover={false} className="p-6">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" exit={{ opacity: 0 }}>
              <ScanningLoader label="Extracting & analyzing PDF" />
            </motion.div>
          ) : (
            <motion.div key="uploader" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <UploadDropzone
                accept="application/pdf"
                file={file}
                onFile={handleFile}
                onRemove={() => setFile(null)}
                hint="PDF up to 10MB"
                icon={FiUpload}
              />

              {file && progress > 0 && progress < 100 && (
                <div className="mt-4">
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan to-violet"
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <Button size="lg" icon={FiZap} onClick={handleAnalyze} disabled={!file}>
                  Analyze PDF
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
              <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center mt-0.5"
                style={{ background: 'rgba(251,146,60,0.15)', border: '1px solid rgba(251,146,60,0.3)' }}>
                <FiAlertCircle size={20} style={{ color: '#FB923C' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm mb-1" style={{ color: '#FB923C' }}>
                  Not a job or internship document
                </p>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {notJobReason}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  ScamShield only analyzes job postings, offer letters, internship listings, and recruitment documents.
                  Please upload a relevant PDF and try again.
                </p>
              </div>
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
