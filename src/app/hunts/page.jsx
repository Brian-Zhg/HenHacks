"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";

// ── Mock data (swap with your real API/context later) ──────────────────────
const LANDMARKS = [
  { id: 1, name: "City Hall",         category: "Architecture", points: 10, emoji: "🏛️", captured: true,  distance: "0.3 mi", description: "Capture a selfie in front of the main entrance clock tower." },
  { id: 2, name: "Bethesda Fountain", category: "Nature",       points: 15, emoji: "⛲", captured: false, distance: "0.7 mi", description: "Snap a selfie at the iconic Bethesda Fountain." },
  { id: 3, name: "Historic Library",  category: "Culture",      points: 20, emoji: "📚", captured: false, distance: "1.1 mi", description: "Pose with the famous stone lions guarding the entrance." },
  { id: 4, name: "Old Train Station", category: "History",      points: 25, emoji: "🚂", captured: true,  distance: "1.4 mi", description: "Find the vintage departure board inside the grand hall." },
  { id: 5, name: "Harbor Lighthouse", category: "Maritime",     points: 30, emoji: "🗼", captured: false, distance: "2.2 mi", description: "Selfie at the base of the historic lighthouse." },
  { id: 6, name: "War Memorial",      category: "History",      points: 20, emoji: "🔥", captured: false, distance: "0.9 mi", description: "Pay respects and capture the eternal flame." },
];

const CATEGORIES = ["All", "Architecture", "Nature", "Culture", "History", "Maritime"];

const CATEGORY_COLORS = {
  Architecture: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Nature:       "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Culture:      "bg-violet-500/10 text-violet-400 border-violet-500/20",
  History:      "bg-red-500/10 text-red-400 border-red-500/20",
  Maritime:     "bg-sky-500/10 text-sky-400 border-sky-500/20",
};

// ── Component ───────────────────────────────────────────────────────────────
export default function HuntListPage({ onSelectLandmark }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showCaptured, setShowCaptured] = useState(true);

  const captured = LANDMARKS.filter(l => l.captured).length;
  const totalPts  = LANDMARKS.filter(l => l.captured).reduce((s, l) => s + l.points, 0);
  const maxPts    = LANDMARKS.reduce((s, l) => s + l.points, 0);
  const progress  = Math.round((captured / LANDMARKS.length) * 100);

  const visible = LANDMARKS.filter(l => {
    if (!showCaptured && l.captured) return false;
    if (filter !== "All" && l.category !== filter) return false;
    if (search && !l.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 font-[system-ui]"
         style={{ fontFamily: "'Syne', 'DM Sans', sans-serif" }}>

      {/* Google Font import via style tag */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .card-hover { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .card-hover:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
        .captured-shimmer { background: repeating-linear-gradient(
          135deg,
          rgba(74,222,128,0.03) 0px,
          rgba(74,222,128,0.03) 1px,
          transparent 1px,
          transparent 8px
        ); }
      `}</style>

      {/* ── Header ── */}
      <header className="sticky top-0 z-20 bg-[#080c14]/90 backdrop-blur-md border-b border-white/5 px-4 pt-5 pb-3">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight leading-none"
                  style={{ fontFamily: "Syne, sans-serif", letterSpacing: "-0.02em" }}>
                ShotCaller<span className="text-emerald-400">.tech</span>
              </h1>
              <p className="text-slate-500 text-xs mt-0.5">Explore · Snap · Conquer</p>
            </div>
            <div className="text-right">
              <p className="text-emerald-400 font-bold text-lg leading-none">{totalPts}
                <span className="text-slate-500 font-normal text-sm"> / {maxPts} pts</span>
              </p>
              <p className="text-slate-500 text-xs mt-0.5">{captured}/{LANDMARKS.length} captured</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #4ade80, #22d3ee)",
              }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4 pb-24">

        {/* ── Search ── */}
        <Input
          placeholder="Search landmarks..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-white/5 border-white/10 text-slate-200 placeholder:text-slate-600 mb-3 h-10 rounded-xl focus-visible:ring-emerald-500/40"
        />

        {/* ── Filter chips ── */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                filter === cat
                  ? "bg-emerald-400 text-slate-900 border-emerald-400"
                  : "bg-white/5 text-slate-400 border-white/10 hover:border-white/20"
              }`}
            >
              {cat}
            </button>
          ))}
          <button
            onClick={() => setShowCaptured(v => !v)}
            className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
              !showCaptured
                ? "bg-slate-700 text-slate-200 border-slate-600"
                : "bg-white/5 text-slate-400 border-white/10 hover:border-white/20"
            }`}
          >
            {showCaptured ? "Hide ✓" : "Show ✓"}
          </button>
        </div>

        {/* ── Section label ── */}
        <p className="text-slate-600 text-xs uppercase tracking-widest mb-3">
          {visible.length} location{visible.length !== 1 ? "s" : ""}
        </p>

        {/* ── Landmark cards ── */}
        <div className="flex flex-col gap-3">
          {visible.map((lm, i) => (
            <Card
              key={lm.id}
              onClick={() => !lm.captured && onSelectLandmark?.(lm)}
              className={`
                card-hover border rounded-2xl overflow-hidden cursor-pointer
                ${lm.captured
                  ? "bg-white/[0.03] border-white/5 captured-shimmer"
                  : "bg-[#0d1520] border-white/10 hover:border-emerald-500/30"
                }
              `}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <CardContent className="p-4 flex gap-4 items-center">

                {/* Emoji bubble */}
                <div className={`
                  w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0
                  ${lm.captured ? "bg-white/5" : "bg-white/[0.06]"}
                `}>
                  {lm.captured ? "✅" : lm.emoji}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className={`font-bold text-base leading-tight ${lm.captured ? "text-slate-500" : "text-slate-100"}`}
                        style={{ fontFamily: "Syne, sans-serif" }}>
                      {lm.name}
                    </h2>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${CATEGORY_COLORS[lm.category]}`}>
                      {lm.category}
                    </span>
                  </div>
                  <p className={`text-xs mt-1 leading-relaxed line-clamp-2 ${lm.captured ? "text-slate-600" : "text-slate-400"}`}>
                    {lm.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-slate-600 text-xs">📍 {lm.distance}</span>
                    {lm.captured && (
                      <span className="text-emerald-600 text-xs font-medium">Captured</span>
                    )}
                  </div>
                </div>

                {/* Points badge */}
                <div className="shrink-0 text-right">
                  {lm.captured ? (
                    <div className="text-slate-600 text-xs font-bold">+{lm.points}</div>
                  ) : (
                    <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl"
                         style={{ background: "linear-gradient(135deg,#4ade8022,#22d3ee22)", border: "1px solid #4ade8033" }}>
                      <span className="text-emerald-400 font-extrabold text-sm leading-none">+{lm.points}</span>
                      <span className="text-emerald-600 text-[9px] mt-0.5">pts</span>
                    </div>
                  )}
                </div>

              </CardContent>
            </Card>
          ))}

          {visible.length === 0 && (
            <div className="text-center text-slate-600 py-16">
              <div className="text-4xl mb-3">🔍</div>
              <p>No landmarks found</p>
            </div>
          )}
        </div>
      </main>

      {/* ── Bottom CTA ── */}
      <div className="fixed bottom-0 inset-x-0 bg-[#080c14]/95 backdrop-blur-md border-t border-white/5 px-4 py-3">
        <div className="max-w-lg mx-auto flex gap-3">
          <Button variant="outline"
            className="flex-1 border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 rounded-xl h-11">
            🗺️ View Map
          </Button>
          <Button
            className="flex-1 rounded-xl h-11 font-bold text-slate-900"
            style={{ background: "linear-gradient(135deg,#4ade80,#22d3ee)" }}>
            🏆 Leaderboard
          </Button>
        </div>
      </div>

    </div>
  );
}
