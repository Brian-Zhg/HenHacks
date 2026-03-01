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
  const [completedHuntIds, setCompletedHuntIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('capturedIds');
    if (saved) setCompletedHuntIds(JSON.parse(saved));

    const handleStorage = () => {
      const saved = localStorage.getItem('capturedIds');
      if (saved) setCompletedHuntIds(JSON.parse(saved));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <div className="flex h-screen bg-[#f4f7f4] text-slate-800 overflow-hidden"
         style={{ fontFamily: "'Syne', 'DM Sans', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
      `}</style>

      {/* Sidebar */}
      <div className="w-80 flex-shrink-0 flex flex-col border-r border-black/5 overflow-hidden bg-[#f4f7f4]">
        <div className="p-4 border-b border-black/5">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-xl font-extrabold text-emerald-500"
                style={{ fontFamily: "Syne, sans-serif" }}>
              PinDrop<span className="text-slate-700">.Tech</span>
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
          onHuntSelect={setSelectedHunt}
          completedHuntIds={completedHuntIds}
        />

        {/* Hunt List button */}
        <a href="/hunts"
          className="absolute bottom-10 right-16 z-50 bg-emerald-400 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-2xl text-sm shadow-xl transition-colors">
          🎯 Hunt List
        </a>

        {/* Selected hunt card */}
        {selectedHunt && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white border border-black/10 rounded-2xl p-4 w-80 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-bold text-slate-800" style={{ fontFamily: "Syne, sans-serif" }}>{selectedHunt.title}</h2>
                <p className="text-slate-400 text-sm">{selectedHunt.address}</p>
              </div>
              <span className="text-emerald-500 font-bold text-lg">{selectedHunt.points}pts</span>
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
