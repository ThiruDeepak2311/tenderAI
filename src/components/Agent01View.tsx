// src/components/Agent01View.tsx
"use client";

import { useState, useEffect } from "react";
import { agent01Content as c } from "@/data/agent01-content";
import { isAgentRun, markAgentForReview, hasAcceptedDisclaimer, acceptDisclaimer } from "@/lib/agentProgress";
import HITLPanel from "@/components/HITLPanel";

type Phase = "idle" | "disclaimer" | "loading" | "done";
const AGENT_ID = "rfi-intelligence";

const loadingSteps = [
  "Parsing PDF document",
  "Extracting project metadata",
  "Identifying key dates & deadlines",
  "Detecting technical requirements",
  "Cross-referencing standards & regulations",
  "Mapping evaluation criteria",
  "Scanning compliance obligations",
  "Flagging risks & ambiguities",
];

export default function Agent01View() {
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

  const linkClass = "rounded-md border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-emerald-500/50 hover:text-emerald-400";

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Source Document</p>
              <p className="mt-1 font-semibold text-white">{c.document.fileName}</p>
              <p className="mt-0.5 text-xs text-slate-400">{c.document.pageCount} pages · {c.document.fileSize}{phase === "done" ? ` · parsed ${c.document.parsedAt}` : " · awaiting processing"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {phase === "done" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {c.document.status}
              </span>
            )}
            <a href={c.document.fileUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>Open PDF</a>
          </div>
        </div>
      </section>

      {phase === "idle" && (
        <section className="rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-slate-900 p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Ready to Process</p>
          <h3 className="mt-2 text-xl font-bold text-white">Run RFI Intelligence Agent</h3>
          <p className="mt-2 text-sm text-slate-300">The agent will parse the tender document and extract structured intelligence — project metadata, key dates, scope, technical requirements, standards, evaluation criteria, compliance items, and risk flags.</p>
          <button onClick={handleRun} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
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
              <button onClick={handleAcceptDisclaimer} className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-emerald-400">Continue</button>
            </div>
          </div>
        </div>
      )}

      {phase === "loading" && (
        <section className="rounded-xl border border-slate-800 bg-slate-900 p-8">
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Agent Running</p>
          </div>
          <h3 className="mt-2 text-lg font-bold text-white">Processing tender document…</h3>
          <ul className="mt-6 space-y-3">
            {loadingSteps.map((step, idx) => {
              const isDone = idx < currentStep;
              const isActive = idx === currentStep;
              return (
                <li key={idx} className="flex items-center gap-3">
                  <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${isDone ? "bg-emerald-500/20" : isActive ? "bg-amber-500/20" : "bg-slate-800"}`}>
                    {isDone ? (
                      <svg className="h-3 w-3 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    ) : isActive ? (
                      <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />
                    )}
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
          <Card label="Project Overview">
            <dl className="grid grid-cols-2 gap-4">
              <Field k="Client" v={c.projectOverview.client} />
              <Field k="RFP Number" v={c.projectOverview.rfpNumber} />
              <Field k="Project" v={c.projectOverview.projectTitle} />
              <Field k="Location" v={c.projectOverview.location} />
              <Field k="Scope Type" v={c.projectOverview.scopeType} />
              <Field k="Contract Structure" v={c.projectOverview.contractStructure} />
              <Field k="Issue Date" v={c.projectOverview.issueDate} />
            </dl>
          </Card>

          <Card label="Key Dates Detected">
            <ol className="relative space-y-3 border-l border-slate-800 pl-5">
              {c.keyDates.map((d, idx) => (
                <li key={idx} className="relative">
                  <span className={`absolute -left-[27px] top-1.5 h-2.5 w-2.5 rounded-full ${dotColor(d.type)}`} />
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-sm text-slate-200">{d.label}</p>
                    <p className={`text-xs font-semibold ${textColor(d.type)}`}>{d.date}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Card>

          <Card label="Scope of Work — Summary">
            <ul className="space-y-2">
              {c.scopeSummary.map((line, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-slate-200">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  <span className="leading-relaxed">{line}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card label="Technical Requirements Extracted">
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {c.technicalRequirements.map((r, idx) => (
                <div key={idx} className="flex items-baseline justify-between gap-3 border-b border-slate-800/60 pb-2 last:border-b-0">
                  <p className="text-xs text-slate-400">{r.parameter}</p>
                  <p className="text-sm font-semibold text-white">{r.value}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card label="Standards & Regulations Referenced">
            <div className="space-y-2">
              {c.standardsDetected.map((s, idx) => (
                <div key={idx} className="flex items-start gap-3 rounded-md border border-slate-800 bg-slate-900/50 p-3">
                  <span className="shrink-0 rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">{s.body}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">{s.code}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card label="Evaluation Criteria & Weighting">
            <div className="space-y-2">
              {c.evaluationCriteria.map((e, idx) => (
                <div key={idx} className="flex items-center justify-between gap-4 rounded-md border border-slate-800 bg-slate-900/50 p-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">{e.criterion}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{e.detail}</p>
                  </div>
                  <span className="shrink-0 rounded-md bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">{e.weight}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card label="Mandatory Compliance Items">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
              {c.complianceChecklist.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-200">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card label="⚠ Flagged for Human Review" tone="warning">
            <div className="space-y-3">
              {c.flaggedForReview.map((f, idx) => (
                <div key={idx} className="rounded-md border border-amber-500/20 bg-amber-500/5 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-white">{f.title}</p>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${severityClass(f.severity)}`}>{f.severity}</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-300">{f.detail}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* HITL approval panel */}
          <HITLPanel
            agentId={AGENT_ID}
            agentNumber="01"
            agentName="RFI Intelligence"
            nextAgentId="qualification"
            nextAgentNumber="02"
            nextAgentName="Opportunity Qualification"
            accentColor="emerald"
          />
        </>
      )}
    </div>
  );
}

function Card({ label, children, tone = "default" }: { label: string; children: React.ReactNode; tone?: "default" | "warning" }) {
  const borderClass = tone === "warning" ? "border-amber-500/30" : "border-slate-800";
  return (
    <section className={`rounded-xl border ${borderClass} bg-slate-900 p-5`}>
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      {children}
    </section>
  );
}
function Field({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-400">{k}</dt>
      <dd className="mt-0.5 text-sm font-semibold text-white">{v}</dd>
    </div>
  );
}
function dotColor(type: string) {
  if (type === "critical") return "bg-red-400";
  if (type === "warning") return "bg-amber-400";
  return "bg-emerald-400";
}
function textColor(type: string) {
  if (type === "critical") return "text-red-400";
  if (type === "warning") return "text-amber-400";
  return "text-slate-300";
}
function severityClass(s: string) {
  if (s === "high") return "bg-red-500/15 text-red-400";
  if (s === "medium") return "bg-amber-500/15 text-amber-400";
  return "bg-slate-700 text-slate-300";
}