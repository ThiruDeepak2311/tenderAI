// src/data/agents.ts
// Master list of all 8 agents in the tendering pipeline.
// Every screen reads from this file. Change a name here -> changes everywhere.

export type Agent = {
  id: string;          // url-friendly id, e.g. "rfi-intelligence"
  number: string;      // display number, e.g. "01"
  name: string;        // short name shown in the sidebar
  fullName: string;    // long name shown on the agent's own page
  tagline: string;     // one-line description for the sidebar
  description: string; // longer description for the agent page
  step: string;        // which process step this agent handles
};

export const agents: Agent[] = [
  {
    id: "rfi-intelligence",
    number: "01",
    name: "RFI Intelligence",
    fullName: "RFI Intelligence Agent",
    tagline: "Parses & classifies RFI/ITT documents",
    description:
      "Reads the incoming tender (RFI/RFP) end-to-end. Extracts scope, standards, deadlines and key technical requirements. Classifies sections into commercial, technical and HSE. Flags ambiguities for human review.",
    step: "Step 1 — RFI Receipt",
  },
  {
    id: "qualification",
    number: "02",
    name: "Opportunity Qualification",
    fullName: "Opportunity Qualification Agent",
    tagline: "Go / No-Go scoring & bid strategy",
    description:
      "Scores the opportunity on 15+ criteria (capability, capacity, margin, fit). Benchmarks against historical win patterns. Recommends Go or No-Go with a confidence score and suggested bid strategy.",
    step: "Step 2 — Opportunity Qualification",
  },
  {
    id: "reference-design",
    number: "03",
    name: "Reference Design",
    fullName: "Reference Design Agent",
    tagline: "Matches scope to past projects",
    description:
      "Searches the internal project database for similar past projects (e.g. gas compression, subsea manifold). Retrieves reusable drawings and BOMs. Highlights scope deltas vs the reference.",
    step: "Step 3 — Reference Design Identification",
  },
  {
    id: "bom-scope",
    number: "04",
    name: "BOM & Scope",
    fullName: "BOM & Scope Agent",
    tagline: "Generates Bill of Materials",
    description:
      "Generates a first-cut Bill of Materials from reference designs, P&IDs and spec sheets. Calculates quantities, flags long-lead items, and cross-references material standards (ASTM, API, NACE).",
    step: "Step 4 — Scope Definition & BOM",
  },
  {
    id: "supplier-rfq",
    number: "05",
    name: "Supplier RFQ",
    fullName: "Supplier RFQ Agent",
    tagline: "Auto-drafts & issues supplier RFQs",
    description:
      "Auto-drafts RFQ packages per commodity from the approved BOM. Selects vendor lists by scope and geography. Tracks RFQ status, reminds vendors, and flags non-conforming submissions.",
    step: "Step 5 — Supplier RFQ Issuance",
  },
  {
    id: "quote-analysis",
    number: "06",
    name: "Quote Analysis",
    fullName: "Quote Analysis & Ranking Agent",
    tagline: "Normalizes, scores & ranks supplier quotes",
    description:
      "Extracts and normalizes data from heterogeneous supplier quotes (PDF, Excel, email). Applies a TCO model (price, lead time, quality, risk). Produces a clean comparison matrix with an award recommendation.",
    step: "Step 6 — Quote Consolidation",
  },
  {
    id: "technical-response",
    number: "07",
    name: "Technical Response",
    fullName: "Technical Response Agent",
    tagline: "Drafts answers from KB & past proposals",
    description:
      "Answers RFP technical questions using the company knowledge base and past proposals. Drafts exception/deviation notes. Generates a compliance matrix aligned with company standards (QMS, ISO).",
    step: "Step 7 — Technical Write-up",
  },
  {
    id: "proposal-assembly",
    number: "08",
    name: "Proposal Assembly",
    fullName: "Proposal Assembly Agent",
    tagline: "Consolidates & formats the final RFP package",
    description:
      "Assembles all upstream agent outputs into a single proposal document. Applies client-specific formatting, runs cross-section consistency checks, and generates the executive summary and cover letter.",
    step: "Step 8 — RFP Submission",
  },
];

// Tiny helpers we'll reuse on the screens
export function getAgentById(id: string): Agent | undefined {
  return agents.find((a) => a.id === id);
}

export function getAgentIndex(id: string): number {
  return agents.findIndex((a) => a.id === id);
}