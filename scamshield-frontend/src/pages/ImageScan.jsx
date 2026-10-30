import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiImage, FiZap, FiZoomIn, FiX, FiAlertCircle } from 'react-icons/fi'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import UploadDropzone from '../components/ui/UploadDropzone'
import ScanningLoader from '../components/ui/ScanningLoader'
import { useToast } from '../hooks/useToast.jsx'
import { predictImage } from '../services/predictService'
import { makeDummyResult } from '../utils/dummyData'

export default function ImageScan() {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [zoomed, setZoomed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [notJobReason, setNotJobReason] = useState(null)
  const navigate = useNavigate()
  const { push } = useToast()

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const handleFile = (f) => {
    if (!f.type.startsWith('image/')) {
      push('Please upload an image file.', { type: 'warning' })
      return
    }
    setFile(f)
    setNotJobReason(null)
  }

  const handleAnalyze = async () => {
    if (!file) return
    setNotJobReason(null)
    setLoading(true)
    try {
      const data = await predictImage(file)

      if (data?.prediction === 'NOT_JOB_RELATED') {
        setNotJobReason(data.reason || 'This screenshot does not appear to contain a job or internship posting.')
        return
      }

      navigate('/result', { state: { result: data, source: 'image' } })
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
          <FiImage className="text-cyan" />
          Scan a screenshot
        </h1>
        <p className="text-slate-400 mt-1.5">Upload a screenshot of a DM, post, or listing — we'll read the text and analyze it.</p>
      </div>

      <GlassCard hover={false} className="p-6">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" exit={{ opacity: 0 }}>
              <ScanningLoader label="Reading & analyzing image" />
            </motion.div>
          ) : (
            <motion.div key="uploader" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {!file ? (
                <UploadDropzone accept="image/*" file={file} onFile={handleFile} hint="PNG or JPG up to 8MB" icon={FiImage} />
              ) : (
                <div className="relative rounded-xl overflow-hidden group">
                  <img src={previewUrl} alt="Uploaded preview" className="w-full max-h-80 object-contain bg-black/30" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => setZoomed(true)}
                      className="w-10 h-10 rounded-lg glass-strong flex items-center justify-center hover:text-cyan"
                    >
                      <FiZoomIn size={16} />
                    </button>
                    <button
                      onClick={() => setFile(null)}
                      className="w-10 h-10 rounded-lg glass-strong flex items-center justify-center hover:text-danger"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <Button size="lg" icon={FiZap} onClick={handleAnalyze} disabled={!file}>
                  Analyze screenshot
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
                  Not a job or internship screenshot
                </p>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {notJobReason}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  ScamShield only analyzes screenshots of job listings, DMs, offer letters, and recruitment posts.
                  Please upload a relevant screenshot and try again.
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

      <AnimatePresence>
        {zoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomed(false)}
            className="fixed inset-0 z-[90] bg-black/85 backdrop-blur-sm flex items-center justify-center p-8 cursor-zoom-out"
          >
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={previewUrl}
              alt="Zoomed preview"
              className="max-w-full max-h-full rounded-xl shadow-glass"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
