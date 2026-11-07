import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiCheckCircle,
  FiAlertTriangle,
  FiArrowLeft,
  FiRefreshCw,
  FiInfo,
  FiFileText,
  FiShield,
  FiList,
  FiAlertCircle,
  FiCheckSquare,
  FiChevronDown,
  FiChevronUp,
  FiMail,
} from 'react-icons/fi'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import CircularProgress from '../components/ui/CircularProgress'
import StatusBadge from '../components/ui/StatusBadge'
import WeightBar from '../components/ui/WeightBar'

// ─── Severity helpers ─────────────────────────────────────────────────────────

const SEVERITY_STYLES = {
  Critical: { bg: 'bg-red-500/10',     border: 'border-red-500/30',     text: 'text-red-400',     dot: 'bg-red-500' },
  High:     { bg: 'bg-orange-500/10',  border: 'border-orange-500/30',  text: 'text-orange-400',  dot: 'bg-orange-500' },
  Medium:   { bg: 'bg-yellow-500/10',  border: 'border-yellow-500/30',  text: 'text-yellow-400',  dot: 'bg-yellow-500' },
  Low:      { bg: 'bg-blue-500/10',    border: 'border-blue-500/30',    text: 'text-blue-400',    dot: 'bg-blue-500' },
  Positive: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', dot: 'bg-emerald-500' },
}

const RISK_STYLES = {
  Critical: 'text-red-400 bg-red-500/10 border-red-500/30',
  High:     'text-orange-400 bg-orange-500/10 border-orange-500/30',
  Medium:   'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  Low:      'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  None:     'text-slate-400 bg-slate-500/10 border-slate-500/30',
  Unknown:  'text-slate-400 bg-slate-500/10 border-slate-500/30',
}

function SeverityBadge({ severity }) {
  const s = SEVERITY_STYLES[severity] || SEVERITY_STYLES.Medium
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full border ${s.bg} ${s.border} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {severity}
    </span>
  )
}

function RiskChip({ label, value }) {
  const cls = RISK_STYLES[value] || RISK_STYLES.Unknown
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-xs text-slate-500 font-mono uppercase tracking-wide">{label}</span>
      <span className={`text-sm font-bold px-3 py-1 rounded-full border ${cls}`}>{value || 'N/A'}</span>
    </div>
  )
}

// ─── Professional Report Panel ────────────────────────────────────────────────

function ProfessionalReport({ report, isScam }) {
  const [expanded, setExpanded] = useState(false)

  if (!report) return null

  const accentColor  = isScam ? 'text-rose-400'       : 'text-emerald-400'
  const borderColor  = isScam ? 'border-rose-500/20'   : 'border-emerald-500/20'
  const gradientFrom = isScam ? 'from-rose-500/5'      : 'from-emerald-500/5'
  const tintBg       = isScam ? 'bg-rose-500/5'        : 'bg-emerald-500/5'
  const tintBorder   = isScam ? 'border-rose-500/15'   : 'border-emerald-500/15'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      className="mt-6"
    >
      <GlassCard hover={false} className={`overflow-hidden border ${borderColor}`}>
        {/* Header */}
        <div className={`bg-gradient-to-r ${gradientFrom} to-transparent px-6 py-5 border-b border-white/5`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isScam ? 'bg-rose-500/10' : 'bg-emerald-500/10'}`}>
                <FiFileText className={accentColor} size={18} />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg">Detailed assessment</h2>
                <p className="text-sm text-slate-400 mt-0.5">Findings and steps to verify the offer.</p>
              </div>
            </div>
            <button
              onClick={() => setExpanded(v => !v)}
              aria-expanded={expanded}
              aria-controls="detailed-assessment"
              aria-label={expanded ? 'Hide detailed assessment' : 'Show detailed assessment'}
              className="p-3 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
            >
              {expanded ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="body"
              id="detailed-assessment"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="p-6 space-y-8">

                {/* Executive Summary */}
                <section>
                  <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
                    <FiInfo size={13} /> Executive Summary
                  </h3>
                  <div className={`p-4 rounded-xl border ${tintBorder} ${tintBg}`}>
                    <p className="text-sm leading-relaxed text-slate-200">{report.executive_summary}</p>
                  </div>
                </section>

                {/* Risk Matrix */}
                {report.risk_matrix && (
                  <section>
                    <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
                      <FiShield size={13} /> Risk Matrix
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                      <RiskChip label="Overall"       value={report.risk_matrix.overall_risk} />
                      <RiskChip label="Financial"     value={report.risk_matrix.financial_risk} />
                      <RiskChip label="Identity"      value={report.risk_matrix.identity_risk} />
                      <RiskChip label="Reputational"  value={report.risk_matrix.reputational_risk} />
                    </div>
                  </section>
                )}

                {/* Detailed Findings */}
                {report.detailed_findings?.length > 0 && (
                  <section>
                    <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
                      <FiList size={13} /> Detailed Findings
                    </h3>
                    <div className="space-y-3">
                      {report.detailed_findings.map((item, i) => {
                        const s = SEVERITY_STYLES[item.severity] || SEVERITY_STYLES.Medium
                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 * i }}
                            className={`p-4 rounded-xl border ${s.bg} ${s.border}`}
                          >
                            <div className="flex items-start justify-between gap-3 mb-1.5">
                              <span className="text-xs font-bold uppercase tracking-wide text-slate-300">
                                {item.category}
                              </span>
                              <SeverityBadge severity={item.severity} />
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed">{item.finding}</p>
                          </motion.div>
                        )
                      })}
                    </div>
                  </section>
                )}

                {/* Red / Green Flags */}
                {report.red_flags_summary?.length > 0 && (
                  <section>
                    <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
                      {isScam
                        ? <><FiAlertCircle size={13} /> Key Red Flags</>
                        : <><FiCheckCircle size={13} /> Key Positive Indicators</>
                      }
                    </h3>
                    <ul className="space-y-2">
                      {report.red_flags_summary.map((flag, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.04 * i }}
                          className={`flex items-start gap-2.5 text-sm ${isScam ? 'text-rose-300' : 'text-emerald-300'}`}
                        >
                          <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isScam ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                          {flag}
                        </motion.li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Verification Checklist */}
                {report.verification_checklist?.length > 0 && (
                  <section>
                    <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
                      <FiCheckSquare size={13} /> Verification Checklist
                    </h3>
                    <ul className="space-y-2.5">
                      {report.verification_checklist.map((step, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.04 * i }}
                          className="flex items-start gap-3 text-sm text-slate-300"
                        >
                          <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-md bg-cyan/10 border border-cyan/25 text-cyan text-xs font-bold flex items-center justify-center">
                            {i + 1}
                          </span>
                          {step}
                        </motion.li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Conclusion */}
                {report.conclusion && (
                  <section>
                    <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
                      <FiShield size={13} /> Conclusion
                    </h3>
                    <div className={`p-4 rounded-xl border ${tintBorder} ${tintBg}`}>
                      <p className="text-sm font-medium leading-relaxed text-slate-200">{report.conclusion}</p>
                    </div>
                  </section>
                )}

                {/* Disclaimer */}
                {report.disclaimer && (
                  <p className="text-xs text-slate-600 border-t border-white/5 pt-4 leading-relaxed">
                    ⚠ {report.disclaimer}
                  </p>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  )
}

// ─── Main Result Page ─────────────────────────────────────────────────────────

export default function Result() {
  const location = useLocation()
  const navigate = useNavigate()

  const raw = location.state?.result

  if (!raw) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <h1 className="text-3xl font-display font-semibold mb-4">Start with a job offer</h1>
        <p className="text-slate-300 leading-relaxed mb-6">Scan a listing, document, screenshot, or email to see its assessment here.</p>
        <Link to="/app" className="inline-flex items-center gap-2 text-cyan hover:underline py-3">
          Choose what to scan <FiRefreshCw size={16} />
        </Link>
      </div>
    )
  }

  // Normalise verdict across API shape (prediction: "Scam"/"Genuine") and dummy shape (verdict: "scam"/"genuine")
  const isScam = raw.verdict === 'scam' || raw.prediction === 'Scam'
  const color  = isScam ? '#F43F5E' : '#10B981'

  // Confidence: dummy has 0–1, API returns 0–100
  const confidence = raw.confidence <= 1 ? raw.confidence * 100 : raw.confidence

  // Risk level from dummy or Groq explanation
  const riskLevel = raw.riskLevel ?? raw.explanation?.risk_level ?? 'Unknown'

  // Recommendation from dummy or Groq explanation
  const recommendation = raw.recommendation ?? raw.explanation?.recommended_action ?? ''

  // Probabilities: dummy shape vs API shape
  const probabilities = raw.probabilities ?? {
    scam:    (raw.scam_probability    ?? 0) / 100,
    genuine: (raw.genuine_probability ?? 0) / 100,
  }

  // Signal reasons: dummy has them pre-built; from API, use scam_indicators
  const reasons = raw.reasons ?? (raw.explanation?.scam_indicators ?? []).map(label => ({
    label,
    weight: 0.15,
  }))

  // AI explanation text
  const explanationText = raw.explanation?.verdict_reasoning ?? null

  // Professional report (null when using dummy data)
  const professionalReport = raw.professional_report ?? null

  // Source & Metadata
  const source = location.state?.source || raw.input_type || 'text'
  const meta = location.state?.meta || null
  const emailSubject = location.state?.emailSubject || meta?.subject || null
  const emailFrom = meta?.from || null

  const targetLabel = (source === 'gmail' || source === 'email')
    ? 'email'
    : source === 'pdf'
    ? 'document'
    : source === 'image'
    ? 'screenshot'
    : 'posting'

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <FiArrowLeft size={14} /> Back
      </button>

      {/* Email Context Banner (if scanned via Gmail) */}
      {(source === 'gmail' || source === 'email') && (emailSubject || emailFrom) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-lg bg-cyan/10 text-cyan flex-shrink-0">
              <FiMail size={15} />
            </div>
            <div className="truncate">
              <span className="text-slate-400 font-mono">Subject: </span>
              <span className="font-semibold text-white">{emailSubject || '(no subject)'}</span>
            </div>
          </div>
          {emailFrom && (
            <div className="flex items-center gap-1.5 flex-shrink-0 text-slate-400">
              <span className="font-mono">From:</span>
              <span className="text-slate-200 font-medium">{emailFrom}</span>
            </div>
          )}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <GlassCard
          hover={false}
          className={`p-8 md:p-10 relative overflow-hidden border ${
            isScam ? 'border-danger/30' : 'border-safe/30'
          }`}
        >
          <div className="grid md:grid-cols-[auto_1fr] gap-8 items-center relative">
            <div className="flex flex-col items-center gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.15 }}
              >
                <CircularProgress value={confidence} color={color} label="Confidence" />
              </motion.div>
              <StatusBadge verdict={isScam ? 'scam' : 'genuine'} size="lg" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                {isScam ? (
                  <FiAlertTriangle className="text-danger" size={18} />
                ) : (
                  <FiCheckCircle className="text-safe" size={18} />
                )}
                <span className="text-xs font-mono uppercase tracking-wide text-slate-500">
                  Risk level: <span className={isScam ? 'text-danger' : 'text-safe'}>{riskLevel}</span>
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-semibold mb-3">
                {isScam
                  ? `This ${targetLabel} shows strong signs of fraud`
                  : `This ${targetLabel} appears lower risk`}
              </h1>
              <p className="text-slate-400 leading-relaxed">{recommendation}</p>

              <div className="flex flex-wrap gap-3 mt-6">
                <Link to="/app">
                  <Button variant="outline" size="sm" icon={FiRefreshCw}>
                    Scan another
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      <details className="result-support">
        <summary>View model scores and detected signals</summary>
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <GlassCard hover={false} className="p-6 h-full">
            <h2 className="font-display font-semibold mb-5 flex items-center gap-2">
              <FiInfo className="text-cyan" size={17} />
              Probability breakdown
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-danger">Scam</span>
                  <span className="font-mono text-xs text-slate-500">{Math.round(probabilities.scam * 100)}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full bg-danger rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${probabilities.scam * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-safe">Genuine</span>
                  <span className="font-mono text-xs text-slate-500">{Math.round(probabilities.genuine * 100)}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full bg-safe rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${probabilities.genuine * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
          <GlassCard hover={false} className="p-6 h-full">
            <h2 className="font-display font-semibold mb-5">Signals detected</h2>
            <div className="space-y-4">
              {reasons.length > 0 ? (
                reasons.map((r, i) => (
                  <WeightBar key={r.label} label={r.label} weight={r.weight} color={color} index={i} />
                ))
              ) : (
                <p className="text-sm text-slate-500">No signal breakdown available.</p>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      </details>

      {/* AI Explanation panel */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }} className="mt-6">
        <GlassCard hover={false} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className={`p-1.5 rounded-lg ${isScam ? 'bg-danger/10 text-danger' : 'bg-safe/10 text-safe'}`}>
                <FiShield size={16} />
              </div>
              <h2 className="font-display font-semibold">
                {source === 'gmail' || source === 'email'
                  ? 'Why this email received this assessment'
                  : 'Why this offer received this assessment'}
              </h2>
            </div>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
            {explanationText || 'A detailed explanation was not returned for this assessment. Verify the role and recruiter through the company’s official contact details before proceeding.'}
          </p>
        </GlassCard>
      </motion.div>

      {/* Professional Fraud Intelligence Report — powered by Groq */}
      <ProfessionalReport report={professionalReport} isScam={isScam} />
    </div>
  )
}
