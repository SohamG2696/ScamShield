import { Link } from 'react-router-dom'
import { FiShield } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-base-950/50">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #22D3EE, #5ED29C)' }}
            >
              <FiShield className="text-[#050816]" size={16} />
            </div>
            <span className="font-bold text-white">Scam<span style={{ color: '#5ED29C' }}>Shield</span></span>
          </div>
          <p className="text-sm text-slate-500 max-w-xs">
            AI-powered cybersecurity that detects scams, fake recruiters, and phishing — before they cost you.
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-300 mb-3">Product</p>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><Link to="/app" className="hover:text-cyan transition-colors">Dashboard</Link></li>
            <li><Link to="/app/text" className="hover:text-cyan transition-colors">Scan text</Link></li>
            <li><Link to="/app/pdf" className="hover:text-cyan transition-colors">Scan PDF</Link></li>
            <li><Link to="/app/image" className="hover:text-cyan transition-colors">Scan screenshot</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-300 mb-3">Company</p>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><Link to="/about" className="hover:text-cyan transition-colors">About</Link></li>
            <li><Link to="/privacy" className="hover:text-cyan transition-colors">Privacy Policy</Link></li>
            <li><a href="#" className="hover:text-cyan transition-colors">Terms</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/[0.06] py-5 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} ScamShield. Built to keep job seekers safe.
      </div>
    </footer>
  )
}
