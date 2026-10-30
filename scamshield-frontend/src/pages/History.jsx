import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiTrash2, FiFileText, FiUpload, FiImage, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import GlassCard from '../components/ui/GlassCard'
import { dummyHistory } from '../utils/dummyData'
import { useToast } from '../hooks/useToast.jsx'

const FILTERS = ['all', 'scam', 'genuine']
const PAGE_SIZE = 4
const METHOD_ICON = { text: FiFileText, pdf: FiUpload, image: FiImage }

export default function History() {
  const [items, setItems] = useState(dummyHistory)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const { push } = useToast()

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesFilter = filter === 'all' || item.verdict === filter
      const matchesQuery =
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.company.toLowerCase().includes(query.toLowerCase())
      return matchesFilter && matchesQuery
    })
  }, [items, query, filter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleDelete = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
    push('Scan removed from history.', { type: 'info', duration: 2500 })
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-display font-semibold">Scan history</h1>
        <p className="text-slate-400 mt-1.5">Every posting you've checked, in one place.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan font-bold" size={16} />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1)
            }}
            placeholder="Search by title or company…"
            className="w-full bg-white/[0.08] border border-white/25 text-white placeholder:text-slate-400 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/40 focus:bg-white/[0.12] transition-all"
          />
        </div>
        <div className="flex gap-1.5 glass rounded-xl p-1.5 border border-white/20">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f)
                setPage(1)
              }}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all ${
                filter === f
                  ? 'bg-gradient-to-r from-cyan to-emerald text-slate-950 shadow-[0_0_15px_rgba(0,245,212,0.5)]'
                  : 'text-slate-200 hover:text-white hover:bg-white/15'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {paged.length === 0 ? (
        <GlassCard hover={false} className="p-14 text-center text-slate-500">
          No scans match your filters yet.
        </GlassCard>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {paged.map((item, i) => {
              const MethodIcon = METHOD_ICON[item.method]
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <GlassCard hover={false} className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg glass flex items-center justify-center shrink-0">
                      <MethodIcon size={16} className="text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.title}</p>
                      <p className="text-xs text-slate-500 truncate">{item.company} · {item.date}</p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                        item.verdict === 'scam' ? 'bg-danger/10 text-danger' : 'bg-safe/10 text-safe'
                      }`}
                    >
                      {item.verdict === 'scam' ? 'Scam' : 'Genuine'}
                    </span>
                    <span className="text-xs font-mono text-slate-500 hidden sm:inline shrink-0">
                      {Math.round(item.confidence * 100)}%
                    </span>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-500 hover:text-danger transition-colors shrink-0"
                      aria-label="Delete scan"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </GlassCard>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-9 h-9 rounded-lg glass flex items-center justify-center disabled:opacity-30 hover:text-cyan transition-colors"
          >
            <FiChevronLeft size={16} />
          </button>
          <span className="text-sm font-mono text-slate-400">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="w-9 h-9 rounded-lg glass flex items-center justify-center disabled:opacity-30 hover:text-cyan transition-colors"
          >
            <FiChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
