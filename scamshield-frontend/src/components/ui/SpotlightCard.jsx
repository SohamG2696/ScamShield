import { useRef, useCallback } from 'react'

/**
 * Aceternity-style spotlight card.
 * Tracks mouse position and renders a radial gradient "spotlight"
 * that follows the cursor, revealing depth beneath the glass surface.
 */
export default function SpotlightCard({ children, className = '', spotlightColor = 'rgba(0,229,255,0.07)' }) {
  const cardRef = useRef(null)

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    card.style.setProperty('--mouse-x', `${x}%`)
    card.style.setProperty('--mouse-y', `${y}%`)
    card.style.setProperty('--spotlight-color', spotlightColor)
  }, [spotlightColor])

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current
    if (!card) return
    card.style.setProperty('--mouse-x', '50%')
    card.style.setProperty('--mouse-y', '50%')
  }, [])

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`spotlight-card ${className}`}
      style={{
        '--mouse-x': '50%',
        '--mouse-y': '50%',
        '--spotlight-color': spotlightColor,
      }}
    >
      {children}
    </div>
  )
}
