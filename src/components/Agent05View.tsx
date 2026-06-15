// src/components/Agent05View.tsx
"use client";

import { useState, useEffect } from "react";
import { agent05Content as c } from "@/data/agent05-content";
import { isAgentRun, markAgentForReview, hasAcceptedDisclaimer, acceptDisclaimer } from "@/lib/agentProgress";
import HITLPanel from "@/components/HITLPanel";

type Phase = "idle" | "disclaimer" | "loading" | "done";
const AGENT_ID = "supplier-rfq";

const loadingSteps = [
  "Grouping BOM items by commodity",
  "Matching approved vendor list per commodity",
  "Drafting RFQ packages from templates",
  "Attaching datasheets & compliance matrices",
  "Setting commercial terms & deadlines",
  "Queueing RFQs for issuance",
];

export default function Agent05View() {
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
        <section className="rounded-xl border border-emerald-300 bg-gradient-to-br from-emerald-50 to-white p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Ready to Issue RFQs</p>
          <h3 className="mt-2 text-xl font-bold text-slate-900">Run Supplier RFQ Agent</h3>
          <p className="mt-2 text-sm text-slate-700">Drafts RFQ packages per commodity, selects approved vendors, sets deadlines and assembles supporting documents. Outputs a tracking summary for the procurement team.</p>
          <button onClick={handleRun} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700">
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
              <button onClick={handleAcceptDisclaimer} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700">Continue</button>
            </div>
          </div>
        </div>
      )}

      {phase === "loading" && (
        <section className="rounded-xl border border-slate-200 bg-white p-8">
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Agent Running</p>
          </div>
          <h3 className="mt-2 text-lg font-bold text-slate-900">Drafting supplier RFQs…</h3>
          <ul className="mt-6 space-y-3">
            {loadingSteps.map((step, idx) => {
              const isDone = idx < currentStep;
              const isActive = idx === currentStep;
              return (
                <li key={idx} className="flex items-center gap-3">
                  <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${isDone ? "bg-emerald-100" : isActive ? "bg-amber-100" : "bg-slate-100"}`}>
                    {isDone ? <svg className="h-3 w-3 text-emerald-700" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> : isActive ? <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" /> : <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />}
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
          <section className="grid grid-cols-4 gap-3">
            <Tile label="RFQs Issued" value={c.summary.totalRfqs} color="emerald" />
            <Tile label="Vendors Contacted" value={c.summary.vendorsContacted} color="blue" />
            <Tile label="Expected Return" value={c.summary.expectedReturnRate} color="amber" />
            <Tile label="Critical Path" value={c.summary.criticalPathRfq.split("-").pop() || "—"} color="red" />
          </section>

          {c.rfqPackages.map((pkg, idx) => (
            <section key={idx} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className={`flex items-center justify-between border-b border-slate-200 px-5 py-3 ${priorityBg(pkg.priority)}`}>
                <div className="min-w-0">
                  <p className="text-[11px] text-slate-500">{pkg.rfqNo}</p>
                  <p className="mt-0.5 text-sm font-bold text-slate-900">{pkg.commodity}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${priorityPill(pkg.priority)}`}>{pkg.priority}</span>
                  <span className="text-xs text-slate-500">Due: {pkg.responseDeadline}</span>
                </div>
              </div>
              <div className="space-y-3 p-5">
                <p className="text-sm leading-relaxed text-slate-700">{pkg.rfqScope}</p>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Vendors</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {pkg.vendors.map((v, vi) => (
                      <div key={vi} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                        <p className="text-sm font-semibold text-slate-900">{v.name}</p>
                        <p className="mt-0.5 text-[11px] text-slate-600">{v.country} · <span className="text-emerald-700">{v.status}</span></p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Attached Documents</p>
                    <ul className="mt-1.5 space-y-1">
                      {pkg.keyDocs.map((d, di) => (
                        <li key={di} className="flex items-center gap-2 text-xs text-slate-700">
                          <svg className="h-3 w-3 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                          </svg>
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Commercial Requirements</p>
                    <ul className="mt-1.5 space-y-1">
                      {pkg.commercialReqs.map((r, ri) => (
                        <li key={ri} className="flex items-start gap-2 text-xs text-slate-700">
                          <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          ))}

          <HITLPanel
            agentId={AGENT_ID}
            agentNumber="05"
            agentName="Supplier RFQ"
            nextAgentId="quote-analysis"
            nextAgentNumber="06"
            nextAgentName="Quote Analysis"
            accentColor="emerald"
          />
        </>
      )}
    </div>
  );
}

function Tile({ label, value, color }: { label: string; value: string | number; color: "emerald" | "blue" | "amber" | "red" }) {
  const colorMap = {
    emerald: { border: "border-emerald-300", text: "text-emerald-700" },
    blue: { border: "border-blue-300", text: "text-blue-700" },
    amber: { border: "border-amber-300", text: "text-amber-700" },
    red: { border: "border-red-300", text: "text-red-700" },
  }[color];
  return (
    <div className={`rounded-xl border ${colorMap.border} bg-white p-4 text-center`}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-extrabold ${colorMap.text}`}>{value}</p>
    </div>
  );
}

function priorityBg(p: string) {
  if (p === "CRITICAL") return "bg-red-50";
  if (p === "HIGH") return "bg-amber-50";
  return "bg-slate-50";
}
function priorityPill(p: string) {
  if (p === "CRITICAL") return "bg-red-100 text-red-700";
  if (p === "HIGH") return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-600";
}