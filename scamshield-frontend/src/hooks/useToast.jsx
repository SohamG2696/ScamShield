import { createContext, useCallback, useContext, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiCheckCircle, FiAlertTriangle, FiXCircle, FiInfo, FiX } from 'react-icons/fi'

const ToastContext = createContext(null)

const ICONS = {
  success: FiCheckCircle,
  error: FiXCircle,
  warning: FiAlertTriangle,
  info: FiInfo,
}

const ACCENTS = {
  success: 'border-safe/40 text-safe',
  error: 'border-danger/40 text-danger',
  warning: 'border-warn/40 text-warn',
  info: 'border-cyan/40 text-cyan',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((toast) => toast.id !== id))
  }, [])

  const push = useCallback(
    (message, { type = 'info', duration = 4000, action } = {}) => {
      const id = Math.random().toString(36).slice(2)
      setToasts((t) => [...t, { id, message, type, action }])
      if (duration) setTimeout(() => dismiss(id), duration)
      return id
    },
    [dismiss]
  )

  return (
    <ToastContext.Provider value={{ push, dismiss }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-3 w-[92vw] max-w-sm">
        <AnimatePresence>
          {toasts.map((toast) => {
            const Icon = ICONS[toast.type] || FiInfo
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 24, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                className={`glass-strong rounded-xl p-4 flex items-start gap-3 shadow-glass border ${ACCENTS[toast.type]}`}
              >
                <Icon className="shrink-0 mt-0.5" size={18} />
                <div className="flex-1 text-sm text-slate-200">
                  {toast.message}
                  {toast.action && (
                    <button
                      onClick={() => {
                        toast.action.onClick()
                        dismiss(toast.id)
                      }}
                      className="block mt-1.5 text-cyan font-medium hover:underline"
                    >
                      {toast.action.label}
                    </button>
                  )}
                </div>
                <button
                  onClick={() => dismiss(toast.id)}
                  className="shrink-0 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label="Dismiss"
                >
                  <FiX size={16} />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
