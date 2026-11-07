import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiMail,
  FiRefreshCw,
  FiZap,
  FiLogIn,
  FiAlertCircle,
  FiChevronRight,
  FiX,
  FiUser,
  FiBriefcase,
} from 'react-icons/fi'
import { SiGmail } from 'react-icons/si'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import ScanningLoader from '../components/ui/ScanningLoader'
import { useAuth } from '../contexts/GoogleAuthContext'
import { useToast } from '../hooks/useToast.jsx'
import { fetchInbox, fetchEmailSummaries, decodeEmailBody } from '../services/gmailService'
import { predictText } from '../services/predictService'

function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    const now = new Date()
    const diffMs = now - d
    const diffHrs = diffMs / 1000 / 60 / 60
    if (diffHrs < 24) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    if (diffHrs < 168) return d.toLocaleDateString([], { weekday: 'short' })
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
  } catch {
    return ''
  }
}

function extractSenderName(from) {
  // "John Doe <john@example.com>" → "John Doe"
  const match = from.match(/^([^<]+)</)
  if (match) return match[1].trim()
  return from.replace(/<.*>/, '').trim() || from
}

export default function GmailScan() {
  const { user, isLoggedIn, login, loading: authLoading } = useAuth()
  const { push } = useToast()
  const navigate = useNavigate()

  const [emails, setEmails] = useState([])
  const [loadingEmails, setLoadingEmails] = useState(false)
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState(null)
  const [notJobReason, setNotJobReason] = useState(null)

  // Load inbox on sign-in
  useEffect(() => {
    if (isLoggedIn && user?.accessToken) {
      loadInbox()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn])

  async function loadInbox() {
    setLoadingEmails(true)
    setError(null)
    try {
      const stubs = await fetchInbox(user.accessToken, 20)
      const summaries = await fetchEmailSummaries(user.accessToken, stubs)
      setEmails(summaries)
    } catch (err) {
      console.error(err)
      setError('Could not load your inbox. Your session may have expired — try signing in again.')
    } finally {
      setLoadingEmails(false)
    }
  }

  async function handleScan() {
    if (!selectedEmail) return
    setNotJobReason(null)
    setScanning(true)
    try {
      const body = decodeEmailBody(selectedEmail.raw)
      const fullText = `Subject: ${selectedEmail.subject}\nFrom: ${selectedEmail.from}\n\n${body}`
      const data = await predictText(fullText, 'email')

      // Not a job-related email
      if (data?.prediction === 'NOT_JOB_RELATED') {
        setNotJobReason(data.reason || 'This email does not appear to be a job or internship posting.')
        return
      }

      navigate('/result', {
        state: {
          result: data,
          source: 'gmail',
          meta: {
            subject: selectedEmail.subject,
            from: selectedEmail.from,
            date: selectedEmail.date,
          },
        },
      })
    } catch (err) {
      push(err?.friendlyMessage || 'Could not connect to ScamShield backend at http://localhost:8000. Please start the backend server.', { type: 'error' })
    } finally {
      setScanning(false)
    }
  }

  // ── Not signed in ────────────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-display font-semibold flex items-center gap-3">
            <SiGmail className="text-[#EA4335]" size={28} />
            Scan from Gmail
          </h1>
          <p className="text-slate-400 mt-1.5">
            Connect your Gmail account to select emails and check them for scams instantly.
          </p>
        </div>

        <GlassCard hover={false} className="p-10 text-center relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#EA4335]/10 via-[#FBBC05]/5 to-[#34A853]/5 pointer-events-none" />
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#EA4335]/20 to-[#4285F4]/20 border border-white/10 flex items-center justify-center mx-auto mb-6"
            >
              <SiGmail className="text-[#EA4335]" size={36} />
            </motion.div>

            <h2 className="text-xl font-display font-semibold mb-2">Connect your Gmail</h2>
            <p className="text-slate-400 text-sm max-w-sm mx-auto mb-8 leading-relaxed">
              We'll read your inbox using read-only access. Nothing is stored — emails are only
              processed when you explicitly click Scan.
            </p>

            <div className="grid sm:grid-cols-3 gap-3 mb-8 text-xs text-slate-400">
              {[
                { icon: '🔒', label: 'Read-only access' },
                { icon: '🚫', label: 'Nothing stored' },
                { icon: '✋', label: 'You choose which to scan' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/[0.03]"
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => login()}
              disabled={authLoading}
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-2xl bg-white text-slate-900 font-semibold text-sm hover:bg-slate-100 active:scale-95 transition-all disabled:opacity-50 shadow-lg"
            >
              {authLoading ? (
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              Sign in with Google
            </button>
          </div>
        </GlassCard>
      </div>
    )
  }

  // ── Signed in ─────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-semibold flex items-center gap-3">
            <SiGmail className="text-[#EA4335]" size={26} />
            Scan from Gmail
          </h1>
          <p className="text-slate-400 mt-1.5 text-sm">
            Signed in as <span className="text-slate-200 font-medium">{user.email}</span>
          </p>
        </div>
        <button
          onClick={loadInbox}
          disabled={loadingEmails}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/[0.04] text-sm text-slate-300 hover:bg-white/[0.08] transition-colors disabled:opacity-50"
        >
          <FiRefreshCw size={14} className={loadingEmails ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-5">
        {/* Email list */}
        <GlassCard hover={false} className="p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2">
            <FiMail className="text-slate-400" size={15} />
            <span className="text-sm font-medium text-slate-300">Inbox</span>
            {emails.length > 0 && (
              <span className="ml-auto text-xs text-slate-500 font-mono">{emails.length} emails</span>
            )}
          </div>

          <AnimatePresence mode="wait">
            {loadingEmails ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8"
              >
                <ScanningLoader label="Loading your inbox…" />
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 text-center"
              >
                <FiAlertCircle className="text-danger mx-auto mb-3" size={28} />
                <p className="text-sm text-slate-400 max-w-xs mx-auto">{error}</p>
                <button
                  onClick={loadInbox}
                  className="mt-4 text-sm text-cyan hover:underline"
                >
                  Try again
                </button>
              </motion.div>
            ) : emails.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 text-center text-slate-500 text-sm"
              >
                No emails found in your inbox.
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="divide-y divide-white/[0.04] max-h-[520px] overflow-y-auto"
              >
                {emails.map((email, i) => (
                  <motion.button
                    key={email.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => { setSelectedEmail(email); setNotJobReason(null) }}
                    className={`w-full text-left p-4 transition-all flex items-start gap-3 border-b border-white/[0.10] hover:bg-white/[0.12] ${
                      selectedEmail?.id === email.id ? 'bg-cyan/15 border-l-4 border-l-cyan shadow-[0_0_20px_rgba(0,245,212,0.2)]' : ''
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet to-cyan flex items-center justify-center text-xs font-bold text-slate-950 shrink-0 mt-0.5 shadow-sm">
                      {extractSenderName(email.from).charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="text-sm font-medium text-slate-200 truncate">
                          {extractSenderName(email.from)}
                        </span>
                        <span className="text-xs text-slate-500 shrink-0 font-mono">
                          {formatDate(email.date)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300 truncate mb-0.5">{email.subject}</p>
                      <p className="text-xs text-slate-500 truncate">{email.snippet}</p>
                    </div>
                    <FiChevronRight
                      size={14}
                      className={`shrink-0 mt-1 transition-colors ${
                        selectedEmail?.id === email.id ? 'text-cyan' : 'text-slate-600'
                      }`}
                    />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>

        {/* Selected email preview + scan */}
        <div className="flex flex-col gap-5">
          <GlassCard hover={false} className="p-5 flex-1">
            {selectedEmail ? (
              <AnimatePresence mode="wait">
                {scanning ? (
                  <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <ScanningLoader label="Scanning email for scams…" />
                  </motion.div>
                ) : (
                  <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="flex items-start justify-between mb-4">
                      <p className="text-xs uppercase tracking-widest text-cyan/70 font-mono">Selected email</p>
                      <button
                        onClick={() => { setSelectedEmail(null); setNotJobReason(null) }}
                        className="text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                    <h3 className="font-display font-semibold text-base mb-1 line-clamp-2">
                      {selectedEmail.subject}
                    </h3>
                    <p className="text-xs text-slate-500 mb-1">From: {selectedEmail.from}</p>
                    <p className="text-xs text-slate-600 mb-4">{formatDate(selectedEmail.date)}</p>
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 text-xs text-slate-400 leading-relaxed line-clamp-5 mb-4 font-mono">
                      {selectedEmail.snippet}
                    </div>

                    {/* Not-a-job banner */}
                    <AnimatePresence>
                      {notJobReason && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.97 }}
                          transition={{ duration: 0.3 }}
                          className="mb-4 rounded-xl p-[1px]"
                          style={{ background: 'linear-gradient(135deg, rgba(251,146,60,0.5), rgba(239,68,68,0.3))' }}
                        >
                          <div
                            className="rounded-xl px-4 py-3 flex items-start gap-3"
                            style={{ background: 'rgba(251,146,60,0.07)' }}
                          >
                            <FiBriefcase size={16} style={{ color: '#FB923C', marginTop: 2, flexShrink: 0 }} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold mb-0.5" style={{ color: '#FB923C' }}>
                                Not a job or internship email
                              </p>
                              <p className="text-xs text-slate-400 leading-relaxed">{notJobReason}</p>
                              <p className="text-[10px] text-slate-500 mt-1">
                                ScamShield only scans job-related emails. Select a different email.
                              </p>
                            </div>
                            <button onClick={() => setNotJobReason(null)}
                              className="text-slate-500 hover:text-slate-300 transition-colors shrink-0">
                              <FiX size={12} />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Button
                      size="lg"
                      icon={FiZap}
                      className="w-full justify-center"
                      onClick={handleScan}
                    >
                      Scan this email
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            ) : (
              <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-center py-8">
                <div className="w-12 h-12 rounded-xl glass flex items-center justify-center mb-3">
                  <FiMail className="text-slate-500" size={20} />
                </div>
                <p className="text-sm text-slate-500">
                  Select an email from the list to preview and scan it.
                </p>
              </div>
            )}
          </GlassCard>

          {/* User info card */}
          <GlassCard hover={false} className="p-4 flex items-center gap-3">
            {user.picture ? (
              <img
                src={user.picture}
                alt={user.name}
                className="w-10 h-10 rounded-full border border-white/10 shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan to-violet flex items-center justify-center text-sm font-semibold text-base-950 shrink-0">
                <FiUser size={16} />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-200 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-safe animate-pulse shrink-0" title="Connected" />
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
