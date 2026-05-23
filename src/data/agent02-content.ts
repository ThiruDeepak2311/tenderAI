// src/data/agent02-content.ts
// "Qualification scoring" output from Agent 02.
// Grounded in the Corpus Christi LFGTE RFP, from McDermott's perspective as the bidder.

export const agent02Content = {
  // ─────────── Top-line verdict ───────────
  verdict: {
    decision: "GO" as "GO" | "NO-GO" | "CONDITIONAL GO",
    confidence: 87,
    overallScore: 78,
    winProbability: 32,
    estimatedContractValue: "$24M – $32M",
    marginPotential: "11% – 15%",
  },

  // ─────────── Per-criterion scorecard ───────────
  criteria: [
    {
      name: "Technical Capability",
      score: 90,
      rationale: "Strong design-build-operate (DBOO) track record on gas processing & energy conversion plants.",
    },
    {
      name: "Past Project Experience",
      score: 85,
      rationale: "5+ commercial LFGTE-comparable facilities delivered; meets minimum-qualification criteria.",
    },
    {
      name: "Capacity & Bandwidth",
      score: 72,
      rationale: "Engineering team availability good through Q3 2022; mild constraint in Q4 due to parallel bid.",
    },
    {
      name: "Commercial Fit",
      score: 80,
      rationale: "Long-term DBOO model fits our recurring-revenue strategy; lease + gas-purchase structure manageable.",
    },
    {
      name: "Risk Exposure",
      score: 58,
      rationale: "LFG quantity disclaimed by City + Change-in-Law risk borne by proposer drive risk score down.",
    },
    {
      name: "Competitive Landscape",
      score: 68,
      rationale: "3–4 likely bidders (incl. Aria Energy, Montauk Renewables, Archaea); pricing pressure expected.",
    },
    {
      name: "Strategic Alignment",
      score: 92,
      rationale: "Texas footprint expansion + ESG-aligned renewable gas portfolio — high strategic value.",
    },
    {
      name: "Local Content & Compliance",
      score: 75,
      rationale: "HUB / LSB pathways viable; Texas-registered entity in good standing.",
    },
  ],

  // ─────────── Reasons to bid ───────────
  strengths: [
    "Direct experience: 5 commercial LFGTE-comparable plants delivered in last 7 years",
    "Existing Texas engineering hub — minimal mobilization cost",
    "Strong NSPS Subpart WWW / Title V compliance team in-house",
    "Established relationships with Caterpillar, Solar Turbines & Jenbacher (likely engine vendors)",
    "Pre-qualified for similar gas-purchase agreements with two municipal landfills",
  ],

  // ─────────── Risks ───────────
  risks: [
    "LFG resource not contractually guaranteed by City — full quantity/quality risk on proposer",
    "Change-in-Law risk fully transferred to proposer per RFP §4.4.8",
    "Long-term lease + gas-purchase structure ties capital for 15–25 years",
    "Excess flare capacity above 4,000 scfm is proposer's cost",
    "Single-source metering equipment requires upfront commercial negotiation",
  ],

  // ─────────── Pre-bid conditions to satisfy ───────────
  conditions: [
    "Internal capital-allocation approval for DBOO model (~$28M peak exposure)",
    "Sign-off from Risk Committee on LFG resource & Change-in-Law clauses",
    "Confirm gas off-taker (industrial user / utility) before bid submission",
  ],

  // ─────────── Suggested approach ───────────
  bidStrategy:
    "Pursue a CONDITIONAL GO. Lead with a proven RICE/turbine hybrid configuration anchored on our Texas reference plant. Price aggressively on Lease + a high environmental-benefit weighting to differentiate on ESG value. Hedge the LFG resource risk by committing to a phased capacity model (Phase 1 at 750 scfm, expansion option to 1,200 scfm) with corresponding scaled investment. Bring a pre-identified off-taker (industrial gas user in the Robstown / Corpus Christi corridor) to the proposal as a differentiator. Aim for a Best-Value score >85, prioritising Technical (50pts) over Price (30pts).",

  // ─────────── Competitive landscape ───────────
  competitors: [
    { name: "Aria Energy", strength: "Largest LFGTE operator in US", threat: "high" },
    { name: "Montauk Renewables", strength: "Strong RNG/high-BTU expertise", threat: "high" },
    { name: "Archaea Energy", strength: "Backed by bp; aggressive growth", threat: "medium" },
    { name: "Ameresco", strength: "Diversified energy services", threat: "medium" },
  ],
};