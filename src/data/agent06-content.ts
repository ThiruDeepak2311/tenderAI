// src/data/agent06-content.ts
// "Quote Analysis" output from Agent 06. Compares supplier quotes received against RFQ-A.

export const agent06Content = {
  analysisDate: "2026-05-12",
  commodity: "RICE Engine-Generator Sets (1.4 MW × 2)",
  quotesReceived: 3,
  recommendedSupplier: "INNIO Jenbacher",

  scoringWeights: {
    technical: 35,
    commercial: 25,
    experience: 25,
    tco: 15,
  },

  // ─────────── Suppliers ranked ───────────
  suppliers: [
    {
      vendor: "INNIO Jenbacher",
      quoteNo: "INN-Q-2026-4421",
      basePrice: 3650000, // USD
      deliveryWeeks: 46,
      technicalScore: 94,
      commercialScore: 88,
      experienceScore: 96,
      tcoScore: 92,
      compositeScore: 93,
      rank: 1,
      strengths: [
        "Largest installed LFGTE fleet in US (>200 units)",
        "Proven Texas references — Denton & Houston operating units",
        "Best-in-class methane number tolerance (MN ≥ 55)",
      ],
      concerns: [
        "Lead time slightly above 44-week internal target",
        "Premium pricing — ~4% above lowest bid",
      ],
      deviations: ["Proposes integrated SCR aftertreatment (acceptable, value-add)"],
    },
    {
      vendor: "Caterpillar Energy Solutions",
      quoteNo: "CAT-Q-2026-7783",
      basePrice: 3490000,
      deliveryWeeks: 50,
      technicalScore: 88,
      commercialScore: 92,
      experienceScore: 84,
      tcoScore: 86,
      compositeScore: 87,
      rank: 2,
      strengths: [
        "Lowest base price",
        "Strongest North American service network",
        "Local dealer in Corpus Christi for spares",
      ],
      concerns: [
        "Lead time 50 weeks — extends critical path",
        "Fewer LFGTE-specific (vs digester gas) references",
      ],
      deviations: ["Requests 30-day extended payment terms"],
    },
    {
      vendor: "MTU Onsite Energy",
      quoteNo: "MTU-Q-2026-1198",
      basePrice: 3820000,
      deliveryWeeks: 48,
      technicalScore: 90,
      commercialScore: 80,
      experienceScore: 78,
      tcoScore: 82,
      compositeScore: 83,
      rank: 3,
      strengths: [
        "Strong European LFGTE references",
        "Highest engine efficiency at part load",
      ],
      concerns: [
        "Highest base price (~9% above lowest)",
        "Limited Texas / Gulf Coast service footprint",
        "LD cap requested at 5% (vs our 10% standard)",
      ],
      deviations: ["LD cap deviation", "Performance guarantee at 95% load (vs our 100%)"],
    },
  ],

  // ─────────── Final recommendation ───────────
  recommendation:
    "Award to INNIO Jenbacher. Best composite score driven by proven Texas-region LFGTE references, superior methane-tolerance, and lowest TCO. Negotiate a 3% price reduction citing Caterpillar's lower quote, and request commitment to 44-week delivery to align with critical path.",

  nextSteps: [
    "Issue technical clarification to MTU on LD cap & 95% load deviation (likely reject)",
    "Open negotiation with INNIO on price (~3% target) and delivery (44 weeks target)",
    "Hold Caterpillar warm as fallback in case INNIO negotiation stalls",
    "Brief commercial committee on award recommendation by 2026-05-16",
  ],
};