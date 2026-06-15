// src/components/InitiateReviewChatbot.tsx
// Chatbot UI that walks the user through assigning the 4 reviewers for Live Agent 02.

"use client";

import { useState, useEffect, useRef } from "react";
import {
  assignReviewer,
  getMultiReviewerState,
  ROLE_META,
  type ReviewerRole,
} from "@/lib/multiReviewerState";

type Props = {
  open: boolean;
  onClose: () => void;
};

type Message = {
  id: string;
  role: "bot" | "user";
  text: string;
  options?: Array<{ name: string; email: string }>;
  timestamp: number;
};

const ROLES_ORDER: ReviewerRole[] = ["technical", "commercial", "legal", "regional"];

// Mock team roster — suggestions per role (realistic-feeling internal team)
const SUGGESTIONS: Record<ReviewerRole, Array<{ name: string; email: string }>> = {
  technical: [
    { name: "Priya Sharma", email: "priya.sharma@mcdermott.com" },
    { name: "Anjali Krishnan", email: "anjali.k@mcdermott.com" },
    { name: "Raghav Iyer", email: "raghav.iyer@mcdermott.com" },
  ],
  commercial: [
    { name: "Karthik Subramanian", email: "karthik.s@mcdermott.com" },
    { name: "Meera Pillai", email: "meera.pillai@mcdermott.com" },
    { name: "Vikram Reddy", email: "vikram.r@mcdermott.com" },
  ],
  legal: [
    { name: "Adv. Rohini Menon", email: "rohini.menon@mcdermott.com" },
    { name: "Sandeep Bhatt", email: "sandeep.bhatt@mcdermott.com" },
    { name: "Adv. Hari Krishnan", email: "hari.k@mcdermott.com" },
  ],
  regional: [
    { name: "Diego Morales", email: "diego.morales@mcdermott-tx.com" },
    { name: "Sarah Hutchins", email: "sarah.h@mcdermott-tx.com" },
    { name: "James Ortega", email: "j.ortega@mcdermott-tx.com" },
  ],
};

export default function InitiateReviewChatbot({ open, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentRoleIdx, setCurrentRoleIdx] = useState(0);
  const [input, setInput] = useState("");
  const [finished, setFinished] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize conversation when opened
  useEffect(() => {
    if (!open) return;

    // Detect which roles are already assigned — start with first unassigned
    const state = getMultiReviewerState();
    const firstUnassigned = ROLES_ORDER.findIndex((r) => state[r].status === "unassigned");
    const startIdx = firstUnassigned === -1 ? 0 : firstUnassigned;

    setCurrentRoleIdx(startIdx);
    setInput("");

    if (firstUnassigned === -1) {
      // All assigned already — show a "manage" mode
      setFinished(true);
      const summaryLines = ROLES_ORDER.map((r) => {
        const slot = state[r];
        return `• ${ROLE_META[r].shortLabel}: ${slot.assignedTo}`;
      }).join("\n");
      setMessages([
        botMsg(`All 4 reviewers are currently assigned:\n\n${summaryLines}\n\nTo change an assignment, please reset reviewers from the panel first, then reopen this chat.`),
      ]);
    } else {
      setFinished(false);
      setMessages([
        botMsg(`Hi 👋 I'll help you assign reviewers for this Opportunity Qualification output.\n\nThere are 4 reviewer lanes — Technical, Commercial, Legal, and Regional. Each lane reviews the lane it specializes in.\n\nLet's start with the first one.`),
        botMsg(buildAskMessage(ROLES_ORDER[startIdx])),
      ]);
    }
  }, [open]);

  // Autoscroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!open) return null;

  const currentRole = ROLES_ORDER[currentRoleIdx];
  const suggestions = currentRole ? SUGGESTIONS[currentRole] : [];

  const handleAssignFromSuggestion = (name: string, email: string) => {
    if (finished) return;
    handleAssignment(name, email);
  };

  const handleSubmitTyped = () => {
    if (finished) return;
    const text = input.trim();
    if (!text) return;

    // Try to parse "Name, email" or "Name <email>" or just "Name"
    let name = "";
    let email = "";

    const commaMatch = text.match(/^(.+?),\s*(.+@.+)$/);
    const angleMatch = text.match(/^(.+?)\s*<\s*(.+@.+)\s*>$/);

    if (commaMatch) {
      name = commaMatch[1].trim();
      email = commaMatch[2].trim();
    } else if (angleMatch) {
      name = angleMatch[1].trim();
      email = angleMatch[2].trim();
    } else if (text.includes("@")) {
      // Just email
      email = text;
      name = text.split("@")[0].replace(/\./g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    } else {
      // Just name — generate email
      name = text;
      email = `${text.toLowerCase().replace(/\s+/g, ".")}@mcdermott.com`;
    }

    setInput("");
    handleAssignment(name, email);
  };

  const handleAssignment = (name: string, email: string) => {
    if (!currentRole) return;

    // Echo user's choice
    const userText = `${name} (${email})`;
    setMessages((m) => [...m, userMsg(userText)]);

    // Commit to state
    assignReviewer(currentRole, name, email);

    // Move to next role or finish
    const nextIdx = currentRoleIdx + 1;
    if (nextIdx < ROLES_ORDER.length) {
      const nextRole = ROLES_ORDER[nextIdx];
      setMessages((m) => [
        ...m,
        botMsg(`✓ Assigned ${ROLE_META[currentRole].shortLabel} review to ${name}.`),
        botMsg(buildAskMessage(nextRole)),
      ]);
      setCurrentRoleIdx(nextIdx);
    } else {
      setFinished(true);
      setMessages((m) => [
        ...m,
        botMsg(`✓ Assigned ${ROLE_META[currentRole].shortLabel} review to ${name}.`),
        botMsg(buildSummary()),
      ]);
    }
  };

  const handleSkip = () => {
    if (finished || !currentRole) return;
    setMessages((m) => [
      ...m,
      userMsg("Skip this for now"),
      botMsg(`Okay, leaving ${ROLE_META[currentRole].shortLabel} unassigned. You can assign later from the panel.`),
    ]);

    const nextIdx = currentRoleIdx + 1;
    if (nextIdx < ROLES_ORDER.length) {
      setMessages((m) => [...m, botMsg(buildAskMessage(ROLES_ORDER[nextIdx]))]);
      setCurrentRoleIdx(nextIdx);
    } else {
      setFinished(true);
      setMessages((m) => [...m, botMsg(buildSummary())]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-0 sm:items-center sm:justify-end sm:p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={onClose} />

      {/* Chat panel */}
      <div className="relative flex h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl border border-slate-200 bg-white shadow-2xl sm:h-[680px] sm:rounded-2xl">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-blue-50 to-emerald-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 text-white">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Initiate Review</p>
              <p className="text-xs text-slate-600">Reviewer Assignment Assistant</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        {/* Progress strip */}
        {!finished && (
          <div className="border-b border-slate-200 bg-slate-50 px-5 py-2">
            <div className="flex items-center gap-1.5">
              {ROLES_ORDER.map((r, idx) => (
                <div
                  key={r}
                  className={`h-1 flex-1 rounded-full ${
                    idx < currentRoleIdx ? "bg-emerald-500" : idx === currentRoleIdx ? "bg-blue-500" : "bg-slate-200"
                  }`}
                />
              ))}
            </div>
            <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Step {currentRoleIdx + 1} of {ROLES_ORDER.length} · {currentRole && ROLE_META[currentRole].shortLabel} Reviewer
            </p>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 space-y-3 overflow-y-auto p-5">
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}

          {/* Suggestion chips */}
          {!finished && currentRole && (
            <div className="mt-3">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Suggested from team roster
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s.email}
                    onClick={() => handleAssignFromSuggestion(s.name, s.email)}
                    className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:border-blue-400 hover:bg-blue-100"
                  >
                    {s.name}
                  </button>
                ))}
                <button
                  onClick={handleSkip}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  Skip for now
                </button>
              </div>
            </div>
          )}

          {finished && (
            <div className="mt-3 flex justify-center">
              <button
                onClick={onClose}
                className="rounded-md bg-emerald-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                Close & View Panel
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {!finished && (
          <div className="border-t border-slate-200 bg-white p-3">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmitTyped();
                }}
                placeholder="Type name, email…"
                className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
              />
              <button
                onClick={handleSubmitTyped}
                disabled={!input.trim()}
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="mt-1.5 text-[10px] text-slate-500">
              Format: <span className="font-mono">Name, email@company.com</span> · or pick a suggestion above
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isBot = message.role === "bot";
  return (
    <div className={`flex ${isBot ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
          isBot
            ? "rounded-tl-sm bg-slate-100 text-slate-900"
            : "rounded-tr-sm bg-blue-600 text-white"
        }`}
      >
        <p className="whitespace-pre-line text-sm leading-relaxed">{message.text}</p>
      </div>
    </div>
  );
}

function buildAskMessage(role: ReviewerRole): string {
  const meta = ROLE_META[role];
  return `Who should review the **${meta.shortLabel}** lane?\n\n${meta.description}\n\nLane focus: ${meta.focus}`;
}

function buildSummary(): string {
  const state = getMultiReviewerState();
  const lines = ROLES_ORDER.map((r) => {
    const slot = state[r];
    if (slot.status === "unassigned") {
      return `• ${ROLE_META[r].shortLabel}: — (skipped)`;
    }
    return `• ${ROLE_META[r].shortLabel}: ${slot.assignedTo}`;
  }).join("\n");

  return `All set ✓\n\nHere's the final assignment:\n\n${lines}\n\nThe panel below will reflect these assignments. Each reviewer can now Approve or Request Revision on their lane. The agent output will be marked Approved only after all 4 reviewers sign off.`;
}

function botMsg(text: string): Message {
  return { id: Math.random().toString(36).slice(2), role: "bot", text, timestamp: Date.now() };
}
function userMsg(text: string): Message {
  return { id: Math.random().toString(36).slice(2), role: "user", text, timestamp: Date.now() };
}