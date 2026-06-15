// src/app/agents/qualification/live/page.tsx
// The LIVE version of Agent 02 — uses real Gemini API calls instead of mockup data.

import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Agent02LiveView from "@/components/Agent02LiveView";

export default function QualificationLivePage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activeId="qualification-live" />

      <div className="flex-1">
        <header className="border-b border-slate-200 bg-white px-10 py-4">
          <Link href="/" className="text-sm text-slate-600 transition hover:text-emerald-700">
            ← Back to overview
          </Link>
        </header>

        <main className="px-10 py-10">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex items-center gap-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Agent 02 of 08 · Tendering Pipeline
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                Live · Real LLM
              </span>
            </div>

            <div className="flex items-start gap-5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-xl font-bold text-blue-700">
                02
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-700">
                  Step 2 · Opportunity Qualification
                </p>
                <h1 className="mt-1 text-4xl font-bold text-slate-900">
                  Opportunity Qualification Agent
                </h1>
                <p className="mt-2 text-lg text-slate-700">
                  Live mode — real LLM scoring via Gemini 2.5 Flash
                </p>
              </div>
            </div>

            <section className="mt-10 rounded-xl border border-emerald-200 bg-emerald-50 p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                Live Agent · How this differs from the mockup
              </p>
              <p className="mt-3 leading-relaxed text-slate-800">
                This page calls a real Large Language Model (Google Gemini 2.5 Flash) through a backend API.
                Each &ldquo;Run Agent&rdquo; click sends the tender context and bidder profile to the model and returns
                a fresh qualification analysis — scoring, strengths, risks, bid strategy, all generated live.
                No two runs will be identical.
              </p>
            </section>

            <div className="mt-6">
              <Agent02LiveView />
            </div>

            <nav className="mt-10 flex items-stretch justify-between gap-4 border-t border-slate-200 pt-6">
              <Link
                href="/agents/qualification"
                className="group flex flex-1 flex-col rounded-lg border border-slate-200 bg-white p-4 transition hover:border-emerald-500/50 hover:bg-slate-50"
              >
                <span className="text-xs text-slate-500 group-hover:text-emerald-700">
                  ← Compare with Mockup
                </span>
                <span className="mt-1 text-sm font-semibold text-slate-900">
                  Agent 02 (Mockup) — Opportunity Qualification
                </span>
              </Link>

              <Link
                href="/agents/reference-design"
                className="group flex flex-1 flex-col rounded-lg border border-slate-200 bg-white p-4 text-right transition hover:border-emerald-500/50 hover:bg-slate-50"
              >
                <span className="text-xs text-slate-500 group-hover:text-emerald-700">
                  Next · Agent 03 →
                </span>
                <span className="mt-1 text-sm font-semibold text-slate-900">Reference Design</span>
              </Link>
            </nav>
          </div>
        </main>
      </div>
    </div>
  );
}