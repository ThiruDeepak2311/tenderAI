// src/components/Agent07View.tsx
"use client";

import { useState, useEffect } from "react";
import { agent07Content as c } from "@/data/agent07-content";
import { isAgentRun, markAgentForReview, hasAcceptedDisclaimer, acceptDisclaimer } from "@/lib/agentProgress";
import HITLPanel from "@/components/HITLPanel";

type Phase = "idle" | "disclaimer" | "loading" | "done";
const AGENT_ID = "technical-response";

const loadingSteps = [
  "Loading client questionnaire (TQ-01 to TQ-06)",
  "Searching knowledge base & past proposals",
  "Retrieving applicable standards (API, ASME, NACE)",
  "Drafting answers with citations",
  "Scoring confidence & compliance per question",
  "Building deviations register",
];

export default function Agent07View() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isAgentRun(AGENT_ID)) setPhase("done");
    const onChange = () => { if (!isAgentRun(AGENT_ID)) setPhase("idle"); };
    window.addEventListener("tendering-ai-progress-change", onChange);
    return () => window.removeEventListener("tendering-ai-progress-change", onChange);
  }, []);

  useEffect(() => {
    if (phase !== "loading") return;
    setCurrentStep(0);
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const next = prev + 1;
        if (next >= loadingSteps.length) {
          clearInterval(interval);
          setTimeout(() => { markAgentForReview(AGENT_ID); setPhase("done"); }, 800);
          return loadingSteps.length;
        }
        return next;
      });
    }, 900);
    return () => clearInterval(interval);
  }, [phase]);

  const handleRun = () => {
    if (hasAcceptedDisclaimer()) setPhase("loading");
    else setPhase("disclaimer");
  };
  const handleAcceptDisclaimer = () => { acceptDisclaimer(); setPhase("loading"); };

  return (
    <div className="space-y-6">
      {phase === "idle" && (
        <section className="rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-slate-900 p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-purple-400">Ready to Draft Response</p>
          <h3 className="mt-2 text-xl font-bold text-white">Run Technical Response Agent</h3>
          <p className="mt-2 text-sm text-slate-300">Drafts answers to the client's technical questionnaire using the company knowledge base, past proposals, and applicable engineering standards. Outputs compliance ratings per question and a deviations register.</p>
          <button onClick={handleRun} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-purple-500 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-purple-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Run Agent
          </button>
        </section>
      )}

      {phase === "disclaimer" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-white">Mockup Demonstration</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">This is an illustrative prototype. The intelligence shown is curated to represent what the production Tendering AI platform will produce once integrated with the full LLM, RAG, and document-parsing pipeline.</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">No live AI inference is running in this view — the goal is to convey the experience, capabilities, and value of the system end-to-end.</p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button onClick={() => setPhase("idle")} className="rounded-md border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white">Cancel</button>
              <button onClick={handleAcceptDisclaimer} className="rounded-md bg-purple-500 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-purple-400">Continue</button>
            </div>
          </div>
        </div>
      )}

      {phase === "loading" && (
        <section className="rounded-xl border border-slate-800 bg-slate-900 p-8">
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-purple-400" />
            <p className="text-xs font-semibold uppercase tracking-wider text-purple-400">Agent Running</p>
          </div>
          <h3 className="mt-2 text-lg font-bold text-white">Drafting technical responses…</h3>
          <ul className="mt-6 space-y-3">
            {loadingSteps.map((step, idx) => {
              const isDone = idx < currentStep;
              const isActive = idx === currentStep;
              return (
                <li key={idx} className="flex items-center gap-3">
                  <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${isDone ? "bg-purple-500/20" : isActive ? "bg-amber-500/20" : "bg-slate-800"}`}>
                    {isDone ? <svg className="h-3 w-3 text-purple-400" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> : isActive ? <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" /> : <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />}
                  </div>
                  <p className={`text-sm ${isDone ? "text-slate-300 line-through decoration-slate-600" : isActive ? "font-semibold text-white" : "text-slate-500"}`}>
                    {step}
                    {isActive && <span className="ml-2 text-xs text-amber-400">running…</span>}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {phase === "done" && (
        <>
          {/* Summary tiles */}
          <section className="grid grid-cols-5 gap-3">
            <Tile label="Total Q's" value={c.summary.totalQuestions} color="purple" />
            <Tile label="Fully Compliant" value={c.summary.fullyCompliant} color="emerald" />
            <Tile label="Partial" value={c.summary.partiallyCompliant} color="amber" />
            <Tile label="Avg Confidence" value={`${c.summary.avgConfidence}%`} color="blue" />
            <Tile label="Sources Used" value={c.summary.sourcesUsed} color="slate" />
          </section>

          {/* Q&A cards */}
          {c.responses.map((r, idx) => (
            <section key={idx} className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
              <div className={`flex items-start justify-between gap-4 border-b border-slate-800 p-4 ${complianceHeaderBg(r.compliance)}`}>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{r.no}</p>
                  <p className="mt-1 text-sm font-semibold text-white">{r.question}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${confidenceStyle(r.confidence)}`}>
                    Conf: {r.confidence}%
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${complianceStyle(r.compliance)}`}>
                    {r.compliance}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <p className="text-sm leading-relaxed text-slate-200">{r.answer}</p>

                {r.caveat && (
                  <p className="mt-3 rounded-md border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs italic text-amber-300">
                    ⚠ {r.caveat}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-800 pt-3">
                  {r.standardsCited.map((s, si) => (
                    <span key={si} className="rounded bg-purple-500/15 px-2 py-0.5 text-[10px] font-bold text-purple-300">
                      {s}
                    </span>
                  ))}
                  <span className="ml-auto text-[11px] text-slate-500">📚 Source: {r.source}</span>
                </div>
              </div>
            </section>
          ))}

          {/* Deviations register */}
          {c.deviationsRegister.length > 0 && (
            <section className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-amber-400">⚠ Deviations Register</p>
              <div className="space-y-2">
                {c.deviationsRegister.map((d, idx) => (
                  <div key={idx} className="rounded-md border border-amber-500/20 bg-slate-900/50 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-amber-400">{d.ref}</p>
                        <p className="mt-0.5 text-sm font-semibold text-white">{d.deviation}</p>
                        <p className="mt-1 text-xs text-slate-300">↳ Mitigation: {d.mitigation}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${riskStyle(d.risk)}`}>{d.risk}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <HITLPanel
            agentId={AGENT_ID}
            agentNumber="07"
            agentName="Technical Response"
            nextAgentId="proposal-assembly"
            nextAgentNumber="08"
            nextAgentName="Proposal Assembly"
            accentColor="purple"
          />
        </>
      )}
    </div>
  );
}

function Tile({ label, value, color }: { label: string; value: string | number; color: "purple" | "emerald" | "amber" | "blue" | "slate" }) {
  const map = {
    purple: { border: "border-purple-500/30", text: "text-purple-400" },
    emerald: { border: "border-emerald-500/30", text: "text-emerald-400" },
    amber: { border: "border-amber-500/30", text: "text-amber-400" },
    blue: { border: "border-blue-500/30", text: "text-blue-400" },
    slate: { border: "border-slate-700", text: "text-slate-300" },
  }[color];
  return (
    <div className={`rounded-xl border ${map.border} bg-slate-900 p-4 text-center`}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <p className={`mt-1 text-2xl font-extrabold ${map.text}`}>{value}</p>
    </div>
  );
}

function complianceHeaderBg(c: string) {
  if (c === "FULLY COMPLIANT") return "bg-emerald-500/5";
  if (c === "PARTIALLY COMPLIANT") return "bg-amber-500/5";
  return "bg-red-500/5";
}
function complianceStyle(c: string) {
  if (c === "FULLY COMPLIANT") return "bg-emerald-500/15 text-emerald-400";
  if (c === "PARTIALLY COMPLIANT") return "bg-amber-500/15 text-amber-400";
  return "bg-red-500/15 text-red-400";
}
function confidenceStyle(v: number) {
  if (v >= 90) return "bg-emerald-500/15 text-emerald-400";
  if (v >= 75) return "bg-amber-500/15 text-amber-400";
  return "bg-red-500/15 text-red-400";
}
function riskStyle(r: string) {
  if (r === "HIGH") return "bg-red-500/15 text-red-400";
  if (r === "MEDIUM") return "bg-amber-500/15 text-amber-400";
  return "bg-emerald-500/15 text-emerald-400";
}