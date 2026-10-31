import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Shield, LayoutDashboard, ScanLine, History, Settings, ArrowUpRight, FileText, Image, Mail, FileUp, CircleHelp, ChevronRight, LogOut } from 'lucide-react'
import { useAuth } from '../../contexts/GoogleAuthContext'

const navigation = [
  ['/app', 'Overview', LayoutDashboard], ['/app/text', 'Text analysis', FileText],
  ['/app/pdf', 'Document scan', FileUp], ['/app/image', 'Image scan', Image],
  ['/app/gmail', 'Email security', Mail], ['/history', 'Scan history', History],
]
export function SecurityShell({ children }) {
  const { pathname } = useLocation()
  const { user, isLoggedIn, login, logout, loading } = useAuth()
  return <div className="security-shell">
    <aside className="security-sidebar">
      <Link to="/" className="security-brand"><span className="brand-mark"><Shield size={23} strokeWidth={1.5} /></span><span>Scam<span className="gold">Shield</span><small>THREAT INTELLIGENCE</small></span></Link>
      <div className="workspace-label"><span className="status-dot" /> PERSONAL WORKSPACE <span>01</span></div>
      <p className="nav-caption">WORKSPACE</p>
      <nav aria-label="Main navigation">{navigation.map(([to, label, Icon]) => <NavLink key={to} to={to} end className={({ isActive }) => `side-link ${isActive || (pathname === '/' && to === '/app') ? 'selected' : ''}`}><Icon size={18} strokeWidth={1.6}/><span>{label}</span>{label === 'Overview' && <ChevronRight size={14}/>}</NavLink>)}</nav>
      <p className="nav-caption secondary-caption">PREFERENCES</p>
      <NavLink to="/settings" className="side-link"><Settings size={18}/>Settings</NavLink>
      <NavLink to="/about" className="side-link"><CircleHelp size={18}/>About ScamShield</NavLink>
      <div className="sidebar-bottom"><div className="security-note"><Shield size={20}/><strong>A second look. A safer move.</strong><p>Check the offer before you take the next step.</p><Link to="/app/text">Start an analysis <ArrowUpRight size={14}/></Link></div>
      <div className="user-strip"><span className="avatar">{user?.name?.charAt(0) || 'G'}</span><span><strong>{user?.name || 'Guest workspace'}</strong><small>{isLoggedIn ? 'Personal account' : 'No account required'}</small></span>{isLoggedIn && <button onClick={logout} aria-label="Sign out"><LogOut size={16}/></button>}</div></div>
    </aside>
    <div className="security-body"><header className="security-topbar"><div className="breadcrumb">Workspace <ChevronRight size={13}/><span>{navigation.find(([to]) => to === pathname)?.[1] || (pathname === '/' ? 'Overview' : 'ScamShield')}</span></div><div className="topbar-actions"><span className="edition"><span className="status-dot"/> SECURITY CONSOLE</span>{!isLoggedIn && <button className="quiet-button" disabled={loading} onClick={login}>{loading ? 'Connecting…' : 'Sign in'} <ArrowUpRight size={14}/></button>}<Link to="/profile" className="avatar" aria-label="Open profile">{user?.name?.charAt(0) || 'G'}</Link></div></header>
    <main className="security-main">{children || <Outlet/>}</main>
    <footer className="security-footer"><span><Shield size={12}/> SCAMSHIELD / JOB OFFER INTELLIGENCE</span><span>Stay skeptical. Stay protected.</span></footer></div>
  </div>
}
export default function AppLayout() { return <SecurityShell/> }
