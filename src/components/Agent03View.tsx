// src/components/Agent03View.tsx
"use client";

import { useState, useEffect } from "react";
import { agent03Content as c } from "@/data/agent03-content";
import { isAgentRun, markAgentForReview, hasAcceptedDisclaimer, acceptDisclaimer } from "@/lib/agentProgress";
import HITLPanel from "@/components/HITLPanel";

type Phase = "idle" | "disclaimer" | "loading" | "done";
const AGENT_ID = "reference-design";

const loadingSteps = [
  "Querying internal project database",
  "Computing similarity scores against past projects",
  "Retrieving reusable engineering documents",
  "Mapping scope deltas vs reference design",
  "Surfacing lessons learned from project debriefs",
  "Estimating engineering reuse percentage",
];

export default function Agent03View() {
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
          <p className="text-xs font-semibold uppercase tracking-wider text-purple-400">Ready to Search</p>
          <h3 className="mt-2 text-xl font-bold text-white">Run Reference Design Agent</h3>
          <p className="mt-2 text-sm text-slate-300">Searches the project database for similar past projects, retrieves reusable drawings, BOMs and lessons learned, and maps the scope deltas vs the chosen reference.</p>
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
          <h3 className="mt-2 text-lg font-bold text-white">Searching reference projects…</h3>
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
          <section className="rounded-xl border-2 border-purple-500/40 bg-gradient-to-br from-purple-500/10 to-slate-900 p-6">
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-widest text-purple-400">Best Reference Match</p>
                <h2 className="mt-2 text-2xl font-extrabold text-white">{c.bestMatch.project}</h2>
                <p className="mt-1 text-sm text-slate-300">{c.bestMatch.client} · {c.bestMatch.location} · {c.bestMatch.year}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-200">{c.bestMatch.scope}</p>
                <p className="mt-3 text-xs italic text-emerald-400">✓ {c.bestMatch.outcome}</p>
              </div>
              <div className="text-center">
                <div className="rounded-xl border-2 border-purple-500 bg-purple-500/15 px-5 py-3">
                  <p className="text-4xl font-extrabold text-purple-400">{c.bestMatch.similarity}<span className="text-lg">%</span></p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Similarity</p>
                </div>
                <p className="mt-2 text-xs text-slate-400">{c.bestMatch.contractValue} contract</p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Other Reference Projects Matched</p>
            <div className="space-y-2">
              {c.referenceProjects.map((p, idx) => (
                <div key={idx} className="flex items-start justify-between gap-4 rounded-md border border-slate-800 bg-slate-900/50 p-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">{p.project}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{p.client} · {p.location} · {p.year}</p>
                    <p className="mt-1 text-xs text-slate-300"><span className="text-slate-500">Δ </span>{p.keyDelta}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-lg font-bold text-purple-400">{p.similarity}%</p>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500">match</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Reusable Engineering Documents</p>
            <div className="space-y-2">
              {c.reusableDocuments.map((d, idx) => (
                <div key={idx} className="flex items-start gap-3 rounded-md border border-slate-800 bg-slate-900/50 p-3">
                  <span className="shrink-0 rounded bg-purple-500/15 px-2 py-0.5 text-[10px] font-bold text-purple-400">{d.docType}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white">{d.docNo}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{d.relevance}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-amber-400">⚠ Scope Deltas — Adjustments Required</p>
            <div className="space-y-3">
              {c.scopeDeltas.map((d, idx) => (
                <div key={idx} className="rounded-md border border-amber-500/20 bg-slate-900/50 p-3">
                  <p className="text-sm font-semibold text-white">{d.parameter}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    <span className="text-slate-500">Reference:</span> {d.reference}
                    <span className="mx-2 text-amber-400">→</span>
                    <span className="text-slate-500">Required:</span> <span className="text-white">{d.required}</span>
                  </p>
                  <p className="mt-1 text-xs text-amber-300">Action: {d.action}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">💡 Lessons Learned (from past project debriefs)</p>
            <ul className="space-y-2">
              {c.lessonsLearned.map((l, idx) => (
                <li key={idx} className="flex gap-2 text-sm text-slate-200">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />
                  <span className="leading-relaxed">{l}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-slate-900 p-5">
            <div className="flex items-center gap-5">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-purple-400">Engineering Reuse Estimate</p>
                <p className="mt-1 text-sm text-slate-300">Estimated portion of engineering scope reusable from past projects.</p>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-purple-400" style={{ width: `${c.estimatedEngineeringReuse}%` }} />
                </div>
              </div>
              <p className="text-5xl font-extrabold text-purple-400">{c.estimatedEngineeringReuse}<span className="text-2xl text-slate-500">%</span></p>
            </div>
          </section>

          <HITLPanel
            agentId={AGENT_ID}
            agentNumber="03"
            agentName="Reference Design"
            nextAgentId="bom-scope"
            nextAgentNumber="04"
            nextAgentName="BOM & Scope"
            accentColor="purple"
          />
        </>
      )}
    </div>
  );
}