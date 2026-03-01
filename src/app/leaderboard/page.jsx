"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const PLAYERS = [
  { rank: 1,  name: "Alex K.",     avatar: "🦊", points: 340, captured: 12, streak: 5,  badge: "👑" },
  { rank: 2,  name: "Jordan M.",   avatar: "🐺", points: 290, captured: 10, streak: 3,  badge: "🥈" },
  { rank: 3,  name: "Sam R.",      avatar: "🦅", points: 255, captured: 9,  streak: 7,  badge: "🥉" },
  { rank: 4,  name: "You",         avatar: "⚡", points: 120, captured: 4,  streak: 2,  badge: null, isMe: true },
  { rank: 5,  name: "Casey T.",    avatar: "🐉", points: 110, captured: 4,  streak: 1,  badge: null },
  { rank: 6,  name: "Morgan L.",   avatar: "🦋", points: 95,  captured: 3,  streak: 0,  badge: null },
  { rank: 7,  name: "Riley W.",    avatar: "🐬", points: 80,  captured: 3,  streak: 2,  badge: null },
  { rank: 8,  name: "Drew P.",     avatar: "🦁", points: 65,  captured: 2,  streak: 0,  badge: null },
];

const MAX_PTS = 340;

const TABS = ["Global", "Friends", "Nearby"];

export default function LeaderboardPage() {
  const [tab, setTab] = useState("Global");

  const top3 = PLAYERS.slice(0, 3);
  const rest  = PLAYERS.slice(3);

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100"
         style={{ fontFamily: "'Syne', 'DM Sans', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .podium-glow-1 { box-shadow: 0 0 32px rgba(250,204,21,0.25); }
        .podium-glow-2 { box-shadow: 0 0 24px rgba(148,163,184,0.2); }
        .podium-glow-3 { box-shadow: 0 0 20px rgba(180,120,60,0.2); }

        .me-row { box-shadow: 0 0 0 1px rgba(74,222,128,0.3), 0 4px 24px rgba(74,222,128,0.1); }

        .bar-fill {
          transition: width 1s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.4s ease both; }

        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(74,222,128,0.4); }
          70%  { box-shadow: 0 0 0 8px rgba(74,222,128,0); }
          100% { box-shadow: 0 0 0 0 rgba(74,222,128,0); }
        }
        .pulse-ring { animation: pulse-ring 2s infinite; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#080c14]/90 backdrop-blur-md border-b border-white/5 px-4 pt-5 pb-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/hunts" className="text-slate-500 hover:text-slate-300 transition-colors text-lg">←</a>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight leading-none"
                  style={{ fontFamily: "Syne, sans-serif", letterSpacing: "-0.02em" }}>
                PinDrop<span className="text-emerald-400">.Tech</span>
              </h1>
              <p className="text-slate-500 text-xs mt-0.5">Leaderboard</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-xs">Your rank</p>
            <p className="text-emerald-400 font-extrabold text-xl leading-none">#4</p>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-6 pb-24">

        {/* Tabs */}
        <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-6">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                tab === t
                  ? "bg-emerald-400 text-slate-900"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Podium */}
        <div className="flex items-end justify-center gap-3 mb-8">
          {/* 2nd */}
          <div className="flex flex-col items-center gap-2 fade-up" style={{ animationDelay: "100ms" }}>
            <div className="text-2xl">{top3[1].avatar}</div>
            <p className="text-slate-300 text-xs font-semibold text-center w-16 truncate">{top3[1].name}</p>
            <p className="text-slate-400 text-xs font-bold">{top3[1].points}pts</p>
            <div className="w-16 h-20 rounded-t-xl bg-gradient-to-t from-slate-700 to-slate-600 podium-glow-2 flex items-start justify-center pt-2">
              <span className="text-lg">🥈</span>
            </div>
          </div>

          {/* 1st */}
          <div className="flex flex-col items-center gap-2 fade-up" style={{ animationDelay: "0ms" }}>
            <div className="text-3xl">{top3[0].avatar}</div>
            <p className="text-slate-100 text-xs font-bold text-center w-16 truncate">{top3[0].name}</p>
            <p className="text-emerald-400 text-xs font-extrabold">{top3[0].points}pts</p>
            <div className="w-16 h-28 rounded-t-xl bg-gradient-to-t from-yellow-600/40 to-yellow-500/20 podium-glow-1 flex items-start justify-center pt-2">
              <span className="text-xl">👑</span>
            </div>
          </div>

          {/* 3rd */}
          <div className="flex flex-col items-center gap-2 fade-up" style={{ animationDelay: "200ms" }}>
            <div className="text-2xl">{top3[2].avatar}</div>
            <p className="text-slate-300 text-xs font-semibold text-center w-16 truncate">{top3[2].name}</p>
            <p className="text-slate-400 text-xs font-bold">{top3[2].points}pts</p>
            <div className="w-16 h-14 rounded-t-xl bg-gradient-to-t from-orange-900/50 to-orange-800/30 podium-glow-3 flex items-start justify-center pt-2">
              <span className="text-lg">🥉</span>
            </div>
          </div>
        </div>

        {/* Rest of leaderboard */}
        <div className="flex flex-col gap-2">
          <p className="text-slate-600 text-xs uppercase tracking-widest mb-1">Rankings</p>

          {rest.map((p, i) => (
            <div
              key={p.rank}
              className={`
                fade-up rounded-2xl p-3 flex items-center gap-3 border
                ${p.isMe
                  ? "bg-emerald-500/5 border-emerald-500/20 me-row pulse-ring"
                  : "bg-white/[0.03] border-white/5"
                }
              `}
              style={{ animationDelay: `${(i + 3) * 60}ms` }}
            >
              {/* Rank */}
              <div className={`w-7 text-center font-extrabold text-sm ${p.isMe ? "text-emerald-400" : "text-slate-600"}`}>
                #{p.rank}
              </div>

              {/* Avatar */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${p.isMe ? "bg-emerald-500/10" : "bg-white/5"}`}>
                {p.avatar}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className={`font-bold text-sm leading-tight ${p.isMe ? "text-emerald-300" : "text-slate-200"}`}
                   style={{ fontFamily: "Syne, sans-serif" }}>
                  {p.name} {p.isMe && <span className="text-emerald-600 text-xs font-normal">(you)</span>}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {/* Progress bar */}
                  <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bar-fill"
                      style={{
                        width: `${(p.points / MAX_PTS) * 100}%`,
                        background: p.isMe
                          ? "linear-gradient(90deg,#4ade80,#22d3ee)"
                          : "linear-gradient(90deg,#334155,#475569)"
                      }}
                    />
                  </div>
                  <span className="text-slate-600 text-[10px] shrink-0">{p.captured} spots</span>
                </div>
              </div>

              {/* Points */}
              <div className={`text-right shrink-0 ${p.isMe ? "text-emerald-400" : "text-slate-400"}`}>
                <p className="font-extrabold text-sm">{p.points}</p>
                <p className="text-[10px] text-slate-600">pts</p>
              </div>

              {/* Streak */}
              {p.streak > 0 && (
                <div className="shrink-0 text-center">
                  <p className="text-xs">🔥</p>
                  <p className="text-[10px] text-orange-400 font-bold">{p.streak}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 inset-x-0 bg-[#080c14]/95 backdrop-blur-md border-t border-white/5 px-4 py-3">
        <div className="max-w-lg mx-auto flex gap-3">
          <a href="/hunts" className="flex-1">
            <Button variant="outline"
              className="w-full border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 rounded-xl h-11">
              🎯 Hunt List
            </Button>
          </a>
          <a href="/map" className="flex-1">
            <Button
              className="w-full rounded-xl h-11 font-bold text-slate-900"
              style={{ background: "linear-gradient(135deg,#4ade80,#22d3ee)" }}>
              🗺️ View Map
            </Button>
          </a>
        </div>
      </div>

    </div>
  );
}
