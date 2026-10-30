import { motion } from 'framer-motion'
import { FiFileText, FiCpu, FiFlag } from 'react-icons/fi'
import GlassCard from '../components/ui/GlassCard'

const STEPS = [
  {
    icon: FiFileText,
    title: 'You share a posting',
    desc: 'Paste text, upload a PDF, or drop a screenshot — ScamShield extracts the underlying text either way.',
  },
  {
    icon: FiCpu,
    title: 'The model scores it',
    desc: 'A classifier trained on thousands of labeled postings weighs language patterns, salary plausibility, and contact details.',
  },
  {
    icon: FiFlag,
    title: 'You get a verdict and why',
    desc: 'A confidence score, a risk level, and the specific signals that drove the result — not just a red or green light.',
  },
]

export default function About() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-10">
        <h1 className="text-2xl md:text-3xl font-display font-semibold">How ScamShield works</h1>
        <p className="text-slate-400 mt-2">A quick look under the hood.</p>
      </div>

      <div className="space-y-4">
        {STEPS.map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
            <GlassCard hover={false} className="p-6 flex gap-5">
              <div className="w-11 h-11 rounded-xl glass flex items-center justify-center shrink-0">
                <s.icon className="text-cyan" size={20} />
              </div>
              <div>
                <h3 className="font-display font-semibold mb-1.5">{s.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <GlassCard hover={false} className="p-6 mt-8">
        <p className="text-sm text-slate-400 leading-relaxed">
          ScamShield is a decision-support tool, not a guarantee. Always independently verify a recruiter and
          company before sharing personal or financial information, and never pay a fee to be hired.
        </p>
      </GlassCard>
    </div>
  )
}
