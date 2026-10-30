import { useCallback, useRef } from 'react'
import Particles from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'

export default function ParticleField({ className = '' }) {
  const initRef = useRef(false)

  const particlesInit = useCallback(async (engine) => {
    if (!initRef.current) {
      await loadSlim(engine)
      initRef.current = true
    }
  }, [])

  const options = {
    background: { color: { value: 'transparent' } },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: { enable: true, mode: 'grab' },
        resize: true,
      },
      modes: {
        grab: { distance: 140, links: { opacity: 0.35 } },
      },
    },
    particles: {
      color: { value: ['#00E5FF', '#6C63FF', '#ffffff'] },
      links: {
        color: '#00E5FF',
        distance: 160,
        enable: true,
        opacity: 0.08,
        width: 1,
      },
      move: {
        direction: 'none',
        enable: true,
        outModes: { default: 'bounce' },
        random: true,
        speed: 0.6,
        straight: false,
      },
      number: { density: { enable: true, area: 1000 }, value: 70 },
      opacity: { value: { min: 0.05, max: 0.35 } },
      shape: { type: 'circle' },
      size: { value: { min: 1, max: 2.5 } },
    },
    detectRetina: true,
  }

  return (
    <Particles
      id="tsparticles"
      className={`absolute inset-0 pointer-events-none ${className}`}
      init={particlesInit}
      options={options}
    />
  )
}
