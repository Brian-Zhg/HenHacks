"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const GLOBAL_PLAYERS = [
  { rank: 1, name: "Alex K.",   avatar: "🦊", points: 340, captured: 12, streak: 5,  isMe: false },
  { rank: 2, name: "Jack M.",   avatar: "🐺", points: 290, captured: 10, streak: 3,  isMe: false },
  { rank: 3, name: "Sam R.",    avatar: "🦅", points: 255, captured: 9,  streak: 7,  isMe: false },
  { rank: 4, name: "You",       avatar: "⚡", points: 120, captured: 4,  streak: 2,  isMe: true  },
  { rank: 5, name: "Casey T.",  avatar: "🐉", points: 110, captured: 4,  streak: 1,  isMe: false },
  { rank: 6, name: "Morgan L.", avatar: "🦋", points: 95,  captured: 3,  streak: 0,  isMe: false },
  { rank: 7, name: "Riley W.",  avatar: "🐬", points: 80,  captured: 3,  streak: 2,  isMe: false },
  { rank: 8, name: "Drew P.",   avatar: "🦁", points: 65,  captured: 2,  streak: 0,  isMe: false },
];

const ALL_USERS = [
  { name: "Alex K.",   avatar: "🦊", points: 340, captured: 12, streak: 5 },
  { name: "Jack M.",   avatar: "🐺", points: 290, captured: 10, streak: 3 },
  { name: "Sam R.",    avatar: "🦅", points: 255, captured: 9,  streak: 7 },
  { name: "Casey T.",  avatar: "🐉", points: 110, captured: 4,  streak: 1 },
  { name: "Morgan L.", avatar: "🦋", points: 95,  captured: 3,  streak: 0 },
  { name: "Riley W.",  avatar: "🐬", points: 80,  captured: 3,  streak: 2 },
  { name: "Drew P.",   avatar: "🦁", points: 65,  captured: 2,  streak: 0 },
  { name: "Taylor S.", avatar: "🐸", points: 50,  captured: 1,  streak: 0 },
  { name: "Jamie L.",  avatar: "🦄", points: 40,  captured: 1,  streak: 0 },
  { name: "Quinn B.",  avatar: "🐨", points: 30,  captured: 1,  streak: 0 },
];

const TABS = ["Global", "Friends"];

export default function LeaderboardPage() {
  const [tab, setTab] = useState("Global");
  const [search, setSearch] = useState("");
  const [friendSearch, setFriendSearch] = useState("");
  const [addedFriends, setAddedFriends] = useState(["Jack M.", "Casey T.", "Morgan L.", "Drew P."]);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [myPoints, setMyPoints] = useState(0);
  const [myCaptured, setMyCaptured] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('capturedIds');
    if (saved) {
      const ids = JSON.parse(saved);
      import('@/data/hunts').then(({ hunts }) => {
        const captured = hunts.filter(h => ids.includes(h.id));
        setMyCaptured(captured.length);
        setMyPoints(captured.reduce((s, h) => s + h.points, 0));
      });
    }
  }, []);

  const globalPlayers = GLOBAL_PLAYERS
    .map(p => p.isMe ? { ...p, points: myPoints, captured: myCaptured } : p)
    .sort((a, b) => b.points - a.points)
    .map((p, i) => ({ ...p, rank: i + 1 }));

  const friendPlayers = [
    ...ALL_USERS.filter(u => addedFriends.includes(u.name)),
    { name: "You", avatar: "⚡", points: myPoints, captured: myCaptured, streak: 2 }
  ]
    .sort((a, b) => b.points - a.points)
    .map((p, i) => ({ ...p, rank: i + 1, isMe: p.name === "You" }));

  const players = tab === "Global" ? globalPlayers : friendPlayers;
  const top3 = players.slice(0, 3);
  const MAX_PTS = players[0]?.points ?? 1;
  const myRank = players.find(p => p.isMe)?.rank ?? "—";
  const filteredRest = players.slice(3).filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const friendSuggestions = ALL_USERS.filter(u =>
    u.name.toLowerCase().includes(friendSearch.toLowerCase()) &&
    !addedFriends.includes(u.name)
  );

  const addFriend = (name) => {
    setAddedFriends(prev => [...prev, name]);
  };

  return (
    <div className="min-h-screen bg-[#f4f7f4] text-slate-800"
         style={{ fontFamily: "'Syne', 'DM Sans', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .podium-glow-1 { box-shadow: 0 0 32px rgba(250,204,21,0.2); }
        .podium-glow-2 { box-shadow: 0 0 24px rgba(100,116,139,0.15); }
        .podium-glow-3 { box-shadow: 0 0 20px rgba(180,120,60,0.15); }
        .me-row { box-shadow: 0 0 0 1px rgba(16,185,129,0.3), 0 4px 24px rgba(16,185,129,0.08); }
        .bar-fill { transition: width 1s cubic-bezier(0.34, 1.56, 0.64, 1); }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.4s ease both; }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(16,185,129,0.3); }
          70%  { box-shadow: 0 0 0 8px rgba(16,185,129,0); }
          100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); }
        }
        .pulse-ring { animation: pulse-ring 2s infinite; }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .slide-down { animation: slideDown 0.2s ease both; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#f4f7f4]/90 backdrop-blur-md border-b border-black/5 px-4 pt-5 pb-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/hunts" className="text-slate-400 hover:text-slate-600 transition-colors text-lg">←</a>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight leading-none"
                  style={{ fontFamily: "Syne, sans-serif", letterSpacing: "-0.02em" }}>
                PinDrop<span className="text-emerald-500">.NYC</span>
              </h1>
              <p className="text-slate-400 text-xs mt-0.5">Leaderboard</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-xs">Your rank</p>
            <p className="text-emerald-500 font-extrabold text-xl leading-none">#{myRank}</p>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-6 pb-24">

        {/* Tabs */}
        <div className="flex gap-1 bg-black/5 rounded-xl p-1 mb-4">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setSearch(""); }}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                tab === t
                  ? "bg-emerald-400 text-white"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Search bar */}
        <Input
          placeholder={tab === "Friends" ? "Search friends..." : "Search players..."}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-white border-black/10 text-slate-700 placeholder:text-slate-400 mb-4 h-10 rounded-xl focus-visible:ring-emerald-500/40"
        />

        {/* Add Friend button (Friends tab only) */}
        {tab === "Friends" && (
          <div className="mb-4">
            <button
              onClick={() => setShowAddFriend(v => !v)}
              className="w-full py-2.5 rounded-xl text-xs font-semibold border border-dashed border-emerald-400/50 text-emerald-600 hover:bg-emerald-50 transition-all"
            >
              {showAddFriend ? "✕ Close" : "➕ Add a Friend"}
            </button>

            {showAddFriend && (
              <div className="slide-down mt-2 bg-white border border-black/10 rounded-2xl p-4">
                <Input
                  placeholder="Search by name..."
                  value={friendSearch}
                  onChange={e => setFriendSearch(e.target.value)}
                  className="bg-slate-50 border-black/10 text-slate-700 placeholder:text-slate-400 mb-3 h-9 rounded-xl focus-visible:ring-emerald-500/40"
                />
                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                  {friendSuggestions.length === 0 ? (
                    <p className="text-slate-400 text-xs text-center py-4">No users found</p>
                  ) : (
                    friendSuggestions.map(u => (
                      <div key={u.name} className="flex items-center gap-3 p-2 rounded-xl bg-slate-50">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-lg">
                          {u.avatar}
                        </div>
                        <div className="flex-1">
                          <p className="text-slate-700 text-sm font-semibold">{u.name}</p>
                          <p className="text-slate-400 text-xs">{u.points} pts</p>
                        </div>
                        <button
                          onClick={() => addFriend(u.name)}
                          className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 transition-all"
                        >
                          Add
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Podium */}
        {!search && top3.length === 3 && (
          <div className="flex items-end justify-center gap-3 mb-8">
            <div className="flex flex-col items-center gap-2 fade-up" style={{ animationDelay: "100ms" }}>
              <div className="text-2xl">{top3[1].avatar}</div>
              <p className="text-slate-500 text-xs font-semibold text-center w-16 truncate">{top3[1].name}</p>
              <p className="text-slate-500 text-xs font-bold">{top3[1].points}pts</p>
              <div className="w-16 h-20 rounded-t-xl bg-gradient-to-t from-slate-400 to-slate-300 podium-glow-2 flex items-start justify-center pt-2">
                <span className="text-lg">🥈</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 fade-up" style={{ animationDelay: "0ms" }}>
              <div className="text-3xl">{top3[0].avatar}</div>
              <p className="text-slate-700 text-xs font-bold text-center w-16 truncate">{top3[0].name}</p>
              <p className="text-emerald-500 text-xs font-extrabold">{top3[0].points}pts</p>
              <div className="w-16 h-28 rounded-t-xl bg-gradient-to-t from-yellow-300/80 to-yellow-100 podium-glow-1 flex items-start justify-center pt-2">
                <span className="text-xl">👑</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 fade-up" style={{ animationDelay: "200ms" }}>
              <div className="text-2xl">{top3[2].avatar}</div>
              <p className="text-slate-500 text-xs font-semibold text-center w-16 truncate">{top3[2].name}</p>
              <p className="text-slate-500 text-xs font-bold">{top3[2].points}pts</p>
              <div className="w-16 h-14 rounded-t-xl bg-gradient-to-t from-orange-300/80 to-orange-200/60 podium-glow-3 flex items-start justify-center pt-2">
                <span className="text-lg">🥉</span>
              </div>
            </div>
          </div>
        )}

        {/* Rankings list */}
        <div className="flex flex-col gap-2">
          <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Rankings</p>

          {filteredRest.length === 0 && (
            <div className="text-center text-slate-400 py-10">
              <div className="text-3xl mb-2">🔍</div>
              <p className="text-sm">No players found</p>
            </div>
          )}

          {filteredRest.map((p, i) => (
            <div
              key={`${tab}-${p.rank}`}
              className={`
                fade-up rounded-2xl p-3 flex items-center gap-3 border
                ${p.isMe
                  ? "bg-emerald-50 border-emerald-200 me-row pulse-ring"
                  : "bg-white border-black/5"
                }
              `}
              style={{ animationDelay: `${(i + 3) * 60}ms` }}
            >
              <div className={`w-7 text-center font-extrabold text-sm ${p.isMe ? "text-emerald-500" : "text-slate-400"}`}>
                #{p.rank}
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${p.isMe ? "bg-emerald-100" : "bg-slate-100"}`}>
                {p.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-bold text-sm leading-tight ${p.isMe ? "text-emerald-700" : "text-slate-700"}`}
                   style={{ fontFamily: "Syne, sans-serif" }}>
                  {p.name} {p.isMe && <span className="text-emerald-400 text-xs font-normal">(you)</span>}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bar-fill"
                      style={{
                        width: `${(p.points / MAX_PTS) * 100}%`,
                        background: p.isMe
                          ? "linear-gradient(90deg,#34d399,#22d3ee)"
                          : "linear-gradient(90deg,#cbd5e1,#94a3b8)"
                      }}
                    />
                  </div>
                  <span className="text-slate-400 text-[10px] shrink-0">{p.captured} pins</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {p.streak > 0 && (
                  <div className="text-center">
                    <p className="text-xs">🔥</p>
                    <p className="text-[10px] text-orange-400 font-bold">{p.streak}</p>
                  </div>
                )}
                <div className={`text-right ${p.isMe ? "text-emerald-500" : "text-slate-500"}`}>
                  <p className="font-extrabold text-sm">{p.points}</p>
                  <p className="text-[10px] text-slate-400">pts</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 inset-x-0 bg-[#f4f7f4]/95 backdrop-blur-md border-t border-black/5 px-4 py-3">
        <div className="max-w-lg mx-auto flex gap-3">
          <a href="/hunts" className="flex-1">
            <Button variant="outline"
              className="w-full border-black/10 bg-white text-slate-600 hover:bg-slate-50 rounded-xl h-11">
              🎯 Hunt List
            </Button>
          </a>
          <a href="/map" className="flex-1">
            <Button
              className="w-full rounded-xl h-11 font-bold text-white hover:opacity-80 transition-opacity"
              style={{ background: "linear-gradient(135deg,#34d399,#22d3ee)" }}>
              🗺️ View Map
            </Button>
          </a>
        </div>
      </div>

    </div>
  );
}
