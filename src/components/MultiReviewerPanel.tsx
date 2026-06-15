// src/components/MultiReviewerPanel.tsx
"use client";

import { useState, useEffect } from "react";
import {
  getMultiReviewerState,
  approveReviewer,
  requestReviewerRevision,
  resetMultiReviewerState,
  getApprovedCount,
  getAssignedCount,
  isAllApproved,
  getAllRoles,
  formatRelative,
  ROLE_META,
  MULTI_REVIEWER_CHANGE_EVENT,
  type ReviewerRole,
  type MultiReviewerState,
} from "@/lib/multiReviewerState";

type Props = {
  onOpenAssignChatbot: () => void;
};

export default function MultiReviewerPanel({ onOpenAssignChatbot }: Props) {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<MultiReviewerState | null>(null);

  useEffect(() => {
    setMounted(true);
    const refresh = () => setState(getMultiReviewerState());
    refresh();
    window.addEventListener(MULTI_REVIEWER_CHANGE_EVENT, refresh);
    return () => window.removeEventListener(MULTI_REVIEWER_CHANGE_EVENT, refresh);
  }, []);

  // Don't render anything until mounted (avoids hydration mismatch)
  if (!mounted || !state) {
    return (
      <section className="rounded-xl border-2 border-slate-300 bg-white p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-600">
          Multi-Reviewer Human-in-the-Loop
        </p>
        <p className="mt-2 text-sm text-slate-500">Loading reviewer state…</p>
      </section>
    );
  }

  const approvedCount = getApprovedCount(state);
  const assignedCount = getAssignedCount(state);
  const allApproved = isAllApproved(state);
  const totalRoles = 4;
  const roles = getAllRoles();

  const rollupStatus = allApproved
    ? { label: "All Reviewers Approved", tone: "approved" as const }
    : approvedCount > 0
    ? { label: `${approvedCount}/${totalRoles} Approved`, tone: "partial" as const }
    : assignedCount > 0
    ? { label: `${assignedCount}/${totalRoles} Assigned · Awaiting Review`, tone: "pending" as const }
    : { label: "No Reviewers Assigned", tone: "idle" as const };

  return (
    <section className={`rounded-xl border-2 ${rollupBorder(rollupStatus.tone)} ${rollupBg(rollupStatus.tone)} p-6`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className={`text-xs font-bold uppercase tracking-widest ${rollupText(rollupStatus.tone)}`}>
            Multi-Reviewer Human-in-the-Loop
          </p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">{rollupStatus.label}</h3>
          <p className="mt-1 text-sm text-slate-700">
            This live agent output requires sign-off from 4 reviewer roles before the bid is approved.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {assignedCount === 0 && (
            <button
              onClick={onOpenAssignChatbot}
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Initiate Review
            </button>
          )}
          {assignedCount > 0 && (
            <button
              onClick={onOpenAssignChatbot}
              className="inline-flex items-center gap-2 rounded-md border border-blue-300 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              ↻ Manage Assignments
            </button>
          )}
          {assignedCount > 0 && (
            <button
              onClick={() => {
                if (confirm("Reset all reviewers? All assignments and approvals will be cleared.")) {
                  resetMultiReviewerState();
                }
              }}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-amber-400 hover:text-amber-700"
            >
              ↺ Reset
            </button>
          )}
        </div>
      </div>

      <div className="mt-5">
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full transition-all duration-500 ${rollupBar(rollupStatus.tone)}`}
            style={{ width: `${(approvedCount / totalRoles) * 100}%` }}
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {roles.map((role) => (
          <ReviewerCard key={role} role={role} slot={state[role]} />
        ))}
      </div>

      {allApproved && (
        <div className="mt-5 rounded-lg border border-emerald-300 bg-white p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-emerald-700">Agent 02 Output — Approved</p>
              <p className="text-xs text-slate-600">All four reviewers have signed off. This output is cleared for downstream agents.</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function ReviewerCard({ role, slot }: { role: ReviewerRole; slot: MultiReviewerState[ReviewerRole] }) {
  const meta = ROLE_META[role];
  const [showRevisionBox, setShowRevisionBox] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");

  const handleApprove = () => {
    approveReviewer(role, noteDraft || undefined);
    setNoteDraft("");
  };

  const handleRevisionSubmit = () => {
    if (!noteDraft.trim()) return;
    requestReviewerRevision(role, noteDraft.trim());
    setNoteDraft("");
    setShowRevisionBox(false);
  };

  const colorClass = colorMap[meta.color];

  return (
    <div className={`rounded-lg border ${slot.status === "approved" ? "border-emerald-300 bg-emerald-50" : slot.status === "revision_requested" ? "border-red-300 bg-red-50" : slot.status === "pending" ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-white"} p-4`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${colorClass.iconBg} ${colorClass.iconText}`}>
              <RoleIcon role={role} />
            </span>
            <p className="text-sm font-bold text-slate-900">{meta.label}</p>
          </div>
          <p className="mt-1 text-xs text-slate-600">{meta.description}</p>
          <p className={`mt-1 text-[10px] font-semibold uppercase tracking-wider ${colorClass.text}`}>
            Lane: {meta.focus}
          </p>
        </div>
        <StatusBadge status={slot.status} />
      </div>

      {slot.status === "unassigned" && (
        <div className="mt-3 rounded-md border border-dashed border-slate-300 bg-slate-50 p-3 text-center">
          <p className="text-xs italic text-slate-500">No reviewer assigned yet</p>
        </div>
      )}

      {slot.status !== "unassigned" && (
        <div className="mt-3 rounded-md border border-slate-200 bg-white p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Assigned to</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-900">{slot.assignedTo}</p>
          {slot.assignedEmail && <p className="text-xs text-slate-500">{slot.assignedEmail}</p>}
        </div>
      )}

      {(slot.status === "approved" || slot.status === "revision_requested") && (
        <div className="mt-3 space-y-2">
          <p className="text-[10px] text-slate-500">{formatRelative(slot.decidedAt)}</p>
          {slot.note && (
            <div className="rounded-md border border-slate-200 bg-white p-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Reviewer Note</p>
              <p className="mt-0.5 text-xs italic text-slate-700">&ldquo;{slot.note}&rdquo;</p>
            </div>
          )}
        </div>
      )}

      {slot.status === "pending" && (
        <div className="mt-3 space-y-2">
          {!showRevisionBox && (
            <textarea
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              placeholder="Optional comment…"
              rows={2}
              className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
            />
          )}

          {showRevisionBox && (
            <div className="rounded-md border border-red-200 bg-white p-2">
              <textarea
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                placeholder="What needs revision? *"
                rows={2}
                className="w-full rounded-md border border-red-300 bg-white px-2 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:outline-none"
              />
              <div className="mt-1.5 flex items-center gap-1.5">
                <button
                  onClick={handleRevisionSubmit}
                  disabled={!noteDraft.trim()}
                  className="rounded-md bg-red-600 px-2.5 py-1 text-[10px] font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Submit
                </button>
                <button
                  onClick={() => { setShowRevisionBox(false); setNoteDraft(""); }}
                  className="rounded-md border border-slate-300 px-2.5 py-1 text-[10px] font-semibold text-slate-600 transition hover:border-slate-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {!showRevisionBox && (
            <div className="flex items-center justify-end gap-1.5">
              <button
                onClick={() => setShowRevisionBox(true)}
                className="rounded-md border border-amber-400 px-2.5 py-1 text-[10px] font-semibold text-amber-700 transition hover:bg-amber-100"
              >
                ↻ Revise
              </button>
              <button
                onClick={handleApprove}
                className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1 text-[10px] font-bold text-white transition hover:bg-emerald-700"
              >
                <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Approve
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "approved") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
        <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        Approved
      </span>
    );
  }
  if (status === "revision_requested") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-red-700">
        ↻ Revise
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-700">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
        In Review
      </span>
    );
  }
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-500">
      Unassigned
    </span>
  );
}

function RoleIcon({ role }: { role: ReviewerRole }) {
  if (role === "technical") {
    return (
      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    );
  }
  if (role === "commercial") {
    return (
      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }
  if (role === "legal") {
    return (
      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    );
  }
  return (
    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

const colorMap: Record<string, { iconBg: string; iconText: string; text: string }> = {
  blue: { iconBg: "bg-blue-100", iconText: "text-blue-700", text: "text-blue-700" },
  emerald: { iconBg: "bg-emerald-100", iconText: "text-emerald-700", text: "text-emerald-700" },
  purple: { iconBg: "bg-purple-100", iconText: "text-purple-700", text: "text-purple-700" },
  amber: { iconBg: "bg-amber-100", iconText: "text-amber-700", text: "text-amber-700" },
};

function rollupBorder(tone: string) {
  if (tone === "approved") return "border-emerald-400";
  if (tone === "partial") return "border-amber-400";
  if (tone === "pending") return "border-amber-300";
  return "border-slate-300";
}
function rollupBg(tone: string) {
  if (tone === "approved") return "bg-gradient-to-br from-emerald-50 to-white";
  if (tone === "partial") return "bg-gradient-to-br from-amber-50 to-white";
  if (tone === "pending") return "bg-gradient-to-br from-amber-50 to-white";
  return "bg-white";
}
function rollupText(tone: string) {
  if (tone === "approved") return "text-emerald-700";
  if (tone === "partial") return "text-amber-700";
  if (tone === "pending") return "text-amber-700";
  return "text-slate-600";
}
function rollupBar(tone: string) {
  if (tone === "approved") return "bg-emerald-500";
  if (tone === "partial") return "bg-amber-500";
  if (tone === "pending") return "bg-amber-500";
  return "bg-slate-300";
}