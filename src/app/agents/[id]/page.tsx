// src/app/agents/[id]/page.tsx

import { agents, getAgentById, getAgentIndex } from "@/data/agents";
import Link from "next/link";
import { notFound } from "next/navigation";
import Agent01View from "@/components/Agent01View";
import Agent02View from "@/components/Agent02View";
import Agent03View from "@/components/Agent03View";
import Agent04View from "@/components/Agent04View";
import Agent05View from "@/components/Agent05View";
import Agent06View from "@/components/Agent06View";
import Sidebar from "@/components/Sidebar";

export function generateStaticParams() {
  return agents.map((agent) => ({ id: agent.id }));
}

function renderAgentView(id: string) {
  if (id === "rfi-intelligence") return <Agent01View />;
  if (id === "qualification") return <Agent02View />;
  if (id === "reference-design") return <Agent03View />;
  if (id === "bom-scope") return <Agent04View />;
  if (id === "supplier-rfq") return <Agent05View />;
  if (id === "quote-analysis") return <Agent06View />;
  return (
    <section className="rounded-xl border border-dashed border-slate-700 bg-slate-900/50 p-10 text-center">
      <p className="text-sm text-slate-500">Agent demo content will go here.</p>
    </section>
  );
}

export default async function AgentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const agent = getAgentById(id);

  if (!agent) {
    notFound();
  }

  const index = getAgentIndex(id);
  const prevAgent = index > 0 ? agents[index - 1] : null;
  const nextAgent = index < agents.length - 1 ? agents[index + 1] : null;

  return (
    <div className="flex min-h-screen">
      <Sidebar activeId={id} />

      <div className="flex-1">
        <header className="border-b border-slate-800 bg-slate-900/50 px-10 py-4">
          <Link href="/" className="text-sm text-slate-400 transition hover:text-emerald-400">← Back to overview</Link>
        </header>

        <main className="px-10 py-10">
          <div className="mx-auto max-w-4xl">
            <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-slate-500">
              Agent {agent.number} of 08 · Tendering Pipeline
            </p>

            <div className="flex items-start gap-5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-xl font-bold text-emerald-400">
                {agent.number}
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">{agent.step}</p>
                <h1 className="mt-1 text-4xl font-bold text-white">{agent.fullName}</h1>
                <p className="mt-2 text-lg text-slate-300">{agent.tagline}</p>
              </div>
            </div>

            <section className="mt-10 rounded-xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">About this agent</p>
              <p className="mt-3 leading-relaxed text-slate-200">{agent.description}</p>
            </section>

            <div className="mt-6">{renderAgentView(id)}</div>

            <nav className="mt-10 flex items-stretch justify-between gap-4 border-t border-slate-800 pt-6">
              {prevAgent ? (
                <Link href={`/agents/${prevAgent.id}`} className="group flex flex-1 flex-col rounded-lg border border-slate-800 bg-slate-900 p-4 transition hover:border-emerald-500/50 hover:bg-slate-800">
                  <span className="text-xs text-slate-500 group-hover:text-emerald-400">← Previous · Agent {prevAgent.number}</span>
                  <span className="mt-1 text-sm font-semibold text-white">{prevAgent.name}</span>
                </Link>
              ) : (
                <div className="flex flex-1 flex-col rounded-lg border border-slate-800/50 bg-slate-900/30 p-4 opacity-40">
                  <span className="text-xs text-slate-600">← Previous</span>
                  <span className="mt-1 text-sm font-semibold text-slate-600">Start of pipeline</span>
                </div>
              )}

              {nextAgent ? (
                <Link href={`/agents/${nextAgent.id}`} className="group flex flex-1 flex-col rounded-lg border border-slate-800 bg-slate-900 p-4 text-right transition hover:border-emerald-500/50 hover:bg-slate-800">
                  <span className="text-xs text-slate-500 group-hover:text-emerald-400">Next · Agent {nextAgent.number} →</span>
                  <span className="mt-1 text-sm font-semibold text-white">{nextAgent.name}</span>
                </Link>
              ) : (
                <div className="flex flex-1 flex-col rounded-lg border border-slate-800/50 bg-slate-900/30 p-4 text-right opacity-40">
                  <span className="text-xs text-slate-600">Next →</span>
                  <span className="mt-1 text-sm font-semibold text-slate-600">End of pipeline</span>
                </div>
              )}
            </nav>
          </div>
        </main>
      </div>
    </div>
  );
}