// src/components/HITLPanel.tsx
"use client";

import { useState, useEffect } from "react";
import { approveAgent, requestRevision, getAgentRecord, formatRelative, type AgentRecord } from "@/lib/agentProgress";
import Link from "next/link";

type Props = {
  agentId: string;
  agentNumber: string;
  agentName: string;
  nextAgentId?: string;
  nextAgentNumber?: string;
  nextAgentName?: string;
  accentColor?: "emerald" | "blue" | "purple" | "amber";
};

export default function HITLPanel({
  agentId,
  agentNumber,
  agentName,
  nextAgentId,
  nextAgentNumber,
  accentColor = "emerald",
}: Props) {
  const [note, setNote] = useState("");
  const [showRevisionBox, setShowRevisionBox] = useState(false);
  const [record, setRecord] = useState<AgentRecord>(() => getAgentRecord(agentId));

  // Re-read record on mount and whenever progress changes globally
  useEffect(() => {
    const refresh = () => setRecord(getAgentRecord(agentId));
    refresh();
    window.addEventListener("tendering-ai-progress-change", refresh);
    return () => window.removeEventListener("tendering-ai-progress-change", refresh);
  }, [agentId]);

  const handleApprove = () => {
    approveAgent(agentId, note.trim() || undefined);
    setNote("");
    setRecord(getAgentRecord(agentId));
  };

  const handleRevisionSubmit = () => {
    if (!note.trim()) return;
    requestRevision(agentId, note.trim());
    setNote("");
    setShowRevisionBox(false);
    setRecord(getAgentRecord(agentId));
  };

  const isDecided = record.status === "approved" || record.status === "revision_requested";

  if (isDecided) {
    return (
      <section className={`rounded-xl border ${decidedBorder(record.status)} ${decidedBg(record.status)} p-5`}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <StatusBadge status={record.status} />
              <p className="text-xs text-slate-400">{formatRelative(record.decidedAt)}</p>
            </div>
            <p className="mt-2 text-sm text-slate-200">
              <span className="font-semibold text-white">{record.reviewerName}</span> ·{" "}
              <span className="text-slate-400">Engineering Lead</span>
            </p>
            {record.reviewerNote && (
              <div className="mt-3 rounded-md border border-slate-800 bg-slate-900/50 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Reviewer Note</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-200">&ldquo;{record.reviewerNote}&rdquo;</p>
              </div>
            )}
          </div>
          {record.status === "approved" && nextAgentId && (
            <Link
              href={`/agents/${nextAgentId}`}
              className="shrink-0 rounded-md bg-emerald-500 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-emerald-400"
            >
              Continue to Agent {nextAgentNumber} →
            </Link>
          )}
        </div>
      </section>
    );
  }

  // Pending review — approval form
  const headerInRevisionMode = showRevisionBox;

  return (
    <section className={`rounded-xl border ${headerInRevisionMode ? "border-red-500/30" : "border-amber-500/30"} bg-gradient-to-br ${headerInRevisionMode ? "from-red-500/5" : "from-amber-500/5"} to-slate-900 p-5`}>
      <div className="flex items-center gap-2">
        {headerInRevisionMode ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
            Request Revision
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
            Pending Human Review
          </span>
        )}
      </div>
      <h3 className="mt-3 text-lg font-bold text-white">
        {headerInRevisionMode
          ? `Send Agent ${agentNumber} output back for revision`
          : `Agent ${agentNumber} output — awaiting your approval`}
      </h3>
      <p className="mt-1 text-sm text-slate-300">
        {headerInRevisionMode
          ? `Describe what the ${agentName} agent should rework before re-running.`
          : `Review the ${agentName} output above. Add notes (optional) and approve to continue, or request a revision.`}
      </p>

      <div className="mt-4 rounded-md border border-slate-800 bg-slate-900/50 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Reviewer</p>
        <p className="mt-1 text-sm font-semibold text-white">Deepak Thirukkumaran</p>
        <p className="text-xs text-slate-400">Engineering Lead</p>
      </div>

      {!showRevisionBox && (
        <div className="mt-4">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Optional Comment
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Confirm methane analyzer spec with engineering team before next stage."
            rows={2}
            className="mt-1 w-full rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-emerald-500/40 focus:outline-none"
          />
        </div>
      )}

      {showRevisionBox && (
        <div className="mt-4 rounded-md border border-red-500/30 bg-red-500/5 p-3">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-red-400">
            What needs revision? <span className="text-red-400">*</span>
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Describe what the agent should rework or what's missing…"
            rows={3}
            className="mt-1 w-full rounded-md border border-red-500/30 bg-slate-900 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-red-500/60 focus:outline-none"
          />
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handleRevisionSubmit}
              disabled={!note.trim()}
              className="rounded-md bg-red-500 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Submit Revision Request
            </button>
            <button
              onClick={() => { setShowRevisionBox(false); setNote(""); }}
              className="rounded-md border border-slate-700 px-4 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {!showRevisionBox && (
        <div className="mt-5 flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
          <button
            onClick={() => setShowRevisionBox(true)}
            className="rounded-md border border-amber-500/40 px-4 py-2 text-sm font-semibold text-amber-400 transition hover:bg-amber-500/10"
          >
            ↻ Request Revision
          </button>
          <button
            onClick={handleApprove}
            className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-5 py-2 text-sm font-bold text-slate-950 transition hover:bg-emerald-400"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Approve {nextAgentNumber ? `& Continue to Agent ${nextAgentNumber}` : ""}
          </button>
        </div>
      )}
    </section>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "approved") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-400">
        <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        Approved
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-400">
      <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
      Revision Requested
    </span>
  );
}

function decidedBorder(status: string) {
  return status === "approved" ? "border-emerald-500/30" : "border-red-500/30";
}
function decidedBg(status: string) {
  return status === "approved"
    ? "bg-gradient-to-br from-emerald-500/5 to-slate-900"
    : "bg-gradient-to-br from-red-500/5 to-slate-900";
}