import { useState, useRef, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, X, Menu, LogOut, User, ChevronDown } from 'lucide-react'
import { useAuth } from '../../contexts/GoogleAuthContext'

const LINKS = [
  { to: '/',           label: 'Home',          exact: true },
  { to: '/#features',  label: 'Features',      exact: false },
  { to: '/#demo',      label: 'AI Detection',  exact: false },
  { to: '/app',        label: 'Dashboard',     exact: false },
  { to: '/about',      label: 'About',         exact: false },
]

function UserMenu({ user, logout }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const initials = user.name
    ? user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : 'U'

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-full p-0.5 pr-2 transition-colors"
        style={{ border: '1px solid rgba(255,255,255,0.1)' }}
        aria-label="User menu"
      >
        {user.picture ? (
          <img src={user.picture} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
        ) : (
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #22D3EE)' }}
          >
            {initials}
          </div>
        )}
        <ChevronDown
          size={12}
          className={`text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-56 rounded-2xl overflow-hidden z-50"
            style={{
              background: 'rgba(15,23,42,0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
            }}
          >
            <div className="px-4 py-3 border-b border-white/[0.06]">
              <p className="text-sm font-medium text-slate-200 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
            <div className="p-1.5">
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-slate-300 transition-colors hover:bg-white/[0.06]"
              >
                <User size={14} className="text-slate-400" />
                Profile
              </Link>
              <button
                onClick={() => { logout(); setOpen(false) }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors hover:bg-red-500/10"
                style={{ color: '#EF4444' }}
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, isLoggedIn, login, logout, loading } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="sticky top-0 z-40">
      <motion.div
        animate={{
          backdropFilter: scrolled ? 'blur(20px)' : 'blur(10px)',
        }}
        className="transition-all duration-300"
        style={{
          background: scrolled
            ? 'rgba(5,8,22,0.85)'
            : 'rgba(5,8,22,0.4)',
          borderBottom: scrolled
            ? '1px solid rgba(255,255,255,0.08)'
            : '1px solid rgba(255,255,255,0.04)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ rotate: 8, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400 }}
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #22D3EE, #5ED29C)',
                boxShadow: '0 0 20px rgba(34,211,238,0.35)',
              }}
            >
              <Shield size={18} style={{ color: '#050816' }} />
            </motion.div>
            <span className="font-bold text-lg tracking-tight text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
              Scam<span style={{ color: '#5ED29C' }}>Shield</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                className={({ isActive }) =>
                  `relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {/* Hover/active underline glow */}
                    <motion.span
                      className="absolute bottom-1 left-3 right-3 h-px rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, #5ED29C, #22D3EE)',
                        boxShadow: '0 0 8px rgba(94,210,156,0.6)',
                      }}
                      initial={false}
                      animate={{ opacity: isActive ? 1 : 0, scaleX: isActive ? 1 : 0 }}
                      transition={{ duration: 0.2 }}
                    />
                    {/* Hover glow */}
                    <span
                      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{ background: 'rgba(94,210,156,0.06)' }}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Auth */}
            {isLoggedIn ? (
              <UserMenu user={user} logout={logout} />
            ) : (
              <button
                onClick={() => login()}
                disabled={loading}
                className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:bg-white/20 disabled:opacity-50"
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 0 15px rgba(255,255,255,0.1)',
                }}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-3.5 h-3.5 border border-white/40 border-t-white rounded-full"
                  />
                ) : (
                  <svg viewBox="0 0 24 24" width="14" height="14">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                Sign in
              </button>
            )}

            {/* Scan Now CTA */}
            <Link to="/app">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="hidden sm:flex items-center gap-2 px-5 py-1.5 rounded-full text-sm font-bold text-slate-950 transition-all duration-200"
                style={{
                  background: 'linear-gradient(135deg, #00F5D4, #22D3EE)',
                  boxShadow: '0 0 25px rgba(0,245,212,0.65)',
                }}
              >
                Scan Now
              </motion.button>
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-slate-300 hover:bg-white/5 transition-colors"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              <motion.div
                animate={{ rotate: mobileOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.div>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Mobile fullscreen glass overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="md:hidden fixed inset-0 top-16 z-50 flex flex-col"
            style={{
              background: 'rgba(5,8,22,0.97)',
              backdropFilter: 'blur(24px)',
            }}
          >
            {/* Decorative glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full blur-3xl pointer-events-none"
              style={{ background: 'rgba(34,211,238,0.06)' }}
            />

            <nav className="flex flex-col gap-1 px-6 pt-8 pb-6">
              {LINKS.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <NavLink
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-xl text-lg font-medium transition-colors ${
                        isActive ? 'text-white bg-white/5' : 'text-slate-400'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}

              <div className="h-px my-4" style={{ background: 'rgba(255,255,255,0.06)' }} />

              {/* Mobile auth */}
              {isLoggedIn ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 px-4 py-3">
                    {user.picture ? (
                      <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ background: 'linear-gradient(135deg, #7C3AED, #22D3EE)' }}
                      >
                        {user.name?.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-slate-200">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { logout(); setMobileOpen(false) }}
                    className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm transition-colors"
                    style={{ color: '#EF4444' }}
                  >
                    <LogOut size={16} />
                    Sign out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { login(); setMobileOpen(false) }}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-slate-300 hover:bg-white/5 transition-colors"
                >
                  <User size={16} />
                  Sign in with Google
                </button>
              )}

              <Link to="/app" onClick={() => setMobileOpen(false)}>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="mt-2 w-full py-3.5 rounded-full font-semibold text-base"
                  style={{
                    background: '#5ED29C',
                    color: '#050816',
                    boxShadow: '0 0 30px rgba(94,210,156,0.25)',
                  }}
                >
                  Scan Now — It's Free
                </motion.button>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
