"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { hunts } from "@/data/hunts";

const CATEGORIES = ["All", "Architecture", "Nature", "Culture", "History", "Maritime"];

const CATEGORY_COLORS = {
  Architecture: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Nature:       "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Culture:      "bg-violet-500/10 text-violet-400 border-violet-500/20",
  History:      "bg-red-500/10 text-red-400 border-red-500/20",
  Maritime:     "bg-sky-500/10 text-sky-400 border-sky-500/20",
};

const DIFFICULTY_COLORS = {
  easy:   "bg-green-500/10 text-green-400 border-green-500/20",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  hard:   "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function HuntListPage({ onSelectLandmark }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showCaptured, setShowCaptured] = useState(true);
  const [capturedIds, setCapturedIds] = useState(() => {
  if (typeof window === 'undefined') return []
  const saved = localStorage.getItem('capturedIds')
  return saved ? JSON.parse(saved) : []
  })

  const [selectedLandmark, setSelectedLandmark] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const capturedLandmarks = hunts.filter(l => capturedIds.includes(l.id));
  const totalPts = capturedLandmarks.reduce((s, l) => s + l.points, 0);
  const maxPts = hunts.reduce((s, l) => s + l.points, 0);
  const progress = Math.round((capturedIds.length / hunts.length) * 100);

  const visible = hunts.filter(l => {
    const isCaptured = capturedIds.includes(l.id);
    if (!showCaptured && isCaptured) return false;
    if (filter !== "All" && l.borough !== filter && l.difficulty !== filter.toLowerCase()) return false;
    if (search && !l.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleCardClick = (lm) => {
    if (capturedIds.includes(lm.id)) return;
    setSelectedLandmark(lm);
    setPhotoPreview(null);
    setVerifyStatus(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!photoPreview) return;
    setSubmitting(true);
    setVerifyStatus('verifying');

    try {
      const res = await fetch('/api/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: photoPreview,
          landmark: selectedLandmark.title
        })
      });

      const { verified } = await res.json();

      if (verified) {
        setVerifyStatus('success');
        setTimeout(() => {
          setCapturedIds(prev => {
            const updated = [...prev, selectedLandmark.id]
            localStorage.setItem('capturedIds', JSON.stringify(updated))
            return updated
          });
          setSelectedLandmark(null);
          setPhotoPreview(null);
          setVerifyStatus(null);
        }, 1000);
      } else {
        setVerifyStatus('fail');
        setTimeout(() => setVerifyStatus(null), 2500);
      }
    } catch (err) {
      setVerifyStatus('fail');
      setTimeout(() => setVerifyStatus(null), 2500);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedLandmark(null);
    setPhotoPreview(null);
    setVerifyStatus(null);
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100"
         style={{ fontFamily: "'Syne', 'DM Sans', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .card-hover { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .card-hover:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
        .captured-shimmer { background: repeating-linear-gradient(135deg, rgba(74,222,128,0.03) 0px, rgba(74,222,128,0.03) 1px, transparent 1px, transparent 8px); }
        .modal-backdrop { animation: fadeIn 0.2s ease; }
        .modal-card { animation: slideUp 0.25s ease; }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#080c14]/90 backdrop-blur-md border-b border-white/5 px-4 pt-5 pb-3">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight leading-none"
                  style={{ fontFamily: "Syne, sans-serif", letterSpacing: "-0.02em" }}>
                PinDrop<span className="text-emerald-400">.NYC</span>
              </h1>
              <p className="text-slate-500 text-xs mt-0.5">Explore · Snap · Conquer</p>
            </div>
            <div className="text-right">
              <p className="text-emerald-400 font-bold text-lg leading-none">{totalPts}
                <span className="text-slate-500 font-normal text-sm"> / {maxPts} pts</span>
              </p>
              <p className="text-slate-500 text-xs mt-0.5">{capturedIds.length}/{hunts.length} captured</p>
            </div>
          </div>
          <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
              style={{ width: `${progress}%`, background: "linear-gradient(90deg, #4ade80, #22d3ee)" }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4 pb-24">
        <Input
          placeholder="Search landmarks..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-white/5 border-white/10 text-slate-200 placeholder:text-slate-600 mb-3 h-10 rounded-xl focus-visible:ring-emerald-500/40"
        />

        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
          {["All", "easy", "medium", "hard"].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold border transition-all capitalize ${
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

        <p className="text-slate-600 text-xs uppercase tracking-widest mb-3">
          {visible.length} location{visible.length !== 1 ? "s" : ""}
        </p>

        <div className="flex flex-col gap-3">
          {visible.map((lm, i) => {
            const isCaptured = capturedIds.includes(lm.id);
            return (
              <Card
                key={lm.id}
                onClick={() => handleCardClick(lm)}
                className={`card-hover border rounded-2xl overflow-hidden cursor-pointer ${
                  isCaptured
                    ? "bg-white/[0.03] border-white/5 captured-shimmer"
                    : "bg-[#0d1520] border-white/10 hover:border-emerald-500/30"
                }`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <CardContent className="p-4 flex gap-4 items-center">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 ${isCaptured ? "bg-white/5" : "bg-white/[0.06]"}`}>
                    {isCaptured ? "✅" : "📍"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className={`font-bold text-base leading-tight ${isCaptured ? "text-slate-500" : "text-slate-100"}`}
                          style={{ fontFamily: "Syne, sans-serif" }}>
                        {lm.title}
                      </h2>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${DIFFICULTY_COLORS[lm.difficulty]}`}>
                        {lm.difficulty}
                      </span>
                    </div>
                    <p className={`text-xs mt-1 leading-relaxed line-clamp-2 ${isCaptured ? "text-slate-600" : "text-slate-400"}`}>
                      {lm.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-slate-600 text-xs">📍 {lm.borough}</span>
                      {isCaptured && <span className="text-emerald-600 text-xs font-medium">Captured</span>}
                      {!isCaptured && <span className="text-emerald-500 text-xs font-medium">Tap to capture →</span>}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    {isCaptured ? (
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
            );
          })}

          {visible.length === 0 && (
            <div className="text-center text-slate-600 py-16">
              <div className="text-4xl mb-3">🔍</div>
              <p>No landmarks found</p>
            </div>
          )}
        </div>
      </main>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 inset-x-0 bg-[#080c14]/95 backdrop-blur-md border-t border-white/5 px-4 py-3">
        <div className="max-w-lg mx-auto flex gap-3">
          <a href="/map" className="flex-1">
            <Button variant="outline"
              className="w-full border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 rounded-xl h-11">
              🗺️ View Map
            </Button>
          </a>
          <a href="/leaderboard" className="flex-1">
            <Button
              className="w-full rounded-xl h-11 font-bold text-slate-900"
              style={{ background: "linear-gradient(135deg,#4ade80,#22d3ee)" }}>
              🏆 Leaderboard
            </Button>
          </a>
        </div>
      </div>

      {/* Photo Capture Modal */}
      {selectedLandmark && (
        <div
          className="modal-backdrop fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm px-4 pb-6"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <div className="modal-card w-full max-w-lg bg-[#0d1520] border border-white/10 rounded-3xl overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl">
                  📍
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 leading-tight" style={{ fontFamily: "Syne, sans-serif" }}>
                    {selectedLandmark.title}
                  </h3>
                  <p className="text-slate-500 text-xs">+{selectedLandmark.points} pts on capture</p>
                </div>
              </div>
              <button onClick={handleClose} className="text-slate-500 hover:text-slate-300 text-xl leading-none">✕</button>
            </div>

            <p className="px-5 text-slate-400 text-sm pb-4 border-b border-white/5">
              {selectedLandmark.description}
            </p>

            <div className="px-5 py-4">
              {photoPreview ? (
                <div className="relative rounded-2xl overflow-hidden">
                  <img src={photoPreview} alt="Preview" className="w-full h-56 object-cover" />
                  <button
                    onClick={() => { setPhotoPreview(null); setVerifyStatus(null); }}
                    className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full"
                  >
                    Retake
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-white/10 h-48 flex flex-col items-center justify-center gap-2 bg-white/[0.02]">
                  <div className="text-3xl">📷</div>
                  <p className="text-slate-500 text-sm">Add a photo to capture this landmark</p>
                </div>
              )}
            </div>

            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

            <div className="px-5 pb-5 flex flex-col gap-2">
              <div className="flex gap-2">
                <button
                  onClick={() => cameraInputRef.current.click()}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-all"
                >
                  📸 Camera
                </button>
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-all"
                >
                  🖼️ Gallery
                </button>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!photoPreview || submitting}
                className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${
                  verifyStatus === 'fail'
                    ? 'bg-red-500/20 border border-red-500/30 text-red-400'
                    : verifyStatus === 'success'
                    ? 'text-slate-900'
                    : photoPreview && !submitting
                    ? 'text-slate-900'
                    : 'bg-white/5 text-slate-600 cursor-not-allowed'
                }`}
                style={
                  verifyStatus === 'success' || (photoPreview && !submitting && verifyStatus !== 'fail')
                    ? { background: 'linear-gradient(90deg, #4ade80, #22d3ee)' }
                    : {}
                }
              >
                {verifyStatus === 'verifying' && '🔍 Verifying with AI...'}
                {verifyStatus === 'success' && '✅ Verified! Earning points...'}
                {verifyStatus === 'fail' && `❌ That's not ${selectedLandmark.title}!`}
                {!verifyStatus && (submitting ? 'Submitting...' : `Submit & Earn +${selectedLandmark.points} pts`)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}