import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiFileText, FiUpload, FiImage, FiArrowRight, FiTrendingUp,
  FiShield, FiAlertTriangle, FiCheckCircle, FiActivity,
} from 'react-icons/fi'
import { SiGmail } from 'react-icons/si'
import GlassCard from '../components/ui/GlassCard'
import SpotlightCard from '../components/ui/SpotlightCard'
import AIScanAnimation from '../components/ui/AIScanAnimation'
import { dummyHistory } from '../utils/dummyData'
import { useAuth } from '../contexts/GoogleAuthContext'

const METHODS = [
  {
    icon: FiFileText,
    title: 'Paste text',
    desc: 'Copy the listing text and drop it in. Fastest option for postings found online.',
    to: '/app/text',
    color: '#00E5FF',
    gradient: 'from-cyan/20 to-cyan/5',
  },
  {
    icon: FiUpload,
    title: 'Upload PDF',
    desc: 'Got an offer letter or attached listing? Upload the file — we extract and analyze.',
    to: '/app/pdf',
    color: '#6C63FF',
    gradient: 'from-violet/20 to-violet/5',
  },
  {
    icon: FiImage,
    title: 'Screenshot',
    desc: 'Screenshotted a DM or a social post? We can read that too with OCR.',
    to: '/app/image',
    color: '#10B981',
    gradient: 'from-safe/20 to-safe/5',
  },
  {
    icon: SiGmail,
    title: 'Scan Gmail',
    desc: 'Connect Google and pick suspicious emails straight from your inbox.',
    to: '/app/gmail',
    color: '#EA4335',
    gradient: 'from-[#EA4335]/15 to-[#FBBC05]/5',
    badge: 'New',
  },
]

const QUICK_STATS = [
  { label: 'Scans today',     value: '3',    icon: FiActivity,       color: '#00E5FF' },
  { label: 'Scams caught',    value: '2',    icon: FiAlertTriangle,  color: '#F43F5E' },
  { label: 'Genuine offers',  value: '1',    icon: FiCheckCircle,    color: '#10B981' },
  { label: 'Accuracy rate',   value: '96%',  icon: FiShield,         color: '#6C63FF' },
]

export default function Home() {
  const recent = dummyHistory.slice(0, 3)
  const { user, isLoggedIn } = useAuth()

  const firstName = isLoggedIn && user?.given_name
    ? user.given_name
    : isLoggedIn && user?.name
    ? user.name.split(' ')[0]
    : null

  return (
    <div className="relative">
      {/* Subtle aurora glow behind content */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan/[0.04] rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet/[0.05] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10">
        {/* ── WELCOME HEADER ── */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-6 mb-8 items-start">
          <div>
            {/* User greeting */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 mb-6"
            >
              {isLoggedIn && (
                <div className="shrink-0">
                  {user?.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="w-12 h-12 rounded-full border-2 border-cyan/30 shadow-[0_0_20px_rgba(0,229,255,0.3)]"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan to-violet flex items-center justify-center text-base font-bold text-base-950">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
              )}
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold">
                  {firstName ? `Welcome back, ${firstName} 👋` : 'Welcome back 👋'}
                </h1>
                <p className="text-slate-400 mt-1 text-sm">
                  {isLoggedIn
                    ? `Signed in as ${user?.email}`
                    : "Pick how you'd like to scan a job posting."}
                </p>
              </div>
            </motion.div>

            {/* Quick stats row */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-2"
            >
              {QUICK_STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 + i * 0.06 }}
                >
                  <SpotlightCard
                    spotlightColor={`${s.color}10`}
                    className="glass rounded-xl p-4 border border-white/[0.06] hover:border-white/15 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <s.icon style={{ color: s.color }} size={13} />
                      <span className="text-xs text-slate-500">{s.label}</span>
                    </div>
                    <p className="font-display font-bold text-xl" style={{ color: s.color }}>
                      {s.value}
                    </p>
                  </SpotlightCard>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* AI Scan Animation panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div
              className="relative overflow-hidden rounded-2xl p-[1px]"
              style={{
                background: 'linear-gradient(135deg, rgba(34,211,238,0.25) 0%, rgba(124,58,237,0.15) 50%, rgba(34,211,238,0.08) 100%)',
              }}
            >
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{ background: 'linear-gradient(145deg, #0a1220 0%, #060c14 100%)' }}
              >
                {/* Radial center glow */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(34,211,238,0.06) 0%, transparent 70%)' }}
                />

                {/* Card header */}
                <div className="flex items-center justify-between px-4 pt-4 pb-1">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-rose-500/70" />
                      <span className="w-2 h-2 rounded-full bg-amber-400/70" />
                      <span className="w-2 h-2 rounded-full bg-emerald-400/70" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">scamshield_ai.py</span>
                  </div>
                  {/* LIVE badge */}
                  <span className="flex items-center gap-1.5 text-[9px] font-bold font-mono tracking-widest px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(34,211,238,0.1)', color: '#22D3EE', border: '1px solid rgba(34,211,238,0.3)' }}>
                    <motion.span
                      className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                      animate={{ opacity: [1, 0.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    LIVE
                  </span>
                </div>

                {/* Animation */}
                <AIScanAnimation className="h-[220px] px-2 pb-3" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── SCAN METHOD CARDS ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-4"
        >
          Choose scan method
        </motion.p>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
          {METHODS.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.3 + i * 0.08 }}
            >
              <Link to={m.to}>
                <SpotlightCard
                  spotlightColor={`${m.color}10`}
                  className="h-full rounded-2xl glass border border-white/[0.08] hover:border-white/20 transition-all duration-300 group relative overflow-hidden"
                >
                  {/* Hover gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${m.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                  <div className="relative p-6">
                    {m.badge && (
                      <span
                        className="absolute top-4 right-4 text-[9px] font-bold px-2 py-0.5 rounded-full border"
                        style={{
                          background: `${m.color}15`,
                          color: m.color,
                          borderColor: `${m.color}40`,
                        }}
                      >
                        {m.badge}
                      </span>
                    )}

                    <motion.div
                      className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
                      style={{
                        background: `${m.color}12`,
                        border: `1px solid ${m.color}30`,
                        boxShadow: `0 0 20px ${m.color}15`,
                      }}
                    >
                      <m.icon style={{ color: m.color }} size={20} />
                    </motion.div>

                    <h3 className="font-display font-bold text-base mb-1.5">{m.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-5">{m.desc}</p>

                    <span
                      className="inline-flex items-center gap-1.5 text-xs font-semibold"
                      style={{ color: m.color }}
                    >
                      Start scan
                      <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={13} />
                    </span>
                  </div>
                </SpotlightCard>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* ── RECENT ACTIVITY ── */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-display font-bold flex items-center gap-2">
            <FiTrendingUp className="text-violet" size={17} />
            Recent activity
          </h2>
          <Link to="/history" className="text-xs text-cyan hover:text-cyan/80 font-mono transition-colors">
            View all →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {recent.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + i * 0.07 }}
            >
              <SpotlightCard
                spotlightColor={item.verdict === 'scam' ? 'rgba(244,63,94,0.06)' : 'rgba(16,185,129,0.06)'}
                className="rounded-xl glass border border-white/[0.06] hover:border-white/15 transition-colors"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        item.verdict === 'scam'
                          ? 'bg-danger/10 text-danger border border-danger/20'
                          : 'bg-safe/10 text-safe border border-safe/20'
                      }`}
                    >
                      {item.verdict === 'scam' ? '⚠ Scam' : '✓ Genuine'}
                    </span>
                    <span className="text-xs text-slate-600 font-mono">{item.date}</span>
                  </div>
                  <p className="font-semibold text-sm truncate">{item.title}</p>
                  <p className="text-xs text-slate-500 mt-1 truncate">{item.company}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-mono capitalize">{item.method}</span>
                    <div
                      className="h-1 w-16 rounded-full overflow-hidden bg-white/5"
                    >
                      <div
                        className={`h-full rounded-full ${item.verdict === 'scam' ? 'bg-danger' : 'bg-safe'}`}
                        style={{ width: `${item.confidence * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
