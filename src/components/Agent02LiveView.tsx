// src/components/Agent02LiveView.tsx
"use client";

import { useState } from "react";
import MultiReviewerPanel from "@/components/MultiReviewerPanel";
import InitiateReviewChatbot from "@/components/InitiateReviewChatbot";

type Verdict = {
  decision: string;
  confidence: number;
  overallScore: number;
  winProbability: number;
  estimatedContractValue: string;
  marginPotential: string;
};

type Criterion = { name: string; score: number; rationale: string };
type Competitor = { name: string; strength: string; threat: string };

type LiveResult = {
  verdict: Verdict;
  criteria: Criterion[];
  strengths: string[];
  risks: string[];
  conditions: string[];
  bidStrategy: string;
  competitors: Competitor[];
};

const DEFAULT_TENDER = `City of Corpus Christi RFP No. 3940 — Landfill Gas-to-Energy (LFGTE) Facility at the Cefe Valenzuela Landfill, Robstown, Nueces County, Texas. Design, Build, Own, Operate (DBOO) model under a Lease Agreement + Gas Purchase Agreement. Site capacity: 1,115 scfm projected LFG flow, 4,000 scfm existing flare. ~1.5 acres leased. Evaluation weighting: Technical 50%, Interview 20%, Price 30%. Critical risks: LFG quantity not contractually guaranteed; Change-in-Law risk borne by proposer. Proposals due 9 Mar 2026.`;

const DEFAULT_BIDDER = `McDermott International — Process & Renewable Energy Division. 5 LFGTE-comparable plants delivered in last 7 years (Denton 2021, Lubbock 2020, Houston 2019). Texas-registered entity with engineering hub in Houston. Strong Title V compliance team (12 successful filings in 5 years). Established vendor relationships with INNIO Jenbacher, Caterpillar, Solar Turbines. Risk Committee approved phased-capex framework for LFG resource uncertainty.`;

export default function Agent02LiveView() {
  const [tenderContext, setTenderContext] = useState(DEFAULT_TENDER);
  const [bidderProfile, setBidderProfile] = useState(DEFAULT_BIDDER);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LiveResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);
  const [modelUsed, setModelUsed] = useState<string | null>(null);
  const [chatbotOpen, setChatbotOpen] = useState(false);

  const handleOpenAssignChatbot = () => setChatbotOpen(true);
  const handleCloseChatbot = () => setChatbotOpen(false);

  const handleRun = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    const t0 = Date.now();
    try {
      const res = await fetch("/api/qualify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenderContext, bidderProfile }),
      });
      const json = await res.json();
      if (!res.ok || json.error) {
        setError(json.error || `Request failed (${res.status})`);
        return;
      }
      setResult(json.data as LiveResult);
      setModelUsed(json.model || null);
      setElapsedMs(Date.now() - t0);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(`Network error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Live Inputs · Editable
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Edit the tender or bidder profile below — the agent will score based on whatever you write.
        </p>

        <div className="mt-4">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Tender Context
          </label>
          <textarea
            value={tenderContext}
            onChange={(e) => setTenderContext(e.target.value)}
            rows={4}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="mt-4">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Bidder Profile
          </label>
          <textarea
            value={bidderProfile}
            onChange={(e) => setBidderProfile(e.target.value)}
            rows={4}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 border-t border-slate-200 pt-4">
          <p className="text-xs text-slate-500">
            {modelUsed && elapsedMs !== null && !loading && (
              <>🤖 {modelUsed} · ⏱ {(elapsedMs / 1000).toFixed(1)}s</>
            )}
            {loading && <span className="text-amber-700">⟳ Calling Gemini…</span>}
          </p>
          <button
            onClick={handleRun}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {loading ? "Analyzing…" : result ? "Re-run Agent" : "Run Live Agent"}
          </button>
        </div>
      </section>

      {error && (
        <section className="rounded-xl border border-red-300 bg-red-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-red-700">⚠ Error</p>
          <p className="mt-2 text-sm text-slate-800">{error}</p>
        </section>
      )}

      {result && (
        <>
          <section className={`rounded-xl border-2 ${verdictBorder(result.verdict.decision)} ${verdictBg(result.verdict.decision)} p-6`}>
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className={`text-xs font-bold uppercase tracking-widest ${verdictText(result.verdict.decision)}`}>
                  Live Recommendation
                </p>
                <h2 className={`mt-2 text-4xl font-extrabold ${verdictText(result.verdict.decision)}`}>
                  {result.verdict.decision}
                </h2>
                <p className="mt-2 text-sm text-slate-700">
                  Confidence: <span className="font-bold text-slate-900">{result.verdict.confidence}%</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Overall Score</p>
                <p className="mt-1 text-5xl font-extrabold text-slate-900">
                  {result.verdict.overallScore}
                  <span className="text-xl text-slate-400">/100</span>
                </p>
                <div className="mt-2 h-2 w-40 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full ${verdictBar(result.verdict.decision)}`} style={{ width: `${result.verdict.overallScore}%` }} />
                </div>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-4 border-t border-slate-200 pt-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">Win Probability</p>
                <p className="mt-1 text-lg font-bold text-slate-900">{result.verdict.winProbability}%</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">Est. Contract Value</p>
                <p className="mt-1 text-lg font-bold text-slate-900">{result.verdict.estimatedContractValue}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">Margin Potential</p>
                <p className="mt-1 text-lg font-bold text-slate-900">{result.verdict.marginPotential}</p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Scoring Criteria · Generated Live
            </p>
            <div className="space-y-4">
              {result.criteria.map((cr, idx) => (
                <div key={idx}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-900">{cr.name}</p>
                    <p className={`text-sm font-bold ${scoreText(cr.score)}`}>
                      {cr.score}
                      <span className="text-xs text-slate-400">/100</span>
                    </p>
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
                {result.strengths.map((s, idx) => (
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
                {result.risks.map((r, idx) => (
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
              {result.conditions.map((c, idx) => (
                <li key={idx} className="flex gap-2 text-sm text-slate-800">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  <span className="leading-relaxed">{c}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Recommended Bid Strategy
            </p>
            <p className="text-sm leading-relaxed text-slate-800">{result.bidStrategy}</p>
          </section>

          {result.competitors?.length > 0 && (
            <section className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Likely Competitors</p>
              <div className="grid grid-cols-2 gap-3">
                {result.competitors.map((comp, idx) => (
                  <div key={idx} className="flex items-start justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 p-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900">{comp.name}</p>
                      <p className="mt-0.5 text-xs text-slate-600">{comp.strength}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${threatClass(comp.threat)}`}>
                      {comp.threat}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <MultiReviewerPanel onOpenAssignChatbot={handleOpenAssignChatbot} />
        </>
      )}

      {/* Chatbot modal — controlled by chatbotOpen state */}
      <InitiateReviewChatbot open={chatbotOpen} onClose={handleCloseChatbot} />
    </div>
  );
}

function verdictBorder(d: string) {
  if (d === "GO") return "border-emerald-400";
  if (d === "NO-GO") return "border-red-400";
  return "border-amber-400";
}
function verdictBg(d: string) {
  if (d === "GO") return "bg-gradient-to-br from-emerald-50 to-white";
  if (d === "NO-GO") return "bg-gradient-to-br from-red-50 to-white";
  return "bg-gradient-to-br from-amber-50 to-white";
}
function verdictText(d: string) {
  if (d === "GO") return "text-emerald-700";
  if (d === "NO-GO") return "text-red-700";
  return "text-amber-700";
}
function verdictBar(d: string) {
  if (d === "GO") return "bg-emerald-500";
  if (d === "NO-GO") return "bg-red-500";
  return "bg-amber-500";
}
function scoreText(s: number) {
  if (s >= 80) return "text-emerald-700";
  if (s >= 60) return "text-amber-700";
  return "text-red-700";
}
function scoreBar(s: number) {
  if (s >= 80) return "bg-emerald-500";
  if (s >= 60) return "bg-amber-500";
  return "bg-red-500";
}
function threatClass(t: string) {
  if (t === "high") return "bg-red-100 text-red-700";
  if (t === "medium") return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-600";
}