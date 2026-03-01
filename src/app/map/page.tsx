"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { hunts } from "@/data/hunts"
import type { Hunt } from "@/data/hunts"

const HuntMap = dynamic(() => import("@/components/HuntMap"), { ssr: false })

const difficultyColor: Record<string, string> = {
  easy: "text-green-400 bg-green-400/10",
  medium: "text-yellow-400 bg-yellow-400/10",
  hard: "text-red-400 bg-red-400/10",
}

export default function MapPage() {
  const [selectedHunt, setSelectedHunt] = useState<Hunt | null>(null)
  const [completedHuntIds, setCompletedHuntIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('capturedIds');
    if (saved) setCompletedHuntIds(JSON.parse(saved));

    // Listen for updates from hunts page
    const handleStorage = () => {
      const saved = localStorage.getItem('capturedIds');
      if (saved) setCompletedHuntIds(JSON.parse(saved));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);  

  return (
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">
      <div className="w-80 flex-shrink-0 flex flex-col border-r border-zinc-800 overflow-hidden">
        <div className="p-4 border-b border-zinc-800">
          <h1 className="text-xl font-bold text-orange-400">NYC Hunt</h1>
          <p className="text-zinc-400 text-sm mt-1">
            {hunts.length} locations · {completedHuntIds.length} completed
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
                className={`w-full text-left p-4 border-b border-zinc-800 transition-colors hover:bg-zinc-900 ${isSelected ? "bg-zinc-900 border-l-2 border-l-orange-400" : ""} ${isCompleted ? "border-l-2 border-l-emerald-500" : ""}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm truncate ${isCompleted ? "line-through text-zinc-500" : ""}`}>
                      {hunt.title}
                    </p>
                    <p className="text-zinc-500 text-xs mt-0.5">{hunt.borough}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-orange-400 text-sm font-bold">{hunt.points}pts</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${difficultyColor[hunt.difficulty]}`}>
                      {hunt.difficulty}
                    </span>
                  </div>
                </div>
                {isSelected && (
                  <p className="text-zinc-400 text-xs mt-2 italic leading-relaxed">
                    "{hunt.clue}"
                  </p>
                )}
              </button>
            )
          })}
        </div>
      </div>
      <div className="flex-1 relative">
        <HuntMap
          hunts={hunts}
          selectedHunt={selectedHunt}
          onHuntSelect={setSelectedHunt}
          completedHuntIds={completedHuntIds}
        />
        {selectedHunt && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-700 rounded-xl p-4 w-80 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-bold text-white">{selectedHunt.title}</h2>
                <p className="text-zinc-400 text-sm">{selectedHunt.address}</p>
              </div>
              <span className="text-orange-400 font-bold text-lg">{selectedHunt.points}pts</span>
            </div>
            <p className="text-zinc-300 text-sm mt-2">{selectedHunt.description}</p>
            <a href="/hunts"
  className="mt-3 block w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg text-sm transition-colors text-center">
  Start this Hunt
</a>
          </div>
        )}
      </div>
    </div>
  )
}