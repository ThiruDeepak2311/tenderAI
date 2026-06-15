// src/components/Sidebar.tsx
"use client";

import { agents } from "@/data/agents";
import { getProgress, resetProgress, getApprovedCount, type AgentStatus } from "@/lib/agentProgress";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Sidebar({ activeId }: { activeId?: string }) {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState<Record<string, { status: AgentStatus }>>({});
  const [approvedCount, setApprovedCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    const refresh = () => {
      setProgress(getProgress() as Record<string, { status: AgentStatus }>);
      setApprovedCount(getApprovedCount());
    };
    refresh();
    window.addEventListener("tendering-ai-progress-change", refresh);
    return () => window.removeEventListener("tendering-ai-progress-change", refresh);
  }, []);

  const hasAnyActivity = mounted && Object.keys(progress).length > 0;

  return (
    <aside className="w-80 shrink-0 border-r border-slate-200 bg-white p-6">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
          Tendering AI
        </p>
        <h1 className="mt-1 text-lg font-bold leading-tight text-slate-900">
          Oil & Gas Bid Intelligence Platform
        </h1>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
          The 8-Agent Pipeline
        </p>
        <span className="text-[10px] font-bold text-emerald-600">
          {mounted ? approvedCount : 0}/8 Approved
        </span>
      </div>

      <nav className="space-y-2">
        {agents.map((agent) => {
          const status = mounted ? ((progress[agent.id]?.status as AgentStatus) || "pending") : "pending";
          const isActive = activeId === agent.id;

          return (
            <div key={agent.id}>
              <Link
                href={`/agents/${agent.id}`}
                className={`group block rounded-lg border p-3 transition ${
                  isActive
                    ? "border-emerald-500/60 bg-emerald-50"
                    : "border-slate-200 bg-white hover:border-emerald-500/50 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-xs font-bold ${badgeStyle(status, isActive)}`}>
                    {iconForStatus(status, agent.number)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-slate-900">{agent.name}</p>
                      {mounted && status !== "pending" && (
                        <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${pillStyle(status)}`}>
                          {statusLabel(status)}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-slate-500">{agent.tagline}</p>
                  </div>
                </div>
              </Link>

              {agent.id === "qualification" && (
                <Link
                  href="/agents/qualification/live"
                  className={`mt-1 block rounded-lg border-2 border-dashed p-2.5 transition ${
                    activeId === "qualification-live"
                      ? "border-emerald-500/70 bg-emerald-50"
                      : "border-emerald-500/40 bg-emerald-50/40 hover:border-emerald-500/70 hover:bg-emerald-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold uppercase tracking-wide text-emerald-700">
                        Live · Real LLM
                      </p>
                      <p className="text-[10px] text-slate-500">Gemini-powered Agent 02</p>
                    </div>
                  </div>
                </Link>
              )}
            </div>
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
          className="mt-6 w-full rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-amber-500/40 hover:text-amber-600"
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
  if (status === "approved") return "bg-emerald-100 text-emerald-700";
  if (status === "in_review") return "bg-amber-100 text-amber-700";
  if (status === "revision_requested") return "bg-red-100 text-red-700";
  return isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-emerald-700";
}

function pillStyle(status: AgentStatus) {
  if (status === "approved") return "bg-emerald-100 text-emerald-700";
  if (status === "in_review") return "bg-amber-100 text-amber-700";
  if (status === "revision_requested") return "bg-red-100 text-red-700";
  return "bg-slate-100 text-slate-600";
}

function statusLabel(status: AgentStatus) {
  if (status === "approved") return "Approved";
  if (status === "in_review") return "Review";
  if (status === "revision_requested") return "Revise";
  return "";
}