import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Shield, ChevronDown } from 'lucide-react'
import { useAuth } from '../../contexts/GoogleAuthContext'
import ScanNavigation from './ScanNavigation'
import FloatingAssistant from '../ui/FloatingAssistant'

export function SecurityShell({ children }) {
  const { pathname } = useLocation()
  const { user, isLoggedIn, login, logout, loading } = useAuth()
  const isScanner = ['/app/text', '/app/pdf', '/app/image', '/app/gmail'].includes(pathname)
  const isHome = pathname === '/' || pathname === '/app'
  const isChecking = isScanner || isHome

  return (
    <div className="security-shell">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <header className="site-header">
        <Link to="/" className="site-brand" aria-label="ScamShield home">
          <Shield size={27} strokeWidth={1.5} aria-hidden="true" />
          <span>ScamShield<span className="brand-period">.</span></span>
        </Link>
        <nav className="site-navigation" aria-label="Main navigation">
          <Link to="/" aria-current={isChecking ? 'page' : undefined}>Check an offer</Link>
          <NavLink to="/history">History</NavLink>
          <a href="/#how-it-works">How it works</a>
        </nav>
        <details className="account-menu" key={pathname}>
          <summary><span>{isLoggedIn ? user?.name?.split(' ')[0] || 'Account' : 'Account'}</span><ChevronDown size={14} aria-hidden="true" /></summary>
          <div className="account-options">
            {isLoggedIn && <p>{user?.name || 'Your account'}</p>}
            <Link to="/profile">Profile</Link>
            <button type="button" disabled={loading} onClick={isLoggedIn ? logout : login}>
              {loading ? 'Connecting…' : isLoggedIn ? 'Sign out' : 'Sign in with Google'}
            </button>
          </div>
        </details>
      </header>

      <main id="main-content" tabIndex={-1} className={`site-main${isScanner ? ' scanner-page' : ''}${isHome ? ' home-page' : ''}`}>
        {isScanner && <ScanNavigation />}
        <div key={pathname} className="workspace-page">{children || <Outlet />}</div>
      </main>

      <FloatingAssistant />

      <footer className="site-footer">
        <span>ScamShield <span aria-hidden="true">/</span> A second look at your next opportunity.</span>
        <div className="flex items-center gap-3">
          <Link to="/about">Understand your assessment</Link>
          <span className="text-slate-600" aria-hidden="true">·</span>
          <Link to="/privacy">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  )
}

export default function AppLayout() {
  return <SecurityShell />
}
