// src/components/Agent06View.tsx
"use client";

import { useState, useEffect } from "react";
import { agent06Content as c } from "@/data/agent06-content";
import { isAgentRun, markAgentForReview, hasAcceptedDisclaimer, acceptDisclaimer } from "@/lib/agentProgress";
import HITLPanel from "@/components/HITLPanel";

type Phase = "idle" | "disclaimer" | "loading" | "done";
const AGENT_ID = "quote-analysis";

const loadingSteps = [
  "Ingesting received supplier quotes",
  "Normalizing currencies, terms & lead times",
  "Scoring on technical compliance",
  "Scoring on commercial terms",
  "Scoring on supplier experience",
  "Computing total cost of ownership",
  "Ranking suppliers & drafting award recommendation",
];

export default function Agent06View() {
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
        <section className="rounded-xl border border-red-300 bg-gradient-to-br from-red-50 to-white p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-red-700">Ready to Analyze Quotes</p>
          <h3 className="mt-2 text-xl font-bold text-slate-900">Run Quote Analysis Agent</h3>
          <p className="mt-2 text-sm text-slate-700">Normalizes heterogeneous supplier quotes and applies a TCO model across technical, commercial, experience and cost dimensions. Outputs a ranked comparison and an award recommendation.</p>
          <button onClick={handleRun} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Run Agent
          </button>
        </section>
      )}

      {phase === "disclaimer" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-slate-900">Mockup Demonstration</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">This is an illustrative prototype. The intelligence shown is curated to represent what the production Tendering AI platform will produce once integrated with the full LLM, RAG, and document-parsing pipeline.</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-700">No live AI inference is running in this view — the goal is to convey the experience, capabilities, and value of the system end-to-end.</p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button onClick={() => setPhase("idle")} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-500 hover:text-slate-900">Cancel</button>
              <button onClick={handleAcceptDisclaimer} className="rounded-md bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700">Continue</button>
            </div>
          </div>
        </div>
      )}

      {phase === "loading" && (
        <section className="rounded-xl border border-slate-200 bg-white p-8">
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
            <p className="text-xs font-semibold uppercase tracking-wider text-red-700">Agent Running</p>
          </div>
          <h3 className="mt-2 text-lg font-bold text-slate-900">Comparing supplier quotes…</h3>
          <ul className="mt-6 space-y-3">
            {loadingSteps.map((step, idx) => {
              const isDone = idx < currentStep;
              const isActive = idx === currentStep;
              return (
                <li key={idx} className="flex items-center gap-3">
                  <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${isDone ? "bg-red-100" : isActive ? "bg-amber-100" : "bg-slate-100"}`}>
                    {isDone ? <svg className="h-3 w-3 text-red-700" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> : isActive ? <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" /> : <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />}
                  </div>
                  <p className={`text-sm ${isDone ? "text-slate-500 line-through decoration-slate-400" : isActive ? "font-semibold text-slate-900" : "text-slate-400"}`}>
                    {step}
                    {isActive && <span className="ml-2 text-xs text-amber-700">running…</span>}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {phase === "done" && (
        <>
          <section className="rounded-xl border-2 border-emerald-400 bg-gradient-to-br from-emerald-50 to-white p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Recommended Award</p>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900">{c.recommendedSupplier}</h2>
            <p className="mt-2 text-sm text-slate-700">Commodity: <span className="font-semibold text-slate-900">{c.commodity}</span> · {c.quotesReceived} quotes analyzed · {c.analysisDate}</p>
            <p className="mt-4 text-sm leading-relaxed text-slate-800">{c.recommendation}</p>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Scoring Weights Applied</p>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Technical", v: c.scoringWeights.technical, color: "text-emerald-700" },
                { label: "Commercial", v: c.scoringWeights.commercial, color: "text-blue-700" },
                { label: "Experience", v: c.scoringWeights.experience, color: "text-purple-700" },
                { label: "TCO", v: c.scoringWeights.tco, color: "text-amber-700" },
              ].map((w, i) => (
                <div key={i} className="rounded-md border border-slate-200 bg-slate-50 p-3 text-center">
                  <p className={`text-2xl font-bold ${w.color}`}>{w.v}%</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-500">{w.label}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-3 gap-4">
            {c.suppliers.map((s, idx) => (
              <div key={idx} className={`overflow-hidden rounded-xl border ${s.rank === 1 ? "border-emerald-400" : "border-slate-200"} bg-white`}>
                <div className={`flex items-center justify-between border-b border-slate-200 px-4 py-3 ${s.rank === 1 ? "bg-emerald-50" : "bg-slate-50"}`}>
                  <div className="min-w-0">
                    <p className={`text-[10px] font-bold ${s.rank === 1 ? "text-emerald-700" : "text-slate-500"}`}>RANK #{s.rank}</p>
                    <p className="truncate text-sm font-bold text-slate-900">{s.vendor}</p>
                  </div>
                  <p className={`shrink-0 text-3xl font-extrabold ${s.rank === 1 ? "text-emerald-700" : "text-slate-700"}`}>{s.compositeScore}</p>
                </div>

                <div className="space-y-3 p-4">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <Metric label="Price" value={`$${(s.basePrice / 1_000_000).toFixed(2)}M`} />
                    <Metric label="Delivery" value={`${s.deliveryWeeks}w`} />
                    <Metric label="Technical" value={`${s.technicalScore}%`} />
                    <Metric label="Commercial" value={`${s.commercialScore}%`} />
                    <Metric label="Experience" value={`${s.experienceScore}%`} />
                    <Metric label="TCO" value={`${s.tcoScore}%`} />
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">Strengths</p>
                    <ul className="mt-1.5 space-y-1">
                      {s.strengths.slice(0, 2).map((st, si) => (
                        <li key={si} className="flex gap-1.5 text-[11px] text-slate-700">
                          <span className="text-emerald-600">✓</span>
                          <span className="leading-snug">{st}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-700">Concerns</p>
                    <ul className="mt-1.5 space-y-1">
                      {s.concerns.slice(0, 2).map((co, ci) => (
                        <li key={ci} className="flex gap-1.5 text-[11px] text-slate-700">
                          <span className="text-amber-600">⚠</span>
                          <span className="leading-snug">{co}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Recommended Next Steps</p>
            <ol className="space-y-2">
              {c.nextSteps.map((n, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-slate-800">
                  <span className="shrink-0 rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">{idx + 1}</span>
                  <span className="leading-relaxed">{n}</span>
                </li>
              ))}
            </ol>
          </section>

          <HITLPanel
            agentId={AGENT_ID}
            agentNumber="06"
            agentName="Quote Analysis"
            nextAgentId="technical-response"
            nextAgentNumber="07"
            nextAgentName="Technical Response"
            accentColor="emerald"
          />
        </>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-slate-50 px-2 py-1.5">
      <p className="text-[9px] uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-0.5 text-xs font-bold text-slate-900">{value}</p>
    </div>
  );
}