// src/app/page.tsx
"use client";

import Sidebar from "@/components/Sidebar";
import { agents } from "@/data/agents";
import { getProgress, type AgentStatus } from "@/lib/agentProgress";
import Link from "next/link";
import { useEffect, useState } from "react";

type ProgressState = Record<string, { status: AgentStatus }>;

export default function Home() {
  const [progress, setProgress] = useState<ProgressState>({});

  useEffect(() => {
    const refresh = () => setProgress(getProgress() as ProgressState);
    refresh();
    window.addEventListener("tendering-ai-progress-change", refresh);
    return () => window.removeEventListener("tendering-ai-progress-change", refresh);
  }, []);

  const completedCount = Object.values(progress).filter((r) => r.status === "approved").length;
  const progressPct = (completedCount / agents.length) * 100;

  // Next agent = first one not yet approved
  const nextAgent = agents.find((a) => progress[a.id]?.status !== "approved") || agents[0];
  const allDone = completedCount === agents.length;

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 overflow-x-hidden p-10">
        <div className="mx-auto max-w-5xl">
          <section>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
              Tendering AI · Oil & Gas
            </p>
            <h2 className="mt-2 text-4xl font-bold leading-tight text-white">
              End-to-End Tendering,<br />Reimagined with AI
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-300">
              From a 2,000-page RFP to a winning bid — eight specialized AI agents
              handle every step of the tendering process.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4">
              <Stat value="70%" label="Bid cycle time reduction" />
              <Stat value="3×" label="More bids per quarter" />
              <Stat value="25%" label="Win rate improvement" />
            </div>
          </section>

          <section className="mt-12">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">How it Works</p>
            <div className="mt-3 grid grid-cols-3 gap-4">
              <PhaseCard num="01" title="Read" description="Parse the tender, qualify the opportunity, retrieve reference designs from past projects." agents="Agents 01–03" color="emerald" />
              <PhaseCard num="02" title="Decide" description="Build the bill of materials, send RFQs to suppliers, compare and rank incoming quotes." agents="Agents 04–06" color="blue" />
              <PhaseCard num="03" title="Respond" description="Draft the technical response from knowledge base; assemble and submit the final bid package." agents="Agents 07–08" color="purple" />
            </div>
          </section>

          <section className="mt-12">
            <div className="mb-4 flex items-baseline justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">The 8-Agent Pipeline</p>
              {completedCount > 0 && (
                <p className="text-xs text-slate-500">
                  <span className="font-bold text-emerald-400">{completedCount}</span> of {agents.length} agents approved
                </p>
              )}
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
              <div className="flex items-stretch gap-1 overflow-x-auto pb-2">
                {agents.map((agent, idx) => {
                  const status = progress[agent.id]?.status;
                  const isApproved = status === "approved";
                  const isInReview = status === "in_review";
                  const isRevision = status === "revision_requested";
                  return (
                    <div key={agent.id} className="flex items-center gap-1">
                      <Link
                        href={`/agents/${agent.id}`}
                        className={`block min-w-[120px] rounded-lg border p-3 text-center transition ${
                          isApproved
                            ? "border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10"
                            : isInReview
                            ? "border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10"
                            : isRevision
                            ? "border-red-500/40 bg-red-500/5 hover:bg-red-500/10"
                            : "border-slate-800 bg-slate-900 hover:border-emerald-500/40 hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex justify-center">
                          <span className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-bold ${
                            isApproved ? "bg-emerald-500/20 text-emerald-400"
                            : isInReview ? "bg-amber-500/20 text-amber-400"
                            : isRevision ? "bg-red-500/20 text-red-400"
                            : "bg-slate-800 text-emerald-400"
                          }`}>
                            {isApproved ? (
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            ) : agent.number}
                          </span>
                        </div>
                        <p className="mt-2 text-[11px] font-semibold leading-tight text-white">{agent.name}</p>
                        {isApproved && <p className="mt-1 text-[9px] font-bold uppercase tracking-wide text-emerald-400">Approved</p>}
                        {isInReview && <p className="mt-1 text-[9px] font-bold uppercase tracking-wide text-amber-400">Review</p>}
                        {isRevision && <p className="mt-1 text-[9px] font-bold uppercase tracking-wide text-red-400">Revise</p>}
                      </Link>
                      {idx < agents.length - 1 && <span className="text-slate-700">→</span>}
                    </div>
                  );
                })}
              </div>

              {completedCount > 0 && (
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-emerald-400 transition-all duration-500" style={{ width: `${progressPct}%` }} />
                </div>
              )}
            </div>
          </section>

          <section className="mt-10 rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-slate-900 p-8 text-center">
            {allDone ? (
              <>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Pipeline Complete</p>
                <h3 className="mt-2 text-2xl font-bold text-white">All 8 agents have been approved</h3>
                <p className="mt-2 text-sm text-slate-300">Click any agent in the sidebar to review its output, or reset the demo to start over.</p>
              </>
            ) : completedCount > 0 ? (
              <>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Continue Demo</p>
                <h3 className="mt-2 text-2xl font-bold text-white">Pick up from Agent {nextAgent.number} — {nextAgent.name}</h3>
                <p className="mt-2 text-sm text-slate-300">{nextAgent.tagline}</p>
                <Link href={`/agents/${nextAgent.id}`} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-400">
                  Continue →
                </Link>
              </>
            ) : (
              <>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Ready When You Are</p>
                <h3 className="mt-2 text-2xl font-bold text-white">Start the Demo</h3>
                <p className="mt-2 text-sm text-slate-300">Walk through the full pipeline, beginning with Agent 01 — RFI Intelligence.</p>
                <Link href={`/agents/${agents[0].id}`} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Start Demo
                </Link>
              </>
            )}
          </section>
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

function PhaseCard({ num, title, description, agents, color }: { num: string; title: string; description: string; agents: string; color: "emerald" | "blue" | "purple"; }) {
  const colorClasses = {
    emerald: { border: "border-emerald-500/20", text: "text-emerald-400", bg: "bg-emerald-500/5" },
    blue: { border: "border-blue-500/20", text: "text-blue-400", bg: "bg-blue-500/5" },
    purple: { border: "border-purple-500/20", text: "text-purple-400", bg: "bg-purple-500/5" },
  }[color];

  return (
    <div className={`rounded-xl border ${colorClasses.border} ${colorClasses.bg} p-5`}>
      <div className="flex items-center gap-3">
        <span className={`text-2xl font-bold ${colorClasses.text}`}>{num}</span>
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-300">{description}</p>
      <p className={`mt-3 text-xs font-semibold uppercase tracking-wider ${colorClasses.text}`}>{agents}</p>
    </div>
  );
}