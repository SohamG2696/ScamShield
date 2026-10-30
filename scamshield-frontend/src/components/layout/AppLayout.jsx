import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import FloatingAssistant from '../ui/FloatingAssistant'
import PageTransition from './PageTransition'
import AuroraBackground from '../landing/AuroraBackground'

export default function AppLayout() {
  return (
    <div className="relative min-h-screen bg-base-900 bg-noise">
      {/* Same aurora background as the landing/home page */}
      <AuroraBackground />

      {/* Content sits above the background */}
      <div className="relative z-10">
        <Navbar />
        <main className="max-w-7xl mx-auto px-5 md:px-8 py-8 md:py-12">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
        <FloatingAssistant />
      </div>
    </div>
  )
}
