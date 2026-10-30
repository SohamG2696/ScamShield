import { Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import Landing from './pages/Landing'
import Home from './pages/Home'
import TextScan from './pages/TextScan'
import PdfScan from './pages/PdfScan'
import ImageScan from './pages/ImageScan'
import GmailScan from './pages/GmailScan'
import Result from './pages/Result'
import History from './pages/History'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import About from './pages/About'
import NotFound from './pages/NotFound'
import AICursor from './components/ui/AICursor'

export default function App() {
  return (
    <>
      {/* Global premium AI cursor — covers all routes, disabled on touch */}
      <AICursor />

      <Routes>
        <Route path="/" element={<Landing />} />

        <Route element={<AppLayout />}>
          <Route path="/app" element={<Home />} />
          <Route path="/app/text" element={<TextScan />} />
          <Route path="/app/pdf" element={<PdfScan />} />
          <Route path="/app/image" element={<ImageScan />} />
          <Route path="/app/gmail" element={<GmailScan />} />
          <Route path="/result" element={<Result />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

