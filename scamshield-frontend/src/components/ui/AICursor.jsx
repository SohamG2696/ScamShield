/**
 * AICursor — Premium futuristic cybersecurity cursor
 *
 * Architecture notes:
 * • All hooks are called unconditionally (Rules of Hooks)
 * • Touch check is done AFTER hooks, in the render return
 * • Native cursor is recolored via injected SVG data-URL cursor CSS
 * • pointer-events: none on all overlay elements
 * • Cursor hides itself on touch devices (returns null after hooks)
 */
import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, AnimatePresence } from 'framer-motion'

// ─── Constants ─────────────────────────────────────────────────────────────────
const MODES = { DEFAULT: 0, HOVER: 1, SCAN: 2, ANALYZE: 3 }
const MAX_TRAIL = 12

// Build an SVG arrow cursor data-URL in the given colour
function makeCursorCSS(color) {
  // Standard arrow pointer shape filled with brand colour, black stroke for contrast
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path d='M5 3l14 9-7.5 1.5L9 21z' fill='${color}' stroke='black' stroke-width='1'/></svg>`
  const encoded = encodeURIComponent(svg)
  return `url("data:image/svg+xml,${encoded}") 0 0, auto`
}

function mkParticle(x, y, color) {
  return {
    id: `${Date.now()}-${Math.random()}`,
    x,
    y,
    life: 1,
    size: 4,
    color,
  }
}

function isTouch() {
  if (typeof window === 'undefined') return false
  return window.matchMedia ? window.matchMedia('(pointer: coarse)').matches : false
}

// ─── Main cursor ────────────────────────────────────────────────────────────────
export default function AICursor() {
  // ALL hooks first — no early returns before hooks
  const [mode, setMode]       = useState(MODES.DEFAULT)
  const [visible, setVisible] = useState(false)
  const [ripples, setRipples] = useState([])
  const [trail, setTrail]     = useState([])
  const [scanDeg, setScanDeg] = useState(0)
  const [touch]               = useState(isTouch)   // stable, evaluated once

  // Raw mouse position motion values (for spotlight only)
  const mx = useMotionValue(-500)
  const my = useMotionValue(-500)

  const lastPos   = useRef({ x: -500, y: -500 })
  const lastTrail = useRef(0)

  // ── Scan rotation (kept for potential future scan overlay use) ───────────────
  useEffect(() => {
    if (mode !== MODES.SCAN && mode !== MODES.ANALYZE) return
    const speed = mode === MODES.ANALYZE ? 2.5 : 1.8
    let raf
    const tick = () => {
      setScanDeg(d => (d + speed) % 360)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [mode])

  // ── Trail particle decay ─────────────────────────────────────────────────────
  useEffect(() => {
    if (trail.length === 0) return
    const t = setInterval(() => {
      setTrail(prev =>
        prev
          .map(p => ({ ...p, life: p.life - 0.07 }))
          .filter(p => p.life > 0)
      )
    }, 16)
    return () => clearInterval(t)
  }, [trail.length])

  // ── Inject / update coloured cursor CSS ─────────────────────────────────────
  useEffect(() => {
    if (touch) return
    const color = mode === MODES.HOVER ? '#5ED29C' : '#22D3EE'
    let style = document.getElementById('ai-cursor-color')
    if (!style) {
      style = document.createElement('style')
      style.id = 'ai-cursor-color'
      document.head.appendChild(style)
    }
    style.textContent = `*, *::before, *::after { cursor: ${makeCursorCSS(color)} !important; }`
    return () => {
      const s = document.getElementById('ai-cursor-color')
      if (s) s.remove()
    }
  }, [touch, mode])

  // ── Mouse event wiring ───────────────────────────────────────────────────────
  useEffect(() => {
    if (touch) return

    const getColor = () => (mode === MODES.HOVER ? '#5ED29C' : '#22D3EE')

    const onMove = (e) => {
      mx.set(e.clientX)
      my.set(e.clientY)
      setVisible(true)

      // CSS spotlight
      document.documentElement.style.setProperty('--spotlight-x', `${e.clientX}px`)
      document.documentElement.style.setProperty('--spotlight-y', `${e.clientY}px`)

      // Trail emit along mouse movement path
      const now = Date.now()
      const dx = e.clientX - lastPos.current.x
      const dy = e.clientY - lastPos.current.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist > 8 && now - lastTrail.current > 30) {
        lastTrail.current = now
        setTrail(prev => [
          ...prev.slice(-MAX_TRAIL),
          mkParticle(e.clientX, e.clientY, getColor()),
        ])
      }
      lastPos.current = { x: e.clientX, y: e.clientY }
    }

    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    const onClick = (e) => {
      const id = Date.now()
      setRipples(prev => [...prev, { id, x: e.clientX, y: e.clientY }])
      setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 800)
    }

    const onOver = (e) => {
      const el = e.target
      if (!el) return

      // Check for special scan zones (walk up the DOM)
      let node = el
      while (node && node !== document.body) {
        const zone = node.dataset?.scanZone
        if (zone === 'pdf' || zone === 'email') { setMode(MODES.SCAN);    return }
        if (zone === 'analyze')                  { setMode(MODES.ANALYZE); return }
        node = node.parentElement
      }

      // Detect interactive elements
      const tag = el.tagName?.toLowerCase()
      const isBtn =
        tag === 'button' || tag === 'a' || tag === 'select' ||
        el.getAttribute('role') === 'button' ||
        el.getAttribute('role') === 'link' ||
        !!el.closest('button') || !!el.closest('a') ||
        el.classList.contains('cursor-pointer')

      setMode(isBtn ? MODES.HOVER : MODES.DEFAULT)
    }

    window.addEventListener('mousemove',  onMove,  { passive: true })
    window.addEventListener('mouseleave', onLeave)
    window.addEventListener('mouseenter', onEnter)
    window.addEventListener('click',      onClick)
    window.addEventListener('mouseover',  onOver,  { passive: true })

    return () => {
      window.removeEventListener('mousemove',  onMove)
      window.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('mouseenter', onEnter)
      window.removeEventListener('click',      onClick)
      window.removeEventListener('mouseover',  onOver)
    }
  }, [touch, mx, my, mode])

  // Touch devices → render nothing (hooks already called above)
  if (touch) return null

  // ── Derived values ────────────────────────────────────────────────────────────
  const isHover = mode === MODES.HOVER
  const TRAIL_CLR = isHover ? '#5ED29C' : '#22D3EE'

  return (
    <>
      {/* ── Trail dots ──────────────────────────────────────────────────── */}
      {trail.map(p => (
        <div
          key={p.id}
          style={{
            position: 'fixed',
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            marginLeft: -p.size / 2,
            marginTop: -p.size / 2,
            borderRadius: '50%',
            background: p.color,
            opacity: p.life * 0.7,
            transform: `scale(${p.life})`,
            pointerEvents: 'none',
            zIndex: 999990,
            boxShadow: `0 0 6px ${p.color}`,
          }}
        />
      ))}

      {/* ── Click ripples ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {ripples.map(r => (
          <motion.div
            key={r.id}
            style={{
              position: 'fixed',
              left: r.x,
              top: r.y,
              width: 56,
              height: 56,
              marginLeft: -28,
              marginTop: -28,
              borderRadius: '50%',
              border: `1.5px solid ${TRAIL_CLR}`,
              pointerEvents: 'none',
              zIndex: 999988,
            }}
            initial={{ scale: 0.15, opacity: 0.9 }}
            animate={{ scale: 3.8,  opacity: 0   }}
            exit={{}}
            transition={{ duration: 0.75, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
    </>
  )
}
