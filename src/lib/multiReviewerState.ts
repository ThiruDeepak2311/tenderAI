// src/lib/multiReviewerState.ts
// State management for the multi-reviewer HITL system on Live Agent 02.

export type ReviewerRole = "technical" | "commercial" | "legal" | "regional";
export type ReviewerStatus = "unassigned" | "pending" | "approved" | "revision_requested";

export type ReviewerSlot = {
  role: ReviewerRole;
  assignedTo: string | null;
  assignedEmail: string | null;
  status: ReviewerStatus;
  note: string | null;
  decidedAt: number | null;
};

export type MultiReviewerState = Record<ReviewerRole, ReviewerSlot>;

const STORAGE_KEY = "tendering-ai-multi-reviewer-state";
const CHANGE_EVENT = "tendering-ai-multi-reviewer-change";

export const ROLE_META: Record<ReviewerRole, {
  label: string;
  shortLabel: string;
  description: string;
  focus: string;
  color: "blue" | "emerald" | "purple" | "amber";
}> = {
  technical: {
    label: "Technical Reviewer",
    shortLabel: "Technical",
    description: "Validates engineering capability, capacity, and past experience.",
    focus: "Technical Capability · Past Project Experience · Capacity & Bandwidth",
    color: "blue",
  },
  commercial: {
    label: "Commercial Reviewer",
    shortLabel: "Commercial",
    description: "Validates contract value, margin, and commercial terms.",
    focus: "Commercial Fit · Strategic Alignment",
    color: "emerald",
  },
  legal: {
    label: "Legal Reviewer",
    shortLabel: "Legal",
    description: "Reviews risk clauses, Change-in-Law exposure, and compliance.",
    focus: "Risk Exposure · Local Content & Compliance",
    color: "purple",
  },
  regional: {
    label: "Regional Reviewer",
    shortLabel: "Regional",
    description: "Confirms local market, regulatory, and competitive context.",
    focus: "Competitive Landscape · Local Content & Compliance",
    color: "amber",
  },
};

const ROLES: ReviewerRole[] = ["technical", "commercial", "legal", "regional"];

function defaultState(): MultiReviewerState {
  return ROLES.reduce((acc, role) => {
    acc[role] = {
      role,
      assignedTo: null,
      assignedEmail: null,
      status: "unassigned",
      note: null,
      decidedAt: null,
    };
    return acc;
  }, {} as MultiReviewerState);
}

function emit() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function getMultiReviewerState(): MultiReviewerState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as MultiReviewerState;
    // Validate shape
    for (const role of ROLES) {
      if (!parsed[role]) return defaultState();
    }
    return parsed;
  } catch {
    return defaultState();
  }
}

function save(state: MultiReviewerState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  emit();
}

export function assignReviewer(role: ReviewerRole, name: string, email: string) {
  const state = getMultiReviewerState();
  state[role] = {
    ...state[role],
    assignedTo: name,
    assignedEmail: email,
    status: "pending",
    note: null,
    decidedAt: null,
  };
  save(state);
}

export function approveReviewer(role: ReviewerRole, note?: string) {
  const state = getMultiReviewerState();
  if (state[role].status === "unassigned") return;
  state[role] = {
    ...state[role],
    status: "approved",
    note: note?.trim() || null,
    decidedAt: Date.now(),
  };
  save(state);
}

export function requestReviewerRevision(role: ReviewerRole, note: string) {
  const state = getMultiReviewerState();
  if (state[role].status === "unassigned") return;
  state[role] = {
    ...state[role],
    status: "revision_requested",
    note: note.trim(),
    decidedAt: Date.now(),
  };
  save(state);
}

export function resetMultiReviewerState() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  emit();
}

export function getApprovedCount(state: MultiReviewerState): number {
  return ROLES.filter((r) => state[r].status === "approved").length;
}

export function getAssignedCount(state: MultiReviewerState): number {
  return ROLES.filter((r) => state[r].status !== "unassigned").length;
}

export function isAllApproved(state: MultiReviewerState): boolean {
  return ROLES.every((r) => state[r].status === "approved");
}

export function getPendingRoles(state: MultiReviewerState): ReviewerRole[] {
  return ROLES.filter((r) => state[r].status !== "approved");
}

export function getAllRoles(): ReviewerRole[] {
  return ROLES;
}

export function formatRelative(timestamp: number | null): string {
  if (!timestamp) return "";
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export { CHANGE_EVENT as MULTI_REVIEWER_CHANGE_EVENT };