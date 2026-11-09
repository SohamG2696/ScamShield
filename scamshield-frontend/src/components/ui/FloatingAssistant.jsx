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
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>')
}

function MessageBubble({ msg, isLast }) {
  const isUser = msg.role === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="shrink-0 w-6 h-6 rounded-lg bg-[#e8c48d]/15 border border-[#e8c48d]/30 flex items-center justify-center text-[#e8c48d]">
          <FiShield size={12} />
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
          isUser
            ? 'bg-[#1a293c] border border-white/15 text-white rounded-tr-sm'
            : 'bg-[#0c1521] border border-white/10 text-slate-200 rounded-tl-sm'
        }`}
        dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.content) }}
      />
    </motion.div>
  )
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex gap-2 items-end"
    >
      <div className="shrink-0 w-6 h-6 rounded-lg bg-[#e8c48d]/15 border border-[#e8c48d]/30 flex items-center justify-center text-[#e8c48d]">
        <FiShield size={12} />
      </div>
      <div className="bg-[#0c1521] border border-white/10 rounded-2xl rounded-tl-sm px-3 py-2 flex gap-1.5 items-center">
        {[0, 0.15, 0.3].map((delay, i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[#e8c48d]/70"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, delay }}
          />
        ))}
      </div>
    </motion.div>
  )
}

export default function FloatingAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll to latest message
  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading, open])

  // Focus input when chat opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 250)
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
    } catch {
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
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-3 w-[calc(100vw-3rem)] sm:w-85 max-w-sm flex flex-col bg-[#111c2be8] border border-[#a6bbd336] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden backdrop-blur-md"
            style={{ height: 460 }}
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0 bg-[#0d1622]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#e8c48d]/15 border border-[#e8c48d]/30 flex items-center justify-center text-[#e8c48d]">
                  <FiShield size={14} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">ScamShield Assistant</p>
                  <p className="text-[10px] text-slate-400 font-mono">Cybersecurity guide</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={reset}
                  title="New conversation"
                  aria-label="New conversation"
                  className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <FiRefreshCw size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  title="Close assistant"
                  aria-label="Close assistant"
                  className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <FiX size={14} />
                </button>
              </div>
            </div>

            {/* ── Messages ── */}
            <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3 scrollbar-thin">
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
                      type="button"
                      onClick={() => send(s)}
                      className="text-[10px] px-2.5 py-1 rounded-md border border-white/10 bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] hover:border-[#e8c48d]/40 transition-colors font-mono"
                    >
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Input ── */}
            <div className="px-3 pb-3 shrink-0">
              <div className="flex items-center gap-2 bg-[#09111cb8] rounded-xl border border-[#7a94b629] focus-within:border-[#e8c48d] transition-colors px-3 py-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask about scams, red flags…"
                  disabled={loading}
                  className="flex-1 bg-transparent text-xs text-white placeholder-slate-400 outline-none disabled:opacity-50 font-normal"
                />
                <button
                  type="button"
                  onClick={() => send()}
                  disabled={!input.trim() || loading}
                  aria-label="Send message"
                  className="w-7 h-7 rounded-lg bg-[#e8c48d] hover:bg-[#dfc392] flex items-center justify-center text-slate-950 font-bold disabled:opacity-30 transition-colors shrink-0"
                >
                  <FiSend size={12} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toggle button (matched to ScamShield theme, no neon glow) ── */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(o => !o)}
        className="w-13 h-13 p-3.5 rounded-full bg-[#111c2be8] border border-[#354151] hover:border-[#e8c48d]/60 text-[#e8c48d] flex items-center justify-center shadow-xl shadow-black/50 transition-colors relative"
        aria-label={open ? 'Close ScamShield assistant' : 'Open ScamShield assistant'}
        title="ScamShield AI Assistant"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? 'close' : 'open'}
            initial={{ rotate: -45, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 45, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {open ? <FiX size={20} /> : <FiShield size={20} />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
