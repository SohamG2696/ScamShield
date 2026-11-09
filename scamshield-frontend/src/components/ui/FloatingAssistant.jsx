import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiSend, FiShield, FiRefreshCw } from 'react-icons/fi'
import { apiClient } from '../../services/apiClient'

const SUGGESTED = [
  'How does ScamShield detect scams?',
  'What are common red flags in job postings?',
  'How do I verify a recruiter is real?',
  'What should I do if I spot a scam?',
]

const WELCOME = {
  role: 'assistant',
  content: "Hi! I'm the **ScamShield AI Assistant**. I can help you spot job scam red flags, understand scan results, and stay safe in your job search. What would you like to know?",
}

function parseMarkdown(text) {
  // Very lightweight bold + line-break parsing
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>')
}

function MessageBubble({ msg, isLast }) {
  const isUser = msg.role === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-cyan to-violet flex items-center justify-center shadow-glow">
          <FiShield size={13} className="text-base-900" />
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
          isUser
            ? 'bg-cyan/20 border border-cyan/30 text-white rounded-tr-sm'
            : 'glass border border-white/[0.08] text-slate-200 rounded-tl-sm'
        }`}
        dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.content) }}
      />
    </motion.div>
  )
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex gap-2 items-end"
    >
      <div className="shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-cyan to-violet flex items-center justify-center shadow-glow">
        <FiShield size={13} className="text-base-900" />
      </div>
      <div className="glass border border-white/[0.08] rounded-2xl rounded-tl-sm px-3 py-2.5 flex gap-1 items-center">
        {[0, 0.15, 0.3].map((delay, i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-cyan/70"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, delay }}
          />
        ))}
      </div>
    </motion.div>
  )
}

export default function FloatingAssistant() {
  const [open, setOpen]       = useState(false)
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  // Auto-scroll to latest message
  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading, open])

  // Focus input when chat opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 320)
  }, [open])

  async function send(text) {
    const content = (text || input).trim()
    if (!content || loading) return
    setInput('')

    const userMsg = { role: 'user', content }
    const history = [...messages, userMsg]
    setMessages(history)
    setLoading(true)

    try {
      // Send only non-welcome messages (skip initial assistant greeting)
      const apiMessages = history.filter(
        (m, i) => !(i === 0 && m.role === 'assistant')
      )
      const { data } = await apiClient.post('/chat', { messages: apiMessages })
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "⚠️ Couldn't reach the assistant right now. Please try again in a moment.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  function reset() {
    setMessages([WELCOME])
    setInput('')
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.93 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className="mb-3 w-[calc(100vw-3rem)] sm:w-84 max-w-sm flex flex-col glass-strong rounded-2xl shadow-glass-xl overflow-hidden border border-white/20"
            style={{ height: 460 }}
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan to-violet flex items-center justify-center shadow-glow">
                    <FiShield size={13} className="text-base-900" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-safe border border-base-900" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">ScamShield Assistant</p>
                  <p className="text-[10px] text-safe font-mono">● Online</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={reset}
                  title="New conversation"
                  className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <FiRefreshCw size={13} />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <FiX size={15} />
                </button>
              </div>
            </div>

            {/* ── Messages ── */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 scrollbar-thin">
              {messages.map((msg, i) => (
                <MessageBubble key={i} msg={msg} isLast={i === messages.length - 1} />
              ))}
              <AnimatePresence>
                {loading && <TypingIndicator />}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>

            {/* ── Suggested prompts (only shown when only welcome message exists) ── */}
            <AnimatePresence>
              {messages.length === 1 && !loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-3 pb-2 flex flex-wrap gap-1.5 shrink-0"
                >
                  {SUGGESTED.map(s => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-[10px] px-2.5 py-1 rounded-full border border-cyan/20 bg-cyan/5 text-cyan/80 hover:bg-cyan/15 hover:text-cyan transition-colors font-mono"
                    >
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Input ── */}
            <div className="px-3 pb-3 shrink-0">
              <div className="flex items-center gap-2 bg-white/10 rounded-xl border border-white/20 focus-within:border-cyan transition-colors px-3 py-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask about scams, red flags…"
                  disabled={loading}
                  className="flex-1 bg-transparent text-xs text-white placeholder-slate-400 outline-none disabled:opacity-50 font-medium"
                />
                <button
                  onClick={() => send()}
                  disabled={!input.trim() || loading}
                  className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00F5D4] to-[#22D3EE] flex items-center justify-center text-slate-950 font-bold disabled:opacity-40 hover:scale-105 transition-transform shrink-0 shadow-[0_0_12px_rgba(0,245,212,0.5)]"
                >
                  <FiSend size={12} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toggle button ── */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen(o => !o)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00F5D4] via-[#22D3EE] to-[#34D399] flex items-center justify-center text-slate-950 font-bold shadow-[0_0_30px_rgba(0,245,212,0.7)] hover:shadow-[0_0_50px_rgba(0,245,212,0.9)] relative"
        aria-label="Open ScamShield assistant"
      >
        {/* Notification ring when closed */}
        {!open && (
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-cyan"
            animate={{ scale: [1, 1.35, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 2.2, repeat: Infinity }}
          />
        )}
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? 'close' : 'open'}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {open ? <FiX size={24} /> : <FiShield size={24} />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
