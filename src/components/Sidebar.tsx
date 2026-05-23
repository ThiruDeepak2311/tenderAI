// src/components/Sidebar.tsx
// HITL-aware sidebar. Each agent shows its current status badge.
"use client";

import { agents } from "@/data/agents";
import { getProgress, resetProgress, getApprovedCount, type AgentStatus } from "@/lib/agentProgress";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Sidebar({ activeId }: { activeId?: string }) {
  const [progress, setProgress] = useState<Record<string, { status: AgentStatus }>>({});

  useEffect(() => {
    const refresh = () => setProgress(getProgress() as Record<string, { status: AgentStatus }>);
    refresh();
    window.addEventListener("tendering-ai-progress-change", refresh);
    return () => window.removeEventListener("tendering-ai-progress-change", refresh);
  }, []);

  const approvedCount = getApprovedCount();
  const hasAnyActivity = Object.keys(progress).length > 0;

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
          {approvedCount}/8 Approved
        </span>
      </div>

      <nav className="space-y-2">
        {agents.map((agent) => {
          const status = (progress[agent.id]?.status as AgentStatus) || "pending";
          const isActive = activeId === agent.id;

          return (
            <Link
              key={agent.id}
              href={`/agents/${agent.id}`}
              className={`group block rounded-lg border p-3 transition ${
                isActive
                  ? "border-emerald-500/60 bg-emerald-500/5"
                  : "border-slate-800 bg-slate-900 hover:border-emerald-500/50 hover:bg-slate-800"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-xs font-bold ${badgeStyle(status, isActive)}`}>
                  {iconForStatus(status, agent.number)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-white">{agent.name}</p>
                    {status !== "pending" && (
                      <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${pillStyle(status)}`}>
                        {statusLabel(status)}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-slate-400">{agent.tagline}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      {hasAnyActivity && (
        <button
          onClick={() => {
            if (confirm("Reset the demo? All agent results and approvals will be cleared.")) {
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

function iconForStatus(status: AgentStatus, fallback: string) {
  if (status === "approved") {
    return (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    );
  }
  if (status === "revision_requested") {
    return (
      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    );
  }
  return fallback;
}

function badgeStyle(status: AgentStatus, isActive: boolean) {
  if (status === "approved") return "bg-emerald-500/20 text-emerald-400";
  if (status === "in_review") return "bg-amber-500/20 text-amber-400";
  if (status === "revision_requested") return "bg-red-500/20 text-red-400";
  return isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800 text-emerald-400";
}

function pillStyle(status: AgentStatus) {
  if (status === "approved") return "bg-emerald-500/15 text-emerald-400";
  if (status === "in_review") return "bg-amber-500/15 text-amber-400";
  if (status === "revision_requested") return "bg-red-500/15 text-red-400";
  return "bg-slate-700 text-slate-300";
}

function statusLabel(status: AgentStatus) {
  if (status === "approved") return "Approved";
  if (status === "in_review") return "Review";
  if (status === "revision_requested") return "Revise";
  return "";
}