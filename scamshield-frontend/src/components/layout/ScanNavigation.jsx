import { NavLink, useLocation } from 'react-router-dom'
import { FileText, FileUp, Image, Mail } from 'lucide-react'

const methods = [
  { to: '/app/text', label: 'Text', icon: FileText },
  { to: '/app/pdf', label: 'PDF', icon: FileUp },
  { to: '/app/image', label: 'Screenshot', icon: Image },
  { to: '/app/gmail', label: 'Gmail', icon: Mail },
]

export default function ScanNavigation() {
  const { pathname } = useLocation()
  const isHome = pathname === '/' || pathname === '/app'

  return (
    <nav className="scan-navigation" aria-label="Choose what to check">
      {methods.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          aria-current={isHome && to === '/app/text' ? 'page' : undefined}
          className={({ isActive }) => isActive || (isHome && to === '/app/text') ? 'scan-link is-current' : 'scan-link'}
        >
          <Icon size={17} strokeWidth={1.6} aria-hidden="true" />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
