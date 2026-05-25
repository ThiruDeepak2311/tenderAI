// src/components/Agent08View.tsx
"use client";

import { useState, useEffect } from "react";
import { agent08Content as c } from "@/data/agent08-content";
import { isAgentRun, markAgentForReview, hasAcceptedDisclaimer, acceptDisclaimer } from "@/lib/agentProgress";
import HITLPanel from "@/components/HITLPanel";

type Phase = "idle" | "disclaimer" | "loading" | "done";
const AGENT_ID = "proposal-assembly";

const loadingSteps = [
  "Collecting outputs from Agents 01–07",
  "Applying client template & formatting rules",
  "Running cross-section consistency checks",
  "Generating executive summary",
  "Building commercial summary & milestone schedule",
  "Compiling submission readiness checklist",
  "Sealing the final proposal package",
];

export default function Agent08View() {
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

  const readyCount = c.readinessChecklist.filter((i) => i.status === "ready").length;
  const totalChecklist = c.readinessChecklist.length;

  return (
    <div className="space-y-6">
      {phase === "idle" && (
        <section className="rounded-xl border border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-slate-900 p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-orange-400">Ready to Assemble</p>
          <h3 className="mt-2 text-xl font-bold text-white">Run Proposal Assembly Agent</h3>
          <p className="mt-2 text-sm text-slate-300">Consolidates outputs from all upstream agents into the final bid package. Generates the executive summary, applies client formatting, runs consistency checks, and produces the submission readiness checklist.</p>
          <button onClick={handleRun} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-orange-400">
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
              <button onClick={handleAcceptDisclaimer} className="rounded-md bg-orange-500 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-orange-400">Continue</button>
            </div>
          </div>
        </div>
      )}

      {phase === "loading" && (
        <section className="rounded-xl border border-slate-800 bg-slate-900 p-8">
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-orange-400" />
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-400">Agent Running</p>
          </div>
          <h3 className="mt-2 text-lg font-bold text-white">Assembling final proposal…</h3>
          <ul className="mt-6 space-y-3">
            {loadingSteps.map((step, idx) => {
              const isDone = idx < currentStep;
              const isActive = idx === currentStep;
              return (
                <li key={idx} className="flex items-center gap-3">
                  <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${isDone ? "bg-orange-500/20" : isActive ? "bg-amber-500/20" : "bg-slate-800"}`}>
                    {isDone ? <svg className="h-3 w-3 text-orange-400" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> : isActive ? <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" /> : <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />}
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
          {/* Hero — proposal cover summary */}
          <section className="rounded-xl border-2 border-orange-500/40 bg-gradient-to-br from-orange-500/10 to-slate-900 p-6">
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-widest text-orange-400">{c.proposalRef}</p>
                <h2 className="mt-2 text-2xl font-extrabold text-white">{c.title}</h2>
                <p className="mt-1 text-sm text-slate-300">Submitted to: <span className="font-semibold text-white">{c.client}</span></p>
                <p className="text-sm text-slate-300">By: <span className="font-semibold text-white">{c.submittedBy}</span></p>
                <p className="mt-2 text-xs text-slate-500">Submission Date: {c.submissionDate} · Validity: {c.validity}</p>
              </div>
              <div className="shrink-0 text-center">
                <div className="rounded-xl border-2 border-orange-500 bg-orange-500/15 px-5 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-orange-400">Status</p>
                  <p className="mt-1 text-base font-extrabold text-white">{c.submissionStatus}</p>
                </div>
                <p className="mt-2 text-xs text-slate-400">{c.totalPages} pages total</p>
              </div>
            </div>
            <div className="mt-5 rounded-lg border border-orange-500/20 bg-slate-900/50 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-orange-400">Executive Summary</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-200">{c.executiveSummary}</p>
            </div>
          </section>

          {/* Commercial summary + readiness checklist side by side */}
          <div className="grid grid-cols-2 gap-6">
            {/* Commercial */}
            <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Commercial Summary</p>
              <p className="mt-2 text-4xl font-extrabold text-emerald-400">{c.commercialSummary.totalLumpSum}</p>
              <p className="text-xs text-slate-400">Lump Sum USD · {c.commercialSummary.deliveryWeeksFromPO} weeks delivery</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-md bg-slate-800/40 px-2 py-1.5">
                  <p className="text-[9px] uppercase tracking-wider text-slate-500">Contingency</p>
                  <p className="mt-0.5 text-sm font-bold text-white">{c.commercialSummary.contingencyPct}</p>
                </div>
                <div className="rounded-md bg-slate-800/40 px-2 py-1.5">
                  <p className="text-[9px] uppercase tracking-wider text-slate-500">Target Margin</p>
                  <p className="mt-0.5 text-sm font-bold text-white">{c.commercialSummary.marginPct}</p>
                </div>
              </div>

              <p className="mt-4 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Milestone Payments</p>
              <div className="mt-2 space-y-1.5">
                {c.commercialSummary.milestones.map((m, idx) => (
                  <div key={idx} className="flex items-baseline justify-between gap-3 border-b border-slate-800/60 pb-1.5 last:border-b-0">
                    <p className="min-w-0 truncate text-xs text-slate-300">{m.name}</p>
                    <div className="flex shrink-0 items-baseline gap-3">
                      <span className="text-[10px] text-slate-500">{m.pct}%</span>
                      <span className="text-xs font-semibold text-emerald-400">{m.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Readiness checklist */}
            <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Readiness Checklist</p>
                <p className={`text-xs font-bold ${readyCount === totalChecklist ? "text-emerald-400" : "text-amber-400"}`}>
                  {readyCount}/{totalChecklist}
                </p>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div className={`h-full rounded-full ${readyCount === totalChecklist ? "bg-emerald-400" : "bg-amber-400"}`} style={{ width: `${(readyCount / totalChecklist) * 100}%` }} />
              </div>
              <ul className="mt-4 space-y-1.5">
                {c.readinessChecklist.map((item, idx) => (
                  <li key={idx} className="flex items-center justify-between gap-3 border-b border-slate-800/60 pb-1.5 last:border-b-0">
                    <p className="text-xs text-slate-300">{item.item}</p>
                    {item.status === "ready" ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-400">
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        Ready
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-amber-400">
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
                        Pending
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Proposal sections index */}
          <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Proposal Sections — {c.proposalSections.length} sections · {c.totalPages} pages
            </p>
            <div className="grid grid-cols-2 gap-2">
              {c.proposalSections.map((s, idx) => (
                <div key={idx} className="flex items-center gap-3 rounded-md border border-slate-800 bg-slate-900/50 p-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-orange-500/15 text-xs font-bold text-orange-400">
                    {s.no}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{s.title}</p>
                    <p className="text-[10px] text-slate-500">
                      {s.pages} pages ·{" "}
                      <span className={s.status === "READY" ? "text-emerald-400" : "text-amber-400"}>
                        {s.status}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Differentiators */}
          <section className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-emerald-400">★ Key Differentiators</p>
            <ul className="space-y-2">
              {c.differentiators.map((d, idx) => (
                <li key={idx} className="flex gap-2 text-sm text-slate-200">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  <span className="leading-relaxed">{d}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Final recommendation */}
          <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Bid Director — Final Recommendation</p>
            <p className="text-sm leading-relaxed text-slate-200">{c.finalRecommendation}</p>
          </section>

          {/* Final HITL — closes the pipeline */}
          <HITLPanel
            agentId={AGENT_ID}
            agentNumber="08"
            agentName="Proposal Assembly"
            accentColor="amber"
          />
        </>
      )}
    </div>
  );
}