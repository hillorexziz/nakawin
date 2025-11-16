import React, { useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Notification({ id, type='info', title, message, onClose }) {
  useEffect(()=> {
    const t = setTimeout(()=> onClose && onClose(id), 5000)
    return ()=> clearTimeout(t)
  }, [id, onClose])

  const bg = type==='success' ? 'bg-green-600/80' : type==='error' ? 'bg-red-600/80' : 'bg-white/6'

  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }} className={`notification ${bg} glass p-3 rounded-lg`}>
      <div className="flex justify-between items-start gap-3">
        <div>
          <div className="font-semibold">{title}</div>
          <div className="text-sm opacity-80">{message}</div>
        </div>
        <button onClick={()=> onClose && onClose(id)}>✖</button>
      </div>
      <div className="life" />
    </motion.div>
  )
}
