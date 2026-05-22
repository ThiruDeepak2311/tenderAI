// src/components/Sidebar.tsx
// The 8-agent pipeline sidebar. Used on home and on each agent page.
// Shows progress badges + active-agent highlight + Reset Demo button.
"use client";

import { agents } from "@/data/agents";
import { getProgress, resetProgress } from "@/lib/agentProgress";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Sidebar({ activeId }: { activeId?: string }) {
  const [progress, setProgress] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Initial load + listen for changes from any agent
    const refresh = () => setProgress(getProgress());
    refresh();
    window.addEventListener("tendering-ai-progress-change", refresh);
    return () => window.removeEventListener("tendering-ai-progress-change", refresh);
  }, []);

  const completedCount = Object.values(progress).filter(Boolean).length;

  return (
    <aside className="w-80 shrink-0 border-r border-slate-800 bg-slate-900/50 p-6">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
          Tendering AI
        </p>
        <h1 className="mt-1 text-lg font-bold leading-tight text-white">
          Oil & Gas Bid Intelligence Platform
        </h1>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          The 8-Agent Pipeline
        </p>
        <span className="text-[10px] font-bold text-emerald-400">
          {completedCount}/8
        </span>
      </div>

      <nav className="space-y-2">
        {agents.map((agent) => {
          const isActive = activeId === agent.id;
          const isDone = !!progress[agent.id];

          const baseClasses = "group block cursor-pointer rounded-lg border p-3 transition";
          const stateClasses = isActive
            ? "border-emerald-500/60 bg-emerald-500/5"
            : "border-slate-800 bg-slate-900 hover:border-emerald-500/50 hover:bg-slate-800";

          return (
            <Link
              key={agent.id}
              href={`/agents/${agent.id}`}
              className={`${baseClasses} ${stateClasses}`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
                    isDone
                      ? "bg-emerald-500/20 text-emerald-400"
                      : isActive
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-slate-800 text-emerald-400 group-hover:bg-emerald-500/10"
                  }`}
                >
                  {isDone ? (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    agent.number
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`truncate text-sm font-semibold ${isActive ? "text-white" : "text-white"}`}>
                      {agent.name}
                    </p>
                    {isDone && (
                      <span className="shrink-0 rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-400">
                        Done
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-slate-400">
                    {agent.tagline}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Reset Demo button — only shows if at least one agent has been run */}
      {completedCount > 0 && (
        <button
          onClick={() => {
            if (confirm("Reset the demo? All agent results will be cleared.")) {
              resetProgress();
            }
          }}
          className="mt-6 w-full rounded-md border border-slate-800 px-3 py-2 text-xs font-semibold text-slate-400 transition hover:border-amber-500/40 hover:text-amber-400"
        >
          ↺ Reset Demo
        </button>
      )}
    </aside>
  );
}