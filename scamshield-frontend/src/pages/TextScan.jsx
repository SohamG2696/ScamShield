import { useId, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiClipboard, FiTrash2, FiFileText, FiArrowRight, FiAlertCircle } from 'react-icons/fi'
import Button from '../components/ui/Button'
import ScanningLoader from '../components/ui/ScanningLoader'
import { useToast } from '../hooks/useToast.jsx'
import { predictText } from '../services/predictService'

const MAX_CHARS = 6000

export default function TextScan({ embedded = false }) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [notJobReason, setNotJobReason] = useState(null)
  const [error, setError] = useState(null)
  const inputId = useId()
  const navigate = useNavigate()
  const { push } = useToast()

  const updateText = (value) => {
    setText(value.slice(0, MAX_CHARS))
    setNotJobReason(null)
    setError(null)
  }

  const handlePaste = async () => {
    try {
      const clip = await navigator.clipboard.readText()
      setText((current) => (current + clip).slice(0, MAX_CHARS))
      setNotJobReason(null)
      setError(null)
    } catch {
      push('Clipboard access was blocked by your browser.', { type: 'warning' })
    }
  }

  const handleAnalyze = async (event) => {
    event.preventDefault()
    if (loading || !text.trim()) return
    setNotJobReason(null)
    setError(null)
    setLoading(true)
    try {
      const data = await predictText(text)
      if (data?.prediction === 'NOT_JOB_RELATED') {
        setNotJobReason(data.reason || 'This does not appear to be a job or internship posting.')
        return
      }
      navigate('/result', { state: { result: data, source: 'text' } })
    } catch (err) {
      setError(err.friendlyMessage || 'We could not analyze this posting. Your text is still here. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`text-scan max-w-3xl mx-auto${embedded ? ' text-scan-embedded' : ''}`}>
      {!embedded && (
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-display font-semibold flex items-center gap-3">
            <FiFileText className="text-cyan" />
            Check a job description
          </h1>
          <p className="text-slate-400 mt-1.5">Paste the listing, then analyze it to see the risk assessment.</p>
        </div>
      )}

      <form className="text-editor" onSubmit={handleAnalyze} aria-busy={loading}>
        {loading ? (
          <div role="status" aria-live="polite">
            <ScanningLoader label="Analyzing job description" />
          </div>
        ) : (
          <>
            <label htmlFor={inputId} className="block mb-2 text-sm font-semibold text-slate-100">Job listing or recruiter message</label>
            <p id={`${inputId}-hint`} className="text-editor-caption">Include the role, pay, and any instructions from the recruiter.</p>
            <textarea
              id={inputId}
              aria-describedby={`${inputId}-hint ${inputId}-count`}
              value={text}
              onChange={(event) => updateText(event.target.value)}
              placeholder="Paste the job description or message here…"
              maxLength={MAX_CHARS}
              rows={embedded ? 4 : 9}
              className="text-editor-input"
            />
            <div className="text-editor-tools">
              <span id={`${inputId}-count`} className="text-xs text-slate-400">
                {text.length.toLocaleString()} / {MAX_CHARS.toLocaleString()} characters
              </span>
              <div className="flex items-center gap-2">
                <Button type="button" variant="ghost" size="sm" icon={FiClipboard} onClick={handlePaste}>
                  Paste
                </Button>
                <Button type="button" variant="ghost" size="sm" icon={FiTrash2} onClick={() => updateText('')} disabled={!text}>
                  Clear
                </Button>
              </div>
            </div>
            <div className="text-editor-submit">
              <Button type="submit" size="lg" icon={FiArrowRight} iconPosition="right" disabled={!text.trim() || loading}>
                Analyze posting
              </Button>
            </div>
          </>
        )}
      </form>

      {(notJobReason || error) && (
        <div role="alert" className="text-scan-error mt-4 flex items-start gap-3 rounded-lg border border-amber-300/25 bg-slate-950/80 p-4">
          <FiAlertCircle size={20} className="shrink-0 text-amber-200" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-amber-100">{notJobReason ? 'Please use a job or internship posting' : 'Analysis could not finish'}</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-300">{notJobReason || error}</p>
          </div>
        </div>
      )}
    </div>
  )
}
