// src/data/agent04-content.ts
// "BOM & Scope" output from Agent 04. Grounded in the Corpus Christi LFGTE RFP.

export const agent04Content = {
  // ─────────── Headline numbers ───────────
  summary: {
    totalLineItems: 52,
    totalEstimatedCost: "$18.4M",
    longLeadCount: 7,
    scopeExclusionsCount: 4,
    clarificationsCount: 5,
  },

  // ─────────── Category-grouped BOM ───────────
  categories: [
    {
      category: "Rotating Equipment",
      color: "emerald",
      items: [
        { tag: "GE-1001A/B", description: "RICE engine-generator, 1.4 MW, ATEX Zone 2", qty: 2, unit: "EA", materialSpec: "Caterpillar G3520H or eq.", leadWeeks: 48, estimatedCost: "$3,800,000", supplierClass: "OEM Only" },
        { tag: "CP-1001A/B", description: "LFG booster compressor, oil-free", qty: 2, unit: "EA", materialSpec: "316L wetted parts, NACE MR0175", leadWeeks: 32, estimatedCost: "$1,250,000", supplierClass: "Competitive" },
        { tag: "FN-1001", description: "LFG flare blower, 5,000 scfm", qty: 1, unit: "EA", materialSpec: "Carbon steel, FRP impeller", leadWeeks: 22, estimatedCost: "$310,000", supplierClass: "Competitive" },
      ],
    },
    {
      category: "Gas Conditioning & Treatment",
      color: "blue",
      items: [
        { tag: "TD-1001", description: "Refrigerated dehydration package, -30°C dew pt.", qty: 1, unit: "SKID", materialSpec: "316L tubes, ATEX Zone 1", leadWeeks: 28, estimatedCost: "$1,450,000", supplierClass: "Competitive" },
        { tag: "AC-1001", description: "Activated carbon siloxane removal vessel", qty: 2, unit: "EA", materialSpec: "SA-516-70N, lined", leadWeeks: 24, estimatedCost: "$680,000", supplierClass: "Competitive" },
        { tag: "FL-1001", description: "Coalescing filter, LFG service", qty: 2, unit: "EA", materialSpec: "316L, NACE MR0175", leadWeeks: 14, estimatedCost: "$140,000", supplierClass: "Competitive" },
      ],
    },
    {
      category: "Pressure Vessels & Storage",
      color: "purple",
      items: [
        { tag: "V-1001", description: "LFG suction knockout drum", qty: 1, unit: "EA", materialSpec: "SA-516-70N, NACE", leadWeeks: 18, estimatedCost: "$320,000", supplierClass: "Competitive" },
        { tag: "V-1002", description: "Condensate collection drum, jacketed", qty: 1, unit: "EA", materialSpec: "SA-516-70N", leadWeeks: 16, estimatedCost: "$210,000", supplierClass: "Competitive" },
      ],
    },
    {
      category: "Piping, Valves & Instrumentation",
      color: "amber",
      items: [
        { tag: "BULK-PIPE", description: "Process piping, ASME B31.3, LFG service", qty: 1, unit: "LOT", materialSpec: "A106-B / SS316L, 4\"–12\"", leadWeeks: 14, estimatedCost: "$760,000", supplierClass: "Competitive" },
        { tag: "PSV-1001/4", description: "Pressure safety valves, API 526", qty: 4, unit: "EA", materialSpec: "316/Inconel trim", leadWeeks: 16, estimatedCost: "$96,000", supplierClass: "Competitive" },
        { tag: "FE-1001", description: "Sales-point flow meter, ultrasonic", qty: 1, unit: "EA", materialSpec: "Daniel / Sick, AGA-9", leadWeeks: 30, estimatedCost: "$185,000", supplierClass: "Single Source" },
        { tag: "AI-1001", description: "Methane analyzer, continuous", qty: 1, unit: "EA", materialSpec: "Thermo Sci. / Servomex", leadWeeks: 30, estimatedCost: "$220,000", supplierClass: "Single Source" },
      ],
    },
    {
      category: "Electrical, Controls & Safety",
      color: "red",
      items: [
        { tag: "MCC-1001", description: "Motor control center + switchgear", qty: 1, unit: "LOT", materialSpec: "NEMA 4X, ATEX Zone 2", leadWeeks: 26, estimatedCost: "$540,000", supplierClass: "Competitive" },
        { tag: "PLC-1001", description: "Site PLC + DCS interface", qty: 1, unit: "EA", materialSpec: "Allen-Bradley ControlLogix", leadWeeks: 18, estimatedCost: "$320,000", supplierClass: "Competitive" },
        { tag: "F&G-1001", description: "Fire & gas detection, SIL-2", qty: 1, unit: "SKID", materialSpec: "Det-Tronics / Honeywell", leadWeeks: 22, estimatedCost: "$240,000", supplierClass: "Competitive" },
      ],
    },
  ],

  // ─────────── Explicit exclusions (what we are NOT supplying) ───────────
  scopeExclusions: [
    "Civil & foundation works (covered under separate City contract)",
    "Existing GCCS modifications upstream of the sales-point manifold",
    "Industrial off-taker's tie-in piping beyond McDermott's battery limit",
    "Land lease registration fees & permits (City's responsibility)",
  ],

  // ─────────── Clarifications we still need from the City ───────────
  clarificationsNeeded: [
    "Final off-taker identity & gas-quality spec (medium-BTU vs high-BTU vs electrical)",
    "Mutually-acceptable make/model for the sales-point flow meter & methane analyzer (RFP §4.3.2)",
    "Permitted noise level at the perimeter (<65 dBA assumed; please confirm)",
    "Permitted maximum height above grade (existing GA assumes 8.5 m)",
    "City's expected RFSU date for contractual milestone alignment",
  ],
};