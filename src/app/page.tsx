import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f4f7f4] text-slate-800 flex flex-col"
         style={{ fontFamily: "'Syne', 'DM Sans', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .glow { text-shadow: 0 0 40px rgba(16,185,129,0.2); }
      `}</style>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center py-20">

        <div className="mb-6 text-6xl">🗺️</div>

        <h1 className="text-5xl font-extrabold tracking-tight leading-none mb-3 glow"
            style={{ fontFamily: "Syne, sans-serif", letterSpacing: "-0.03em" }}>
          PinDrop<span className="text-emerald-500">.NYC</span>
        </h1>

        <p className="text-slate-500 text-lg mt-2 mb-10 max-w-md leading-relaxed">
          A scavenger hunt across New York City. Find landmarks, snap a photo, and let AI verify you were really there.
        </p>

        <Link href="/hunts">
          <button
            className="px-8 py-4 rounded-2xl text-white font-bold text-lg transition-all hover:opacity-80 active:scale-95"
            style={{ background: "linear-gradient(135deg, #34d399, #22d3ee)" }}
          >
            Get Started →
          </button>
        </Link>

        {/* How it works */}
        <div className="mt-20 grid grid-cols-1 gap-3 max-w-md w-full text-left">
          <p className="text-slate-400 text-xs uppercase tracking-widest mb-2 text-center">How it works</p>

          {[
            { emoji: "📍", title: "Find a Location", desc: "Browse NYC landmarks and hidden gems across all five boroughs." },
            { emoji: "📸", title: "Snap a Photo", desc: "Head to the location and take a photo to prove you were there." },
            { emoji: "🤖", title: "AI Verification", desc: "Our AI checks your photo and confirms you found the right spot." },
            { emoji: "🏆", title: "Earn Points", desc: "Collect points for every landmark you capture and climb the ranks." },
          ].map((step) => (
            <div key={step.title} className="rounded-2xl p-4 bg-white border border-black/5 flex gap-4 items-start shadow-sm">
              <div className="text-2xl mt-0.5">{step.emoji}</div>
              <div>
                <h3 className="font-bold text-slate-700 text-sm" style={{ fontFamily: "Syne, sans-serif" }}>{step.title}</h3>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-10 flex gap-8 text-center">
          {[
            { value: "20", label: "Landmarks" },
            { value: "NYC", label: "Location" },
            { value: "AI", label: "Verified" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-emerald-500 font-extrabold text-2xl" style={{ fontFamily: "Syne, sans-serif" }}>{stat.value}</p>
              <p className="text-slate-400 text-xs mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

      </main>

      {/* Footer */}
      <footer className="text-center text-slate-400 text-xs py-6 border-t border-black/5">
        Built at HenHacks · Students from NYC
      </footer>

    </div>
  )
}
