// src/components/Agent02View.tsx
"use client";

import { useState, useEffect } from "react";
import { agent02Content as c } from "@/data/agent02-content";
import { isAgentRun, markAgentForReview, hasAcceptedDisclaimer, acceptDisclaimer } from "@/lib/agentProgress";
import HITLPanel from "@/components/HITLPanel";

type Phase = "idle" | "disclaimer" | "loading" | "done";
const AGENT_ID = "qualification";

const loadingSteps = [
  "Loading capability fit profile",
  "Benchmarking against historical win patterns",
  "Evaluating capacity & bandwidth",
  "Modeling competitive landscape",
  "Computing risk-adjusted score",
  "Drafting recommended bid strategy",
];

export default function Agent02View() {
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
        <section className="rounded-xl border border-blue-300 bg-gradient-to-br from-blue-50 to-white p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">Ready to Score</p>
          <h3 className="mt-2 text-xl font-bold text-slate-900">Run Opportunity Qualification Agent</h3>
          <p className="mt-2 text-sm text-slate-700">Scores this opportunity across 8 capability, commercial, and risk criteria. Benchmarks against historical win patterns and recommends Go / No-Go with bid strategy.</p>
          <button onClick={handleRun} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700">
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
              <button onClick={handleAcceptDisclaimer} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700">Continue</button>
            </div>
          </div>
        </div>
      )}

      {phase === "loading" && (
        <section className="rounded-xl border border-slate-200 bg-white p-8">
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-blue-500" />
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">Agent Running</p>
          </div>
          <h3 className="mt-2 text-lg font-bold text-slate-900">Scoring opportunity…</h3>
          <ul className="mt-6 space-y-3">
            {loadingSteps.map((step, idx) => {
              const isDone = idx < currentStep;
              const isActive = idx === currentStep;
              return (
                <li key={idx} className="flex items-center gap-3">
                  <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${isDone ? "bg-blue-100" : isActive ? "bg-amber-100" : "bg-slate-100"}`}>
                    {isDone ? <svg className="h-3 w-3 text-blue-600" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> : isActive ? <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" /> : <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />}
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
          <section className={`rounded-xl border-2 ${verdictBorder(c.verdict.decision)} ${verdictBg(c.verdict.decision)} p-6`}>
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className={`text-xs font-bold uppercase tracking-widest ${verdictText(c.verdict.decision)}`}>Recommendation</p>
                <h2 className={`mt-2 text-4xl font-extrabold ${verdictText(c.verdict.decision)}`}>{c.verdict.decision}</h2>
                <p className="mt-2 text-sm text-slate-700">Confidence: <span className="font-bold text-slate-900">{c.verdict.confidence}%</span></p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Overall Score</p>
                <p className="mt-1 text-5xl font-extrabold text-slate-900">{c.verdict.overallScore}<span className="text-xl text-slate-400">/100</span></p>
                <div className="mt-2 h-2 w-40 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full ${verdictBar(c.verdict.decision)}`} style={{ width: `${c.verdict.overallScore}%` }} />
                </div>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-4 border-t border-slate-200 pt-4">
              <div><p className="text-xs uppercase tracking-wider text-slate-500">Win Probability</p><p className="mt-1 text-lg font-bold text-slate-900">{c.verdict.winProbability}%</p></div>
              <div><p className="text-xs uppercase tracking-wider text-slate-500">Est. Contract Value</p><p className="mt-1 text-lg font-bold text-slate-900">{c.verdict.estimatedContractValue}</p></div>
              <div><p className="text-xs uppercase tracking-wider text-slate-500">Margin Potential</p><p className="mt-1 text-lg font-bold text-slate-900">{c.verdict.marginPotential}</p></div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Scoring Criteria</p>
            <div className="space-y-4">
              {c.criteria.map((cr, idx) => (
                <div key={idx}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-900">{cr.name}</p>
                    <p className={`text-sm font-bold ${scoreText(cr.score)}`}>{cr.score}<span className="text-xs text-slate-400">/100</span></p>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full rounded-full ${scoreBar(cr.score)}`} style={{ width: `${cr.score}%` }} />
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{cr.rationale}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-2 gap-6">
            <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-emerald-700">✓ Strengths</p>
              <ul className="space-y-2">
                {c.strengths.map((s, idx) => (
                  <li key={idx} className="flex gap-2 text-sm text-slate-800">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    <span className="leading-relaxed">{s}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section className="rounded-xl border border-red-200 bg-red-50 p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-red-700">⚠ Risks</p>
              <ul className="space-y-2">
                {c.risks.map((r, idx) => (
                  <li key={idx} className="flex gap-2 text-sm text-slate-800">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                    <span className="leading-relaxed">{r}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="rounded-xl border border-amber-200 bg-amber-50 p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-amber-700">⚐ Conditions Before Bid</p>
            <ul className="space-y-2">
              {c.conditions.map((cn, idx) => (
                <li key={idx} className="flex gap-2 text-sm text-slate-800">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  <span className="leading-relaxed">{cn}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Recommended Bid Strategy</p>
            <p className="text-sm leading-relaxed text-slate-800">{c.bidStrategy}</p>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Likely Competitors</p>
            <div className="grid grid-cols-2 gap-3">
              {c.competitors.map((comp, idx) => (
                <div key={idx} className="flex items-start justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 p-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{comp.name}</p>
                    <p className="mt-0.5 text-xs text-slate-600">{comp.strength}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${threatClass(comp.threat)}`}>{comp.threat}</span>
                </div>
              ))}
            </div>
          </section>

          <HITLPanel
            agentId={AGENT_ID}
            agentNumber="02"
            agentName="Opportunity Qualification"
            nextAgentId="reference-design"
            nextAgentNumber="03"
            nextAgentName="Reference Design"
            accentColor="blue"
          />
        </>
      )}
    </div>
  );
}

function verdictBorder(d: string) { if (d === "GO") return "border-emerald-400"; if (d === "NO-GO") return "border-red-400"; return "border-amber-400"; }
function verdictBg(d: string) { if (d === "GO") return "bg-gradient-to-br from-emerald-50 to-white"; if (d === "NO-GO") return "bg-gradient-to-br from-red-50 to-white"; return "bg-gradient-to-br from-amber-50 to-white"; }
function verdictText(d: string) { if (d === "GO") return "text-emerald-700"; if (d === "NO-GO") return "text-red-700"; return "text-amber-700"; }
function verdictBar(d: string) { if (d === "GO") return "bg-emerald-500"; if (d === "NO-GO") return "bg-red-500"; return "bg-amber-500"; }
function scoreText(s: number) { if (s >= 80) return "text-emerald-700"; if (s >= 60) return "text-amber-700"; return "text-red-700"; }
function scoreBar(s: number) { if (s >= 80) return "bg-emerald-500"; if (s >= 60) return "bg-amber-500"; return "bg-red-500"; }
function threatClass(t: string) { if (t === "high") return "bg-red-100 text-red-700"; if (t === "medium") return "bg-amber-100 text-amber-700"; return "bg-slate-100 text-slate-600"; }