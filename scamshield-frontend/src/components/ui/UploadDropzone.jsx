import { useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUploadCloud, FiFile, FiX } from 'react-icons/fi'
import { cn } from '../../utils/cn'

export default function UploadDropzone({ accept, file, onFile, onRemove, hint, icon: Icon = FiUploadCloud }) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      setDragging(false)
      const dropped = e.dataTransfer.files?.[0]
      if (dropped) onFile(dropped)
    },
    [onFile]
  )

  return (
    <div>
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragOver={(e) => {
              e.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={cn(
              'cursor-pointer rounded-2xl border-2 border-dashed p-12 flex flex-col items-center justify-center text-center transition-all duration-200',
              dragging
                ? 'border-cyan bg-cyan/15 shadow-[0_0_30px_rgba(0,245,212,0.3)]'
                : 'border-white/30 hover:border-cyan/70 bg-white/[0.07] hover:bg-white/[0.12] shadow-[0_0_20px_rgba(255,255,255,0.05)]'
            )}
          >
            <motion.div
              animate={dragging ? { scale: 1.15, y: -6 } : { scale: 1, y: [0, -8, 0] }}
              transition={dragging ? { type: 'spring', stiffness: 300 } : { duration: 2.4, repeat: Infinity }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan/30 to-violet/30 flex items-center justify-center mb-4 border border-white/20 shadow-[0_0_20px_rgba(0,245,212,0.3)]"
            >
              <Icon size={28} className="text-cyan" />
            </motion.div>
            <p className="font-semibold text-white">Drag &amp; drop, or click to browse</p>
            <p className="text-sm text-slate-300 mt-1">{hint}</p>
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              className="hidden"
              onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
            />
          </motion.div>
        ) : (
          <motion.div
            key="file"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="rounded-2xl glass-strong p-5 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan/10 flex items-center justify-center shrink-0">
              <FiFile className="text-cyan" size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">{file.name}</p>
              <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(0)} KB</p>
            </div>
            <button
              onClick={onRemove}
              className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-danger transition-colors"
              aria-label="Remove file"
            >
              <FiX size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
