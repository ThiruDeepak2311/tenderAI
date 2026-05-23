// src/lib/agentProgress.ts
// HITL-aware progress tracking. Each agent has a status, an optional reviewer note,
// and a timestamp of the last decision. Backed by sessionStorage.

const STORAGE_KEY = "tendering-ai-progress";
const DISCLAIMER_KEY = "tendering-ai-disclaimer-accepted";

export type AgentStatus = "pending" | "in_review" | "approved" | "revision_requested";

export type AgentRecord = {
  status: AgentStatus;
  reviewerNote?: string;
  reviewerName?: string;
  decidedAt?: string; // ISO timestamp
};

export type ProgressMap = Record<string, AgentRecord>;

const DEFAULT_REVIEWER = "Deepak Thirukkumaran";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getProgress(): ProgressMap {
  if (!isBrowser()) return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

export function getAgentRecord(agentId: string): AgentRecord {
  return getProgress()[agentId] || { status: "pending" };
}

export function setAgentStatus(agentId: string, record: AgentRecord) {
  if (!isBrowser()) return;
  const progress = getProgress();
  progress[agentId] = record;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  window.dispatchEvent(new Event("tendering-ai-progress-change"));
}

// Convenience: called by the agent view right after fake loading completes.
// Marks the agent as "in_review" (output produced, awaiting human approval).
export function markAgentForReview(agentId: string) {
  setAgentStatus(agentId, {
    status: "in_review",
    decidedAt: undefined,
  });
}

// Approve the agent's output. Optional reviewer note.
export function approveAgent(agentId: string, note?: string, reviewerName: string = DEFAULT_REVIEWER) {
  setAgentStatus(agentId, {
    status: "approved",
    reviewerNote: note,
    reviewerName,
    decidedAt: new Date().toISOString(),
  });
}

// Request a revision. Note is recommended (what needs changing).
export function requestRevision(agentId: string, note: string, reviewerName: string = DEFAULT_REVIEWER) {
  setAgentStatus(agentId, {
    status: "revision_requested",
    reviewerNote: note,
    reviewerName,
    decidedAt: new Date().toISOString(),
  });
}

export function resetProgress() {
  if (!isBrowser()) return;
  sessionStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(DISCLAIMER_KEY);
  window.dispatchEvent(new Event("tendering-ai-progress-change"));
}

// True if agent has been run at all (in review, approved, or revision requested).
export function isAgentRun(agentId: string): boolean {
  const rec = getAgentRecord(agentId);
  return rec.status !== "pending";
}

// Count only fully-approved agents (the "real" progress counter).
export function getApprovedCount(): number {
  return Object.values(getProgress()).filter((r) => r.status === "approved").length;
}

export function hasAcceptedDisclaimer(): boolean {
  if (!isBrowser()) return false;
  return sessionStorage.getItem(DISCLAIMER_KEY) === "true";
}

export function acceptDisclaimer() {
  if (!isBrowser()) return;
  sessionStorage.setItem(DISCLAIMER_KEY, "true");
}

// Format helper: turns ISO timestamp into human-readable relative time
export function formatRelative(iso?: string): string {
  if (!iso) return "";
  const diffMs = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(diffMs / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hr ago`;
  return new Date(iso).toLocaleDateString();
}