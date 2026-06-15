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
}: Props) {
  const [note, setNote] = useState("");
  const [showRevisionBox, setShowRevisionBox] = useState(false);
  const [record, setRecord] = useState<AgentRecord>(() => getAgentRecord(agentId));

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
              <p className="text-xs text-slate-500">{formatRelative(record.decidedAt)}</p>
            </div>
            <p className="mt-2 text-sm text-slate-800">
              <span className="font-semibold text-slate-900">{record.reviewerName}</span> ·{" "}
              <span className="text-slate-600">Engineering Lead</span>
            </p>
            {record.reviewerNote && (
              <div className="mt-3 rounded-md border border-slate-200 bg-white p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Reviewer Note</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-800">&ldquo;{record.reviewerNote}&rdquo;</p>
              </div>
            )}
          </div>
          {record.status === "approved" && nextAgentId && (
            <Link
              href={`/agents/${nextAgentId}`}
              className="shrink-0 rounded-md bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700"
            >
              Continue to Agent {nextAgentNumber} →
            </Link>
          )}
        </div>
      </section>
    );
  }

  const headerInRevisionMode = showRevisionBox;

  return (
    <section className={`rounded-xl border ${headerInRevisionMode ? "border-red-300" : "border-amber-300"} ${headerInRevisionMode ? "bg-red-50" : "bg-amber-50"} p-5`}>
      <div className="flex items-center gap-2">
        {headerInRevisionMode ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-700">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            Request Revision
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
            Pending Human Review
          </span>
        )}
      </div>
      <h3 className="mt-3 text-lg font-bold text-slate-900">
        {headerInRevisionMode
          ? `Send Agent ${agentNumber} output back for revision`
          : `Agent ${agentNumber} output — awaiting your approval`}
      </h3>
      <p className="mt-1 text-sm text-slate-700">
        {headerInRevisionMode
          ? `Describe what the ${agentName} agent should rework before re-running.`
          : `Review the ${agentName} output above. Add notes (optional) and approve to continue, or request a revision.`}
      </p>

      <div className="mt-4 rounded-md border border-slate-200 bg-white p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Reviewer</p>
        <p className="mt-1 text-sm font-semibold text-slate-900">Deepak Thirukkumaran</p>
        <p className="text-xs text-slate-600">Engineering Lead</p>
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
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none"
          />
        </div>
      )}

      {showRevisionBox && (
        <div className="mt-4 rounded-md border border-red-200 bg-white p-3">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-red-700">
            What needs revision? <span className="text-red-700">*</span>
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Describe what the agent should rework or what's missing…"
            rows={3}
            className="mt-1 w-full rounded-md border border-red-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:outline-none"
          />
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handleRevisionSubmit}
              disabled={!note.trim()}
              className="rounded-md bg-red-600 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Submit Revision Request
            </button>
            <button
              onClick={() => { setShowRevisionBox(false); setNote(""); }}
              className="rounded-md border border-slate-300 px-4 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-500 hover:text-slate-900"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {!showRevisionBox && (
        <div className="mt-5 flex items-center justify-end gap-3 border-t border-amber-200 pt-4">
          <button
            onClick={() => setShowRevisionBox(true)}
            className="rounded-md border border-amber-400 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-100"
          >
            ↻ Request Revision
          </button>
          <button
            onClick={handleApprove}
            className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-emerald-700"
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
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
        <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        Approved
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-700">
      <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
      Revision Requested
    </span>
  );
}

function decidedBorder(status: string) {
  return status === "approved" ? "border-emerald-300" : "border-red-300";
}
function decidedBg(status: string) {
  return status === "approved" ? "bg-emerald-50" : "bg-red-50";
}