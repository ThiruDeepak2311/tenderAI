// src/app/page.tsx
// The home/landing screen for the Tendering AI mockup.

import Sidebar from "@/components/Sidebar";

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-10">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
            Welcome
          </p>
          <h2 className="mt-2 text-4xl font-bold text-white">
            End-to-End Tendering, Reimagined with AI
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-300">
            From a 2,000-page RFP to a winning bid — eight specialized AI agents
            handle every step of the tendering process. Click any agent on the
            left to see how it works.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4">
            <Stat value="70%" label="Bid cycle time reduction" />
            <Stat value="3×" label="More bids per quarter" />
            <Stat value="25%" label="Win rate improvement" />
          </div>
        </div>
      </main>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-3xl font-bold text-emerald-400">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{label}</p>
    </div>
  );
}