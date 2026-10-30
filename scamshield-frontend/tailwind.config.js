/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: {
          950: '#09090b',
          900: '#0b0f19',
          800: '#0f172a',
          700: '#1e293b',
          600: '#334155',
          500: '#475569',
        },
        cyan: {
          DEFAULT: '#00F5D4',
          bright: '#22D3EE',
          legacy: '#00E5FF',
          soft: '#67E8F9',
        },
        violet: {
          DEFAULT: '#8B5CF6',
          soft: '#C4B5FD',
          legacy: '#7C3AED',
        },
        emerald: {
          DEFAULT: '#10B981',
          bright: '#34D399',
          soft: '#6EE7B7',
          glow: '#059669',
        },
        safe: {
          DEFAULT: '#10B981',
          soft: '#34D399',
        },
        danger: {
          DEFAULT: '#F43F5E',
          bright: '#FF4D6D',
          legacy: '#EF4444',
          soft: '#FDA4AF',
        },
        warn: {
          DEFAULT: '#FBBF24',
          bright: '#FDE047',
          soft: '#FEF08A',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['"Instrument Serif"', 'serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'grid-glow':
          'radial-gradient(circle at 20% 20%, rgba(0,245,212,0.25), transparent 45%), radial-gradient(circle at 80% 0%, rgba(139,92,246,0.25), transparent 50%), radial-gradient(circle at 50% 100%, rgba(52,211,153,0.20), transparent 55%)',
        'scan-beam':
          'linear-gradient(180deg, transparent 0%, rgba(34,211,238,0.0) 10%, rgba(34,211,238,0.75) 48%, rgba(139,92,246,0.75) 52%, rgba(34,211,238,0.0) 90%, transparent 100%)',
        'aurora-gradient':
          'radial-gradient(ellipse at 20% 50%, rgba(0,245,212,0.18) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.20) 0%, transparent 55%), radial-gradient(ellipse at 50% 80%, rgba(52,211,153,0.15) 0%, transparent 50%)',
        'cyber-grid':
          'linear-gradient(rgba(34,211,238,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.08) 1px, transparent 1px)',
        'hero-glow':
          'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(34,211,238,0.25), transparent)',
        'card-glass':
          'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)',
      },
      boxShadow: {
        glow: '0 0 45px 0 rgba(34,211,238,0.55)',
        'glow-green': '0 0 45px 0 rgba(52,211,153,0.6)',
        'glow-violet': '0 0 45px 0 rgba(139,92,246,0.5)',
        'glow-lg': '0 0 90px 0 rgba(34,211,238,0.5)',
        glass: '0 8px 32px rgba(0,0,0,0.3)',
        'glass-xl': '0 24px 80px rgba(0,0,0,0.4)',
        neon: '0 0 25px rgba(52,211,153,0.8), 0 0 50px rgba(52,211,153,0.4)',
        'neon-cyan': '0 0 25px rgba(34,211,238,0.8), 0 0 50px rgba(34,211,238,0.4)',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        floatSlow: {
          '0%,100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(3deg)' },
        },
        floatCard: {
          '0%,100%': { transform: 'translateY(0px) rotate(-1deg)' },
          '50%': { transform: 'translateY(-18px) rotate(1deg)' },
        },
        pulseGlow: {
          '0%,100%': { opacity: 0.5 },
          '50%': { opacity: 1 },
        },
        blob: {
          '0%,100%': { transform: 'translate(0,0) scale(1)' },
          '33%': { transform: 'translate(20px,-30px) scale(1.08)' },
          '66%': { transform: 'translate(-15px,15px) scale(0.95)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        aurora: {
          '0%,100%': { backgroundPosition: '0% 50%', opacity: 0.8 },
          '33%': { backgroundPosition: '60% 30%', opacity: 1 },
          '66%': { backgroundPosition: '100% 70%', opacity: 0.85 },
        },
        auroraShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        borderRotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        hologramSpin: {
          '0%': { transform: 'rotateY(0deg) rotateX(15deg)' },
          '100%': { transform: 'rotateY(360deg) rotateX(15deg)' },
        },
        scanRing: {
          '0%': { transform: 'scale(0.6)', opacity: 1 },
          '100%': { transform: 'scale(2.2)', opacity: 0 },
        },
        threatPulse: {
          '0%,100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(239,68,68,0.6)' },
          '50%': { transform: 'scale(1.12)', boxShadow: '0 0 0 12px rgba(239,68,68,0)' },
        },
        neuralPulse: {
          '0%,100%': { opacity: 0.3, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.08)' },
        },
        drawLine: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        fadeSlideUp: {
          '0%': { opacity: 0, transform: 'translateY(24px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: 1 },
          '100%': { transform: 'scale(4)', opacity: 0 },
        },
        gridScroll: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(40px)' },
        },
        connectionPulse: {
          '0%': { strokeDashoffset: '200', opacity: 0 },
          '30%': { opacity: 1 },
          '100%': { strokeDashoffset: '0', opacity: 0 },
        },
        particleDrift: {
          '0%': { transform: 'translateY(0) translateX(0)', opacity: 0 },
          '10%': { opacity: 1 },
          '90%': { opacity: 1 },
          '100%': { transform: 'translateY(-100vh) translateX(20px)', opacity: 0 },
        },
        glowPulse: {
          '0%,100%': { boxShadow: '0 0 20px rgba(34,211,238,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(34,211,238,0.7), 0 0 60px rgba(94,210,156,0.3)' },
        },
        progressFill: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        typewriter: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
        blink: {
          '0%,100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
      },
      animation: {
        scan: 'scan 2.2s cubic-bezier(0.65,0,0.35,1) infinite',
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'floatSlow 8s ease-in-out infinite',
        'float-card': 'floatCard 7s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2.4s ease-in-out infinite',
        blob: 'blob 12s ease-in-out infinite',
        marquee: 'marquee 30s linear infinite',
        aurora: 'aurora 10s ease-in-out infinite',
        'aurora-shift': 'auroraShift 12s ease infinite',
        shimmer: 'shimmer 2.4s linear infinite',
        'border-rotate': 'borderRotate 4s linear infinite',
        'hologram-spin': 'hologramSpin 12s linear infinite',
        'scan-ring': 'scanRing 2s ease-out infinite',
        'threat-pulse': 'threatPulse 2s ease-in-out infinite',
        'neural-pulse': 'neuralPulse 3s ease-in-out infinite',
        'draw-line': 'drawLine 2s ease-in-out forwards',
        'fade-slide-up': 'fadeSlideUp 0.6s ease-out forwards',
        ripple: 'ripple 0.6s linear',
        'grid-scroll': 'gridScroll 8s linear infinite',
        'connection-pulse': 'connectionPulse 3s ease-in-out infinite',
        'particle-drift': 'particleDrift 8s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'progress-fill': 'progressFill 2s ease-out forwards',
        blink: 'blink 1s step-end infinite',
      },
    },
  },
  plugins: [],
}
