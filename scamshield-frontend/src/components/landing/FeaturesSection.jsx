import { motion } from 'framer-motion'
import { Mail, FileText, Search, Zap } from 'lucide-react'

const FEATURES = [
  {
    icon: Mail,
    title: 'Email Scanner',
    desc: 'Paste any suspicious email. Our AI extracts signals, checks domains, and delivers a fraud verdict in under 2 seconds.',
    color: '#22D3EE',
    glow: 'rgba(34,211,238,0.12)',
    badge: 'Gmail Ready',
  },
  {
    icon: FileText,
    title: 'Upload PDF',
    desc: 'Drop an offer letter or job attachment. ScamShield reads the document and flags hidden red flags others miss.',
    color: '#5ED29C',
    glow: 'rgba(94,210,156,0.12)',
    badge: 'Drag & Drop',
  },
  {
    icon: Search,
    title: 'AI Investigation',
    desc: 'Groq-powered deep reasoning generates a full forensic breakdown — not just a score, but why it\'s flagged.',
    color: '#7C3AED',
    glow: 'rgba(124,58,237,0.12)',
    badge: 'Groq LLM',
  },
  {
    icon: Zap,
    title: 'Threat Intelligence',
    desc: 'Real-time scam pattern database updated continuously. Catch novel fraud vectors before they become widespread.',
    color: '#FBBF24',
    glow: 'rgba(251,191,36,0.1)',
    badge: 'Live Updates',
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

export default function FeaturesSection() {
  return (
    <section className="relative py-28 px-6">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(34,211,238,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <p
            className="text-xs font-semibold tracking-[0.25em] uppercase mb-4"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#5ED29C' }}
          >
            Platform Capabilities
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5">
            Everything you need to{' '}
            <span className="text-gradient">stay protected</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
            ScamShield combines multiple AI models, semantic embeddings, and real-time threat data
            into one unified platform.
          </p>
          <div className="glow-line mt-8 max-w-sm mx-auto" />
        </motion.div>

        {/* Feature cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="group relative"
            >
              {/* Card */}
              <div
                className="h-full rounded-2xl p-6 flex flex-col gap-4 cursor-default transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.border = `1px solid ${f.color}30`
                  e.currentTarget.style.boxShadow = `0 8px 40px rgba(0,0,0,0.4), 0 0 30px ${f.glow}`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)'
                  e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)'
                }}
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `${f.color}12`,
                    border: `1px solid ${f.color}25`,
                    boxShadow: `0 0 20px ${f.color}15`,
                  }}
                >
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, delay: i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <f.icon size={22} style={{ color: f.color }} />
                  </motion.div>
                </div>

                {/* Content */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-base text-white">{f.title}</h3>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                </div>

                {/* Badge */}
                <div className="mt-auto">
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                    style={{
                      background: `${f.color}10`,
                      border: `1px solid ${f.color}25`,
                      color: f.color,
                    }}
                  >
                    {f.badge}
                  </span>
                </div>

                {/* Bottom shimmer line */}
                <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden rounded-b-2xl">
                  <motion.div
                    className="h-full"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${f.color}60, transparent)`,
                    }}
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2.5, delay: i * 0.4, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
