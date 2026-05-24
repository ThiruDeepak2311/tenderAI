// src/components/Agent04View.tsx
"use client";

import { useState, useEffect } from "react";
import { agent04Content as c } from "@/data/agent04-content";
import { isAgentRun, markAgentForReview, hasAcceptedDisclaimer, acceptDisclaimer } from "@/lib/agentProgress";
import HITLPanel from "@/components/HITLPanel";

type Phase = "idle" | "disclaimer" | "loading" | "done";
const AGENT_ID = "bom-scope";

const loadingSteps = [
  "Loading approved scope & reference BOM",
  "Counting equipment by category",
  "Cross-referencing material standards (ASTM / API / NACE)",
  "Calculating long-lead items",
  "Estimating commodity-level costs",
  "Flagging single-source items & scope exclusions",
];

export default function Agent04View() {
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
        <section className="rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-slate-900 p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">Ready to Build BOM</p>
          <h3 className="mt-2 text-xl font-bold text-white">Run BOM &amp; Scope Agent</h3>
          <p className="mt-2 text-sm text-slate-300">Generates a category-grouped Bill of Materials with quantities, material specs, lead times, costs and supplier classifications. Surfaces scope exclusions and clarifications still needed from the client.</p>
          <button onClick={handleRun} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-amber-400">
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
              <button onClick={handleAcceptDisclaimer} className="rounded-md bg-amber-500 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-amber-400">Continue</button>
            </div>
          </div>
        </div>
      )}

      {phase === "loading" && (
        <section className="rounded-xl border border-slate-800 bg-slate-900 p-8">
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-amber-400" />
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">Agent Running</p>
          </div>
          <h3 className="mt-2 text-lg font-bold text-white">Building Bill of Materials…</h3>
          <ul className="mt-6 space-y-3">
            {loadingSteps.map((step, idx) => {
              const isDone = idx < currentStep;
              const isActive = idx === currentStep;
              return (
                <li key={idx} className="flex items-center gap-3">
                  <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${isDone ? "bg-amber-500/20" : isActive ? "bg-amber-500/20" : "bg-slate-800"}`}>
                    {isDone ? <svg className="h-3 w-3 text-amber-400" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> : isActive ? <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" /> : <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />}
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
          {/* Top summary tiles */}
          <section className="grid grid-cols-3 gap-3">
            <Tile label="Total Line Items" value={c.summary.totalLineItems} color="amber" />
            <Tile label="Est. Material Cost" value={c.summary.totalEstimatedCost} color="emerald" />
            <Tile label="Long-Lead Items" value={c.summary.longLeadCount} color="red" />
          </section>

          {/* Categories with item tables */}
          {c.categories.map((cat, idx) => (
            <section key={idx} className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
              <div className={`flex items-center justify-between border-b border-slate-800 px-5 py-3 ${categoryHeaderBg(cat.color)}`}>
                <p className={`text-sm font-bold ${categoryHeaderText(cat.color)}`}>{cat.category}</p>
                <p className="text-xs text-slate-400">{cat.items.length} items</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-900/80">
                      <Th>Tag</Th>
                      <Th>Description</Th>
                      <Th className="text-center">Qty</Th>
                      <Th>Material Spec</Th>
                      <Th className="text-center">Lead (wks)</Th>
                      <Th className="text-right">Est. Cost</Th>
                      <Th>Class</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {cat.items.map((item, ii) => (
                      <tr key={ii} className="border-t border-slate-800/60">
                        <Td className="font-bold text-emerald-400">{item.tag}</Td>
                        <Td className="text-slate-200">{item.description}</Td>
                        <Td className="text-center text-slate-300">{item.qty} {item.unit}</Td>
                        <Td className="text-xs text-slate-400">{item.materialSpec}</Td>
                        <Td className={`text-center font-bold ${item.leadWeeks >= 40 ? "text-red-400" : item.leadWeeks >= 24 ? "text-amber-400" : "text-slate-300"}`}>{item.leadWeeks}</Td>
                        <Td className="text-right font-semibold text-emerald-400">{item.estimatedCost}</Td>
                        <Td>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${supplierClassStyle(item.supplierClass)}`}>
                            {item.supplierClass}
                          </span>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}

          {/* Exclusions */}
          <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Scope Exclusions ({c.scopeExclusions.length})</p>
            <ul className="space-y-2">
              {c.scopeExclusions.map((ex, idx) => (
                <li key={idx} className="flex gap-2 text-sm text-slate-300">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" />
                  <span className="leading-relaxed">{ex}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Clarifications */}
          <section className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-amber-400">⚠ Clarifications Needed from Client ({c.clarificationsNeeded.length})</p>
            <ul className="space-y-2">
              {c.clarificationsNeeded.map((cl, idx) => (
                <li key={idx} className="flex gap-2 text-sm text-slate-200">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                  <span className="leading-relaxed">{cl}</span>
                </li>
              ))}
            </ul>
          </section>

          <HITLPanel
            agentId={AGENT_ID}
            agentNumber="04"
            agentName="BOM & Scope"
            nextAgentId="supplier-rfq"
            nextAgentNumber="05"
            nextAgentName="Supplier RFQ"
            accentColor="amber"
          />
        </>
      )}
    </div>
  );
}

function Tile({ label, value, color }: { label: string; value: string | number; color: "amber" | "emerald" | "red" }) {
  const colorMap = {
    amber: { border: "border-amber-500/30", text: "text-amber-400" },
    emerald: { border: "border-emerald-500/30", text: "text-emerald-400" },
    red: { border: "border-red-500/30", text: "text-red-400" },
  }[color];
  return (
    <div className={`rounded-xl border ${colorMap.border} bg-slate-900 p-4 text-center`}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <p className={`mt-1 text-2xl font-extrabold ${colorMap.text}`}>{value}</p>
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500 ${className}`}>{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-2.5 ${className}`}>{children}</td>;
}

function categoryHeaderBg(color: string) {
  return ({
    emerald: "bg-emerald-500/10",
    blue: "bg-blue-500/10",
    purple: "bg-purple-500/10",
    amber: "bg-amber-500/10",
    red: "bg-red-500/10",
  } as Record<string, string>)[color] || "bg-slate-800";
}
function categoryHeaderText(color: string) {
  return ({
    emerald: "text-emerald-400",
    blue: "text-blue-400",
    purple: "text-purple-400",
    amber: "text-amber-400",
    red: "text-red-400",
  } as Record<string, string>)[color] || "text-slate-300";
}

function supplierClassStyle(c: string) {
  if (c === "Single Source") return "bg-red-500/15 text-red-400";
  if (c === "OEM Only") return "bg-amber-500/15 text-amber-400";
  return "bg-emerald-500/15 text-emerald-400";
}