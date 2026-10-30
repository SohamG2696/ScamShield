import { motion } from 'framer-motion'
import { FiShield, FiAlertTriangle, FiCheckCircle, FiMail, FiCalendar, FiLogIn } from 'react-icons/fi'
import GlassCard from '../components/ui/GlassCard'
import { useAuth } from '../contexts/GoogleAuthContext'

const STATS = [
  { icon: FiShield, label: 'Total scans', value: 47, color: 'text-cyan' },
  { icon: FiAlertTriangle, label: 'Scams detected', value: 12, color: 'text-danger' },
  { icon: FiCheckCircle, label: 'Safe postings', value: 35, color: 'text-safe' },
]

export default function Profile() {
  const { user, isLoggedIn, login, loading } = useAuth()

  // Derive initials for avatar fallback
  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  // Derive "member since" from account (we don't have this from OAuth, so show current month)
  const memberSince = (() => {
    const now = new Date()
    return now.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  })()

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-display font-semibold">Your profile</h1>
      </div>

      {isLoggedIn ? (
        <>
          <GlassCard hover={false} className="p-7 mb-6 flex items-center gap-5">
            {/* Avatar */}
            {user?.picture ? (
              <img
                src={user.picture}
                alt={user.name}
                className="w-16 h-16 rounded-full border-2 border-white/10 shadow-glow-violet shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan to-violet flex items-center justify-center text-xl font-display font-semibold text-base-950 shrink-0">
                {initials}
              </div>
            )}
            <div>
              <h2 className="font-display font-semibold text-lg">{user?.name || 'Google User'}</h2>
              <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
                <FiMail size={13} /> {user?.email || '—'}
              </p>
              <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
                <FiCalendar size={13} /> Connected {memberSince}
              </p>
              {/* Google badge */}
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.04] text-xs text-slate-400">
                <svg viewBox="0 0 24 24" width="12" height="12">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Signed in with Google
              </div>
            </div>
          </GlassCard>

          <div className="grid sm:grid-cols-3 gap-5">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <GlassCard hover={false} className="p-6 text-center">
                  <div className="w-11 h-11 rounded-xl glass flex items-center justify-center mx-auto mb-4">
                    <s.icon className={s.color} size={20} />
                  </div>
                  <p className="text-3xl font-display font-semibold">{s.value}</p>
                  <p className="text-sm text-slate-500 mt-1">{s.label}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        /* Not signed in state */
        <GlassCard hover={false} className="p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 to-violet/5 pointer-events-none" />
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan/20 to-violet/20 border border-white/10 flex items-center justify-center mx-auto mb-5">
              <FiLogIn className="text-cyan" size={24} />
            </div>
            <h2 className="font-display font-semibold text-xl mb-2">Sign in to view your profile</h2>
            <p className="text-slate-400 text-sm max-w-xs mx-auto mb-6">
              Connect your Google account to see your scan history and personalized stats.
            </p>
            <button
              onClick={() => login()}
              disabled={loading}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white text-slate-900 font-semibold text-sm hover:bg-slate-100 active:scale-95 transition-all disabled:opacity-50 shadow-lg"
            >
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>
          </div>
        </GlassCard>
      )}
    </div>
  )
}
