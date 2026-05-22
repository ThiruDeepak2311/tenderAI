// src/lib/agentProgress.ts
// Tiny helpers for tracking which agents have been "run" during the demo.
// Backed by sessionStorage — survives navigation within the tab, resets on tab close.

const STORAGE_KEY = "tendering-ai-progress";

export type ProgressMap = Record<string, boolean>;

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

export function markAgentRun(agentId: string) {
  if (!isBrowser()) return;
  const progress = getProgress();
  progress[agentId] = true;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  // Notify listeners (e.g. sidebar) that progress changed
  window.dispatchEvent(new Event("tendering-ai-progress-change"));
}

export function resetProgress() {
  if (!isBrowser()) return;
  sessionStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("tendering-ai-progress-change"));
}

export function isAgentRun(agentId: string): boolean {
  return !!getProgress()[agentId];
}