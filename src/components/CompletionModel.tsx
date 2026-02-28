"use client"

import { useState, useEffect } from "react"

interface CompletionModalProps {
  huntTitle: string
  onClose: () => void
}

export default function CompletionModal({ huntTitle, onClose }: CompletionModalProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setTimeout(() => setShow(true), 50)
  }, [])

  const handleClose = () => {
    setShow(false)
    setTimeout(onClose, 300)
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${show ? "opacity-100" : "opacity-0"}`}>
      <div className="absolute inset-0 bg-black/70" onClick={handleClose} />
      <div className={`relative bg-zinc-900 border border-zinc-700 rounded-2xl p-8 w-80 text-center shadow-2xl transition-transform duration-300 ${show ? "scale-100" : "scale-90"}`}>
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-white font-bold text-xl mb-1">Task Completed!</h2>
        <p className="text-zinc-400 text-sm mb-6">{huntTitle}</p>
        <button
          onClick={handleClose}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-lg transition-colors"
        >
          Keep Hunting →
        </button>
      </div>
    </div>
  )
}