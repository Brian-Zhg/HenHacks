"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { hunts } from "@/data/hunts"
import type { Hunt } from "@/data/hunts"

const HuntMap = dynamic(() => import("@/components/HuntMap"), { ssr: false })

const difficultyColor: Record<string, string> = {
  easy: "text-green-600 bg-green-500/10",
  medium: "text-yellow-600 bg-yellow-500/10",
  hard: "text-red-500 bg-red-500/10",
}

export default function MapPage() {
  const [selectedHunt, setSelectedHunt] = useState<Hunt | null>(null)
  const [completedHuntIds, setCompletedHuntIds] = useState<string[]>([])
  const [showList, setShowList] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('capturedIds')
    if (saved) setCompletedHuntIds(JSON.parse(saved))

    const handleStorage = () => {
      const saved = localStorage.getItem('capturedIds')
      if (saved) setCompletedHuntIds(JSON.parse(saved))
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#f4f7f4] text-slate-800 overflow-hidden"
         style={{ fontFamily: "'Syne', 'DM Sans', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(100%); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .slide-up { animation: slideUp 0.3s ease both; }
      `}</style>

      {/* Sidebar — hidden on mobile, visible on md+ */}
      <div className="hidden md:flex w-80 flex-shrink-0 flex-col border-r border-black/5 overflow-hidden bg-[#f4f7f4]">
        <div className="p-4 border-b border-black/5">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-xl font-extrabold text-emerald-500"
                style={{ fontFamily: "Syne, sans-serif" }}>
              PinDrop<span className="text-slate-700">.NYC</span>
            </h1>
            <a href="/hunts" className="text-xs text-slate-500 hover:text-slate-800 border border-black/10 bg-white px-3 py-1 rounded-lg transition-colors">
              ← Hunts
            </a>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            {hunts.length} locations · <span className="text-emerald-500 font-semibold">{completedHuntIds.length} completed</span>
          </p>
        </div>

        <div className="overflow-y-auto flex-1">
          {hunts.map((hunt) => {
            const isCompleted = completedHuntIds.includes(hunt.id)
            const isSelected = selectedHunt?.id === hunt.id
            return (
              <button
                key={hunt.id}
                onClick={() => setSelectedHunt(hunt)}
                className={`w-full text-left p-4 border-b border-black/5 transition-colors hover:bg-white ${
                  isSelected ? "bg-white border-l-2 border-l-emerald-400" : ""
                } ${isCompleted && !isSelected ? "border-l-2 border-l-emerald-300" : ""}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm truncate ${isCompleted ? "line-through text-slate-400" : "text-slate-700"}`}>
                      {hunt.title}
                    </p>
                    <p className="text-slate-400 text-xs mt-0.5">{hunt.borough}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-emerald-500 text-sm font-bold">{hunt.points}pts</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${difficultyColor[hunt.difficulty]}`}>
                      {hunt.difficulty}
                    </span>
                  </div>
                </div>
                {isSelected && (
                  <p className="text-slate-400 text-xs mt-2 italic leading-relaxed">
                    "{hunt.clue}"
                  </p>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <HuntMap
          hunts={hunts}
          selectedHunt={selectedHunt}
          onHuntSelect={(hunt) => { setSelectedHunt(hunt); setShowList(false); }}
          completedHuntIds={completedHuntIds}
        />

        {/* Mobile top bar */}
        <div className="md:hidden absolute top-0 inset-x-0 z-50 bg-[#f4f7f4]/90 backdrop-blur-md border-b border-black/5 px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-extrabold text-emerald-500" style={{ fontFamily: "Syne, sans-serif" }}>
            PinDrop<span className="text-slate-700">.NYC</span>
          </h1>
          <div className="flex items-center gap-2">
            <a href="/hunts" className="text-xs text-slate-500 border border-black/10 bg-white px-3 py-1.5 rounded-lg">
              ← Hunts
            </a>
            <button
              onClick={() => setShowList(v => !v)}
              className="text-xs font-bold bg-emerald-400 text-white px-3 py-1.5 rounded-lg"
            >
              {showList ? "✕ Close" : "☰ List"}
            </button>
          </div>
        </div>

        {/* Mobile hunt list bottom sheet */}
        {showList && (
          <div className="md:hidden slide-up absolute inset-x-0 bottom-0 z-40 bg-[#f4f7f4] rounded-t-3xl shadow-2xl border-t border-black/5"
               style={{ maxHeight: "70vh", overflowY: "auto" }}>
            <div className="sticky top-0 bg-[#f4f7f4] px-4 pt-4 pb-2 border-b border-black/5">
              <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-3" />
              <p className="text-slate-400 text-xs">
                {hunts.length} locations · <span className="text-emerald-500 font-semibold">{completedHuntIds.length} completed</span>
              </p>
            </div>
            {hunts.map((hunt) => {
              const isCompleted = completedHuntIds.includes(hunt.id)
              const isSelected = selectedHunt?.id === hunt.id
              return (
                <button
                  key={hunt.id}
                  onClick={() => { setSelectedHunt(hunt); setShowList(false); }}
                  className={`w-full text-left p-4 border-b border-black/5 transition-colors hover:bg-white ${
                    isSelected ? "bg-white border-l-2 border-l-emerald-400" : ""
                  } ${isCompleted && !isSelected ? "border-l-2 border-l-emerald-300" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm truncate ${isCompleted ? "line-through text-slate-400" : "text-slate-700"}`}>
                        {hunt.title}
                      </p>
                      <p className="text-slate-400 text-xs mt-0.5">{hunt.borough}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="text-emerald-500 text-sm font-bold">{hunt.points}pts</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${difficultyColor[hunt.difficulty]}`}>
                        {hunt.difficulty}
                      </span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {/* Desktop Hunt List button */}
        <a href="/hunts"
          className="hidden md:block absolute bottom-10 right-16 z-50 bg-emerald-400 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-2xl text-sm shadow-xl transition-colors">
          🎯 Hunt List
        </a>

        {/* Selected hunt card */}
        {selectedHunt && !showList && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white border border-black/10 rounded-2xl p-4 w-80 shadow-xl z-30">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0 pr-2">
                <h2 className="font-bold text-slate-800 truncate" style={{ fontFamily: "Syne, sans-serif" }}>{selectedHunt.title}</h2>
                <p className="text-slate-400 text-sm">{selectedHunt.address}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-emerald-500 font-bold text-lg">{selectedHunt.points}pts</span>
                <button onClick={() => setSelectedHunt(null)} className="text-slate-400 hover:text-slate-600 text-lg leading-none">✕</button>
              </div>
            </div>
            <p className="text-slate-500 text-sm mt-2">{selectedHunt.description}</p>
            <a href="/hunts"
              className="mt-3 block w-full text-center font-semibold py-2 rounded-xl text-sm text-white transition-colors hover:opacity-80"
              style={{ background: "linear-gradient(135deg,#34d399,#22d3ee)" }}>
              Start this Hunt
            </a>
          </div>
        )}
      </div>
    </div>
  )
}