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
            className={cn(
              'rounded-xl border border-dashed px-5 py-9 flex flex-col items-center justify-center text-center transition-colors duration-200',
              dragging
                ? 'border-cyan bg-cyan/10'
                : 'border-white/25 bg-white/[0.02]'
            )}
          >
            <Icon size={28} className="text-slate-300 mb-4" aria-hidden="true" />
            <p className="font-medium text-white">Drop your file here</p>
            <p className="text-sm text-slate-300 mt-1">{hint}</p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-5 px-5 py-3 rounded-lg border border-white/30 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Browse files
            </button>
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              className="hidden"
              onChange={(e) => {
                const selected = e.target.files?.[0]
                if (selected) onFile(selected)
                e.target.value = ''
              }}
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
