import { useState } from 'react'
import { FiMoon, FiSun, FiBell, FiGlobe, FiInfo } from 'react-icons/fi'
import GlassCard from '../components/ui/GlassCard'
import { useTheme } from '../hooks/useTheme'

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full relative transition-colors ${checked ? 'bg-cyan' : 'bg-white/10'}`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}

export default function Settings() {
  const { theme, toggleTheme } = useTheme()
  const [notifications, setNotifications] = useState(true)
  const [language, setLanguage] = useState('English')

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-display font-semibold">Settings</h1>
      </div>

      <div className="space-y-4">
        <GlassCard hover={false} className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {theme === 'dark' ? <FiMoon className="text-cyan" size={18} /> : <FiSun className="text-cyan" size={18} />}
            <div>
              <p className="font-medium text-sm">Appearance</p>
              <p className="text-xs text-slate-500">Dark mode by default</p>
            </div>
          </div>
          <Toggle checked={theme === 'dark'} onChange={toggleTheme} />
        </GlassCard>

        <GlassCard hover={false} className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FiBell className="text-cyan" size={18} />
            <div>
              <p className="font-medium text-sm">Notifications</p>
              <p className="text-xs text-slate-500">Get notified when a scan finishes</p>
            </div>
          </div>
          <Toggle checked={notifications} onChange={setNotifications} />
        </GlassCard>

        <GlassCard hover={false} className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FiGlobe className="text-cyan" size={18} />
            <div>
              <p className="font-medium text-sm">Language</p>
              <p className="text-xs text-slate-500">Interface language</p>
            </div>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-white/[0.04] border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none"
          >
            <option>English</option>
            <option>हिन्दी</option>
            <option>Español</option>
          </select>
        </GlassCard>

        <GlassCard hover={false} className="p-5 flex items-center gap-3">
          <FiInfo className="text-cyan" size={18} />
          <div>
            <p className="font-medium text-sm">ScamShield v1.0.0</p>
            <p className="text-xs text-slate-500">AI-powered job scam detection</p>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
