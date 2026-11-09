import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiImage, FiZap, FiZoomIn, FiX, FiAlertCircle } from 'react-icons/fi'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import UploadDropzone from '../components/ui/UploadDropzone'
import ScanningLoader from '../components/ui/ScanningLoader'
import { useToast } from '../hooks/useToast.jsx'
import { predictImage } from '../services/predictService'

export default function ImageScan() {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [zoomed, setZoomed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [notJobReason, setNotJobReason] = useState(null)
  const previewDialogRef = useRef(null)
  const zoomButtonRef = useRef(null)
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

  useEffect(() => {
    if (!zoomed) return
    const dialog = previewDialogRef.current
    dialog.showModal()
    return () => {
      dialog.close()
      zoomButtonRef.current?.focus()
    }
  }, [zoomed])

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
      push(err.friendlyMessage || 'Could not connect to the ScamShield analysis service. Please try again.', { type: 'error' })
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
                <div className="rounded-xl overflow-hidden">
                  <img src={previewUrl} alt="Uploaded preview" className="w-full max-h-80 object-contain bg-black/30" />
                  <div className="flex flex-wrap items-center justify-end gap-3 pt-3">
                    <button
                      type="button"
                      ref={zoomButtonRef}
                      onClick={() => setZoomed(true)}
                      className="px-3 py-3 rounded-lg inline-flex items-center gap-2 text-sm text-slate-200 hover:bg-white/10"
                    >
                      <FiZoomIn size={16} aria-hidden="true" /> Enlarge preview
                    </button>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="px-3 py-3 rounded-lg inline-flex items-center gap-2 text-sm text-slate-200 hover:bg-white/10"
                    >
                      <FiX size={16} aria-hidden="true" /> Remove image
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

      <dialog
        ref={previewDialogRef}
        aria-label="Enlarged image preview"
        onCancel={() => setZoomed(false)}
        onClose={() => setZoomed(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setZoomed(false)
        }}
        className="m-auto max-w-[95vw] max-h-[95vh] p-4 rounded-xl bg-slate-950 text-white backdrop:bg-black/80"
      >
        <div className="flex justify-end mb-3">
          <button
            type="button"
            onClick={() => setZoomed(false)}
            className="inline-flex items-center gap-2 px-3 py-3 rounded-lg text-sm hover:bg-white/10"
          >
            <FiX size={18} aria-hidden="true" /> Close preview
          </button>
        </div>
        {previewUrl && <img src={previewUrl} alt="Enlarged uploaded screenshot" className="max-w-full max-h-[75vh] object-contain" />}
      </dialog>
    </div>
  )
}
