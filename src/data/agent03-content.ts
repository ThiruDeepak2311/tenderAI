// src/data/agent03-content.ts
// "Reference design retrieval" output from Agent 03.
// Pretends to search an internal project DB for similar past LFGTE projects.

export const agent03Content = {
  // ─────────── The top-matched reference project ───────────
  bestMatch: {
    project: "Denton LFGTE Phase 2 — High-BTU Upgrade",
    client: "City of Denton, Texas",
    year: 2021,
    location: "Denton, TX",
    similarity: 92,
    scope:
      "DBOO of a 1,200 scfm LFGTE facility producing pipeline-quality RNG, with onsite flare backup and Title V air permit. Includes ATEX-rated gas conditioning skid, dehydration, and CO₂ removal.",
    outcome: "Delivered 4 weeks ahead of schedule; achieved 96% LFG utilization in Year 1.",
    contractValue: "$26.4M",
  },

  // ─────────── Other relevant matches ───────────
  referenceProjects: [
    {
      project: "Lubbock Landfill Gas-to-Electric",
      client: "City of Lubbock, TX",
      year: 2020,
      location: "Lubbock, TX",
      similarity: 84,
      keyDelta: "Electric generation only, no high-BTU pathway",
    },
    {
      project: "Houston Area LFGTE Phase 1",
      client: "Republic Services",
      year: 2019,
      location: "Houston, TX",
      similarity: 79,
      keyDelta: "Larger throughput (3,500 scfm); commercial industrial off-taker",
    },
    {
      project: "Oklahoma City Renewable Gas",
      client: "City of OKC",
      year: 2018,
      location: "Oklahoma City, OK",
      similarity: 71,
      keyDelta: "Different state regulatory regime (ODEQ vs TCEQ)",
    },
  ],

  // ─────────── Reusable documents from past projects ───────────
  reusableDocuments: [
    {
      docType: "P&ID",
      docNo: "PID-DEN-2021-04 Rev.3",
      relevance: "95% reusable — update for Cefe Valenzuela flow rate and methane analyzer point",
    },
    {
      docType: "General Arrangement",
      docNo: "GA-LFGTE-DEN-2021-01",
      relevance: "85% reusable — 1.5-acre footprint matches RFP constraint",
    },
    {
      docType: "Equipment Datasheet",
      docNo: "DS-COMP-RICE-2021",
      relevance: "90% reusable — RICE engine spec aligns with projected LFG quality",
    },
    {
      docType: "Bill of Materials",
      docNo: "BOM-DEN-2021-FINAL",
      relevance: "70% reusable — adjust for scope deltas below",
    },
    {
      docType: "HSE / HAZOP Report",
      docNo: "HAZOP-DEN-2021-RevB",
      relevance: "80% reusable — re-run nodes for site-specific perimeter & access constraints",
    },
    {
      docType: "Title V Permit Application",
      docNo: "TV-DEN-2020-001",
      relevance: "75% reusable — Texas TCEQ template applies directly",
    },
  ],

  // ─────────── What's different vs the reference ───────────
  scopeDeltas: [
    {
      parameter: "LFG Flow Rate",
      reference: "1,200 scfm (Denton)",
      required: "1,115 scfm projected",
      action: "Right-size compression train; reuse upstream skid design",
    },
    {
      parameter: "Existing Flare Capacity",
      reference: "5,000 scfm (Denton, included)",
      required: "4,000 scfm (existing, proposer to expand if needed)",
      action: "Add ~1,000 scfm supplemental flare capacity to BOM",
    },
    {
      parameter: "Energy Output Pathway",
      reference: "RNG / high-BTU (Denton)",
      required: "Open — medium-BTU / high-BTU / electrical",
      action: "Propose hybrid: high-BTU primary + electrical secondary for resilience",
    },
    {
      parameter: "Land Lease",
      reference: "Owned land (Denton)",
      required: "~1.5 acres leased from City of Corpus Christi",
      action: "Add lease cost line + compact-footprint layout per GA-LFGTE-DEN-2021-01",
    },
    {
      parameter: "Local Content",
      reference: "N/A (Denton)",
      required: "HUB / LSB advantageous per RFP §6.2",
      action: "Identify Corpus Christi-based subcontractors for civil and electrical",
    },
  ],

  // ─────────── Lessons learned (auto-surfaced from past project debriefs) ───────────
  lessonsLearned: [
    "Flow-meter & methane-analyzer commissioning is the critical-path item — order 30+ weeks ahead.",
    "Title V permit review took 6 months in Texas — start filing in parallel with EPC mobilization.",
    "Condensate handling underestimated in Denton; design for 1.5× peak rate from day one.",
    "Engage industrial off-taker at proposal stage — secured off-take added 12 points to Denton bid score.",
  ],

  // ─────────── Summary metric ───────────
  estimatedEngineeringReuse: 68, // percent
};