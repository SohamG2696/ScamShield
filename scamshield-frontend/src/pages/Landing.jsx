import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Shield, Mail, FileText, Globe, Scan, Brain, Lock, Sparkles, CheckCircle, AlertTriangle, Star } from 'lucide-react'

import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import AuroraBackground from '../components/landing/AuroraBackground'
import GridLines from '../components/landing/GridLines'
import HeroGlassCard from '../components/landing/HeroGlassCard'
import HeroVisual from '../components/landing/HeroVisual'
import FeaturesSection from '../components/landing/FeaturesSection'
import LiveAIDemo from '../components/landing/LiveAIDemo'
import DashboardPreview from '../components/landing/DashboardPreview'

const TESTIMONIALS = [
  {
    quote: 'A "recruiter" asked me to buy a laptop through their portal before day one. ScamShield flagged it in four seconds.',
    name: 'Priya N.',
    role: 'Job seeker, Bengaluru',
    avatar: 'PN',
    stars: 5,
  },
  {
    quote: 'We route every inbound listing through the API before it reaches our board. False positives are rare and explanations are crystal clear.',
    name: 'Marcus T.',
    role: 'Trust & Safety, campus job board',
    avatar: 'MT',
    stars: 5,
  },
  {
    quote: 'It caught the exact thing that felt "off" but I couldn\'t name — the salary was 3x the market rate.',
    name: 'Elena R.',
    role: 'Recent graduate',
    avatar: 'ER',
    stars: 5,
  },
]

const LIVE_THREATS = [
  '⚠ Advance-fee scam flagged · Lagos → London',
  '⚠ Fake recruiter detected · $95/hr data-entry',
  '✓ Legitimate offer verified · Bengaluru SaaS co.',
  '⚠ Identity harvest attempt · WhatsApp DM',
  '✓ Real hiring process confirmed · US fintech',
  '⚠ Phishing link in job description',
  '⚠ Fake CEO email detected · wire transfer request',
  '✓ Contract role verified · Amsterdam',
]

const STATS = [
  { value: '128K+', label: 'Postings Scanned', color: '#22D3EE' },
  { value: '31K+',  label: 'Scams Caught',     color: '#EF4444' },
  { value: '96%',   label: 'Model Accuracy',   color: '#5ED29C' },
  { value: '< 2s',  label: 'Avg Scan Time',    color: '#7C3AED' },
]

function StatCard({ value, label, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="text-center p-6 rounded-2xl"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <p className="text-3xl md:text-4xl font-extrabold mb-1" style={{ color }}>{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </motion.div>
  )
}

export default function Landing() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 0.7], [0, 80])

  return (
    <div style={{ backgroundColor: 'var(--bg-base)', overflowX: 'hidden', fontFamily: 'Inter, sans-serif', transition: 'background-color 0.4s ease' }}>

      {/* ─── Full-screen aurora + grid background ─── */}
      <AuroraBackground />
      <GridLines />

      {/* ─── Sticky Navbar ─── */}
      <Navbar />

      {/* ════════════════════════ HERO ════════════════════════ */}
      <section
        ref={heroRef}
        id="hero"
        className="relative pt-4 md:pt-8 pb-6 overflow-hidden"
        style={{ zIndex: 2 }}
      >
        {/* Holographic center glow (SVG) */}
        <svg
          className="absolute pointer-events-none"
          style={{ left: '50%', top: '50%', transform: 'translate(-50%, -55%)', zIndex: 0 }}
          width="900" height="500"
          viewBox="0 0 900 500"
        >
          <defs>
            <filter id="heroGlow">
              <feGaussianBlur stdDeviation="60" result="blur" />
            </filter>
          </defs>
          <ellipse cx="450" cy="250" rx="380" ry="180"
            fill="rgba(34,211,238,0.07)"
            filter="url(#heroGlow)"
          />
        </svg>

        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative max-w-7xl mx-auto px-6 w-full"
        >
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

            {/* ── Left: Hero Copy ── */}
            <div className="flex flex-col items-start">

              {/* AI Security Pill Badge aligned to left */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-cyan/40 bg-cyan/15 backdrop-blur-md shadow-[0_0_20px_rgba(0,245,212,0.3)] mb-5"
              >
                <Brain size={16} className="text-[#00F5D4]" />
                <span className="text-xs font-mono font-bold tracking-widest text-[#00F5D4] uppercase">
                  AI SECURITY PLATFORM
                </span>
                <span className="w-2 h-2 rounded-full bg-[#00F5D4] animate-pulse" />
              </motion.div>

              {/* Main heading */}
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.2 }}
                className="font-extrabold leading-[1.04] tracking-tight mb-5"
                style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}
              >
                <span
                  style={{
                    background: 'linear-gradient(135deg, #00F5D4 0%, #34D399 60%, #22D3EE 100%)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'auroraShift 4s ease infinite',
                  }}
                >
                  SCAMS
                </span>{' '}
                <span className="text-white">DON'T STAND</span>
                <br />
                <span className="text-white">A CHANCE</span>
                <span style={{ color: '#00F5D4' }}>.</span>
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-base md:text-lg leading-relaxed mb-6"
                style={{ maxWidth: 560, color: 'rgba(255,255,255,0.85)' }}
              >
                ScamShield intelligently analyzes emails, job offers, PDFs, and suspicious messages
                using AI, semantic embeddings, Groq reasoning, and machine learning to protect users
                from online fraud.
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap items-center gap-4 mb-6"
              >
                {/* Primary CTA */}
                <Link to="/app">
                  <motion.button
                    id="cta-scan-now"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="relative overflow-hidden flex items-center gap-2.5 px-8 py-3.5 rounded-full font-extrabold text-base text-slate-950"
                    style={{
                      background: 'linear-gradient(135deg, #00F5D4 0%, #22D3EE 50%, #34D399 100%)',
                      boxShadow: '0 0 45px rgba(0,245,212,0.65), 0 0 90px rgba(34,211,238,0.4)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 0 65px rgba(0,245,212,0.85), 0 0 110px rgba(34,211,238,0.6), 0 8px 30px rgba(0,0,0,0.4)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 0 45px rgba(0,245,212,0.65), 0 0 90px rgba(34,211,238,0.4)'
                    }}
                  >
                    <Scan size={18} />
                    Scan Now
                    <ArrowRight size={16} />
                    <span className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 60%)' }} />
                  </motion.button>
                </Link>

                {/* Secondary ghost CTA */}
                <Link to="/about">
                  <motion.button
                    id="cta-learn-more"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-base text-white"
                    style={{
                      background: 'rgba(255,255,255,0.12)',
                      border: '1.5px solid rgba(255,255,255,0.35)',
                      boxShadow: '0 0 20px rgba(255,255,255,0.12)',
                      transition: 'all 0.3s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#00F5D4'
                      e.currentTarget.style.background = 'rgba(255,255,255,0.22)'
                      e.currentTarget.style.boxShadow = '0 0 30px rgba(0,245,212,0.4)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'
                      e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(255,255,255,0.12)'
                    }}
                  >
                    Learn More
                  </motion.button>
                </Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-2"
              >
                {[
                  { icon: Shield, text: 'No account needed' },
                  { icon: Brain,  text: 'Groq AI powered' },
                  { icon: Lock,   text: 'Privacy first' },
                ].map((b) => (
                  <span
                    key={b.text}
                    className="flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-full"
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.18)',
                      color: '#ffffff',
                    }}
                  >
                    <b.icon size={13} style={{ color: '#00F5D4' }} />
                    {b.text}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* ── Right: Hero Visual + Floating Card ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:flex relative items-center justify-center"
            >
              <HeroVisual className="w-full" />
              <div className="absolute -top-4 -right-2 z-20 pointer-events-none">
                <HeroGlassCard />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Live threat ticker ── */}
        <div
          className="relative mt-8 md:mt-10 border-y overflow-hidden"
          style={{
            borderColor: 'rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(10px)',
            zIndex: 2,
          }}
        >
          {/* Left/Right fade */}
          <div className="absolute inset-y-0 left-0 w-24 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, #09090b, transparent)' }} />
          <div className="absolute inset-y-0 right-0 w-24 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to left, #09090b, transparent)' }} />

          <div className="flex py-2.5" style={{ whiteSpace: 'nowrap' }}>
            <div className="flex gap-16 animate-marquee">
              {[...LIVE_THREATS, ...LIVE_THREATS].map((t, i) => (
                <span
                  key={i}
                  className="text-xs font-mono"
                  style={{ color: t.startsWith('⚠') ? 'rgba(239,68,68,0.7)' : 'rgba(94,210,156,0.7)' }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════ STATS ════════════════════════ */}
      <section className="relative py-20 px-6" style={{ zIndex: 2 }}>
        <div className="max-w-5xl mx-auto">
          {/* Section eyebrow */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
              style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.25)',
              }}
            >
              <motion.span
                className="w-2 h-2 rounded-full"
                style={{ background: '#EF4444' }}
                animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-xs font-mono" style={{ color: '#EF4444' }}>
                LIVE THREAT INTELLIGENCE
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold">
              Scams detected globally —{' '}
              <span className="text-gradient">in real time</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((s, i) => (
              <StatCard key={s.label} {...s} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════ FEATURES ════════════════════════ */}
      <div id="features" style={{ zIndex: 2, position: 'relative' }}>
        <FeaturesSection />
      </div>

      {/* ════════════════════════ HOW IT WORKS ════════════════════════ */}
      <section className="relative py-24 px-6" style={{ zIndex: 2 }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 60% at 80% 50%, rgba(124,58,237,0.05) 0%, transparent 70%)' }}
        />
        <div className="relative max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Scanning mock card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div
                className="rounded-2xl p-7 relative overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
                }}
              >
                {/* Window chrome */}
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(239,68,68,0.7)' }} />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(251,191,36,0.7)' }} />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(34,197,94,0.7)' }} />
                  <span className="text-xs font-mono text-slate-500 ml-2">job_post.txt — ScamShield</span>
                </div>

                <div className="space-y-3 relative">
                  {[0.67, 1, 0.83, 0.5, 1, 0.75, 0.42, 1, 0.6].map((w, i) => (
                    <div
                      key={i}
                      className="h-3 rounded-lg"
                      style={{
                        width: `${w * 100}%`,
                        background: (i === 3 || i === 6)
                          ? 'rgba(239,68,68,0.25)'
                          : 'rgba(255,255,255,0.06)',
                        border: (i === 3 || i === 6)
                          ? '1px solid rgba(239,68,68,0.35)'
                          : 'none',
                      }}
                    />
                  ))}
                  {/* Scan beam */}
                  <motion.div
                    className="absolute inset-x-0 h-16 pointer-events-none"
                    style={{
                      background: 'linear-gradient(180deg, transparent 0%, rgba(34,211,238,0) 10%, rgba(34,211,238,0.5) 48%, rgba(94,210,156,0.5) 52%, rgba(34,211,238,0) 90%, transparent 100%)',
                    }}
                    animate={{ top: ['-20%', '110%'] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: [0.65, 0, 0.35, 1] }}
                  />
                </div>

                <div className="mt-7 pt-5 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#EF4444' }}>
                    <AlertTriangle size={15} />
                    2 critical red flags
                  </div>
                  <span
                    className="font-mono text-xs px-2.5 py-1 rounded-full"
                    style={{
                      background: 'rgba(239,68,68,0.1)',
                      border: '1px solid rgba(239,68,68,0.2)',
                      color: '#EF4444',
                    }}
                  >
                    94% confidence
                  </span>
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-4 -right-4 hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl"
                style={{
                  background: 'rgba(15,23,42,0.85)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(94,210,156,0.25)',
                  boxShadow: '0 0 20px rgba(94,210,156,0.2)',
                }}
              >
                <CheckCircle size={13} style={{ color: '#5ED29C' }} />
                <span className="text-xs font-mono text-slate-300">Domain verified ✓</span>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-4 -left-4 hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl"
                style={{
                  background: 'rgba(15,23,42,0.85)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  boxShadow: '0 0 20px rgba(239,68,68,0.15)',
                }}
              >
                <AlertTriangle size={13} style={{ color: '#EF4444' }} />
                <span className="text-xs font-mono text-slate-300">Free email flagged</span>
              </motion.div>
            </motion.div>

            {/* Copy */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p
                className="text-xs font-semibold tracking-[0.25em] uppercase mb-4"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#22D3EE' }}
              >
                Under the Hood
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
                Not just a score — a full{' '}
                <span className="text-gradient">forensic breakdown</span>
              </h2>
              <p className="text-slate-400 leading-relaxed mb-8">
                ScamShield combines a fine-tuned LightGBM classifier with Groq's LLM to give you
                both the verdict and the reasoning — every single time.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Brain,    label: 'ML Classifier',    desc: 'LightGBM trained on 17k+ real & fake postings' },
                  { icon: Globe,    label: 'Groq AI Explainer', desc: 'Full professional fraud intelligence report' },
                  { icon: Lock,     label: 'Risk Matrix',       desc: 'Financial, identity & reputational risk scoring' },
                ].map((item) => (
                  <motion.div
                    key={item.label}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-start gap-4 p-4 rounded-xl transition-colors"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(34,211,238,0.2)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: 'rgba(34,211,238,0.08)',
                        border: '1px solid rgba(34,211,238,0.2)',
                      }}
                    >
                      <item.icon size={16} style={{ color: '#22D3EE' }} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-white">{item.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════ LIVE AI DEMO ════════════════════════ */}
      <div id="demo" style={{ zIndex: 2, position: 'relative' }}>
        <LiveAIDemo />
      </div>

      {/* ════════════════════════ DASHBOARD PREVIEW ════════════════════════ */}
      <div style={{ zIndex: 2, position: 'relative' }}>
        <DashboardPreview />
      </div>

      {/* ════════════════════════ TESTIMONIALS ════════════════════════ */}
      <section className="relative py-24 px-6" style={{ zIndex: 2 }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p
              className="text-xs font-semibold tracking-[0.25em] uppercase mb-4"
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#7C3AED' }}
            >
              Trusted by job seekers
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold">
              Caught before it{' '}
              <span className="text-gradient">cost them anything</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <div
                  className="h-full rounded-2xl p-7 flex flex-col"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                    transition: 'border-color 0.3s, box-shadow 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(124,58,237,0.25)'
                    e.currentTarget.style.boxShadow = '0 8px 40px rgba(0,0,0,0.4), 0 0 30px rgba(124,58,237,0.08)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                    e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)'
                  }}
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-5">
                    {[...Array(t.stars)].map((_, j) => (
                      <Star key={j} size={13} style={{ color: '#FBBF24', fill: '#FBBF24' }} />
                    ))}
                  </div>

                  <p className="text-slate-300 leading-relaxed flex-1 text-sm">"{t.quote}"</p>

                  <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, rgba(34,211,238,0.3), rgba(124,58,237,0.3))',
                        border: '1px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-white">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════ FINAL CTA ════════════════════════ */}
      <section className="relative py-24 px-6" style={{ zIndex: 2 }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="relative rounded-3xl overflow-hidden p-14 text-center"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
            }}
          >
            {/* Aurora inside card */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(34,211,238,0.08) 0%, transparent 70%)' }}
            />
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 50% 50% at 80% 100%, rgba(124,58,237,0.06) 0%, transparent 70%)' }}
            />

            <div className="relative">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
                style={{
                  background: 'rgba(94,210,156,0.08)',
                  border: '1px solid rgba(94,210,156,0.25)',
                }}
              >
                <motion.span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: '#5ED29C' }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-xs font-mono" style={{ color: '#5ED29C' }}>
                  FREE · NO ACCOUNT NEEDED
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-extrabold mb-5">
                Don't apply blind.{' '}
                <span className="text-gradient">Scan it first.</span>
              </h2>

              <p className="text-slate-400 mb-10 max-w-md mx-auto text-lg">
                It takes less time than reading the job description itself.
              </p>

              <Link to="/app">
                <motion.button
                  id="cta-final-scan"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg"
                  style={{
                    background: '#5ED29C',
                    color: '#050816',
                    boxShadow: '0 0 60px rgba(94,210,156,0.4)',
                  }}
                >
                  <Scan size={20} />
                  Start scanning — it's free
                  <ArrowRight size={18} />
                </motion.button>
              </Link>

              <p className="text-slate-600 text-xs font-mono mt-6">
                First 5 scans require no sign-in.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
