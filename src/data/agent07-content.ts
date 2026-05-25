// src/data/agent07-content.ts
// "Technical Response" output from Agent 07. Drafts answers to the City's
// technical questionnaire using the company knowledge base + past proposals.

export const agent07Content = {
  summary: {
    totalQuestions: 6,
    fullyCompliant: 4,
    partiallyCompliant: 2,
    nonCompliant: 0,
    avgConfidence: 91,
    sourcesUsed: 14,
  },

  // ─────────── Drafted Q&A ───────────
  responses: [
    {
      no: "TQ-01",
      question:
        "Describe your proposed approach for the LFGTE energy conversion technology and rationale for selection.",
      answer:
        "McDermott proposes a hybrid RICE engine-generator + supplemental high-BTU upgrade pathway. Two Caterpillar/INNIO 1.4 MW spark-ignited engines provide baseload electrical generation, with a parallel siloxane-removal and dehydration train enabling future RNG injection if the off-taker pathway shifts. This dual-pathway approach hedges the commodity risk highlighted in RFP §4.4.5 and is validated against our Denton, TX 2021 reference project, where the same configuration achieved 96% LFG utilization in Year 1.",
      standardsCited: ["EPA NSPS Subpart WWW", "API 11P", "ASME B31.3"],
      confidence: 95,
      compliance: "FULLY COMPLIANT",
      source: "Reference project: Denton LFGTE Phase 2 (2021) · KB doc TEC-LFGTE-019",
    },
    {
      no: "TQ-02",
      question:
        "Confirm compliance with TCEQ Title V air permit requirements and EPA NSPS for MSW Landfills (Subpart WWW).",
      answer:
        "McDermott will deliver a turnkey Title V permit application package and operate within all NSPS Subpart WWW conditions. Continuous emissions monitoring (CEMS) will be installed on the flare stack per 40 CFR Part 60 §60.18, with semi-annual reporting handled by McDermott's regulatory team. Our Texas regulatory affairs group has filed 12 successful Title V applications with TCEQ in the last 5 years; average approval cycle 5.5 months.",
      standardsCited: [
        "40 CFR Part 60 Subpart WWW",
        "TCEQ Title V",
        "40 CFR §60.18",
      ],
      confidence: 96,
      compliance: "FULLY COMPLIANT",
      source: "McDermott Regulatory Playbook RPB-TX-04 · 12 prior Title V filings",
    },
    {
      no: "TQ-03",
      question:
        "Describe the gas conditioning and treatment train, including dehydration, siloxane removal and H₂S handling.",
      answer:
        "The conditioning train comprises: (1) refrigerated dehydration to −30°C dew point per ASME B31.3; (2) two-stage activated-carbon siloxane removal vessels designed for ≤0.5 ppmv outlet concentration; (3) caustic-impregnated H₂S scavenger bed sized for the projected 80 ppmv inlet, validated against the City's 2020 LFG composition samples. All wetted parts in 316L stainless steel per NACE MR0175.",
      standardsCited: ["ASME B31.3", "NACE MR0175 / ISO 15156", "ASTM A312"],
      confidence: 92,
      compliance: "FULLY COMPLIANT",
      source: "Engineering standard ENG-LFG-003 Rev.4 · Denton reference data",
    },
    {
      no: "TQ-04",
      question:
        "Provide the proposed approach for the sales-point metering package — flow meter and methane analyzer make/model.",
      answer:
        "McDermott proposes a Daniel (Emerson) ultrasonic flow meter (Model 3414, AGA-9 compliant) paired with a Servomex 1900 continuous methane analyzer. Both selections meet RFP §4.3.2 'mutually acceptable' criteria — we will engage the City's procurement officer for final approval prior to PO release. The combination is in service at our Houston and Denton operating units with 99.7% measurement availability over the last 24 months.",
      standardsCited: ["AGA-9", "API 14.3", "ISO 10723"],
      confidence: 88,
      compliance: "PARTIALLY COMPLIANT",
      source: "Operating fleet performance database · 2 Texas references",
      caveat: "Make/model subject to City's mutually-acceptable approval per RFP §4.3.2.",
    },
    {
      no: "TQ-05",
      question:
        "Describe the LFG resource risk allocation and proposed mitigations given that LFG quantity is not contractually guaranteed by the City.",
      answer:
        "McDermott will assume the LFG resource risk per RFP §4.4.6 and proposes a phased capacity model to mitigate: Phase 1 sized for 750 scfm conservative case (achievable from current 2020 baseline of 1,050 scfm avg flow), with a Phase 2 expansion option triggered by sustained ≥1,000 scfm flow over 12 months. Investment is staged accordingly — Phase 1 capex of $19.4M unlocks the contract; Phase 2 capex of $6.2M deferred until LFG resource is proven. This protects both parties from the modelled-vs-actual flow risk explicitly disclaimed by the City.",
      standardsCited: ["RFP §4.4.6 (LFG Resource Risk)", "Internal RM-LFG-008"],
      confidence: 93,
      compliance: "FULLY COMPLIANT",
      source: "Risk Committee approved framework RM-LFG-008 · Phased-deployment precedent in Lubbock",
    },
    {
      no: "TQ-06",
      question:
        "Outline the local content plan and Texas HUB/LSB partnership approach per RFP evaluation criteria §6.2.",
      answer:
        "McDermott maintains a Texas-registered entity (McDermott Texas Operations LLC) in good standing. For this project we have pre-engaged Bay Ltd. (Corpus Christi · LSB-certified) for civil & foundation works and Berry GP for site infrastructure — together delivering an estimated 28% local content by value. We are continuing engagement with two additional Corpus Christi HUB vendors for electrical sub-supply, targeting 32% local content by award.",
      standardsCited: ["Texas Local Govt Code Ch. 176", "TX HUB Program"],
      confidence: 84,
      compliance: "PARTIALLY COMPLIANT",
      source: "McDermott Local Content Plan LC-TX-2026-007",
      caveat: "Current commitment 28% local; target 32% by award (above RFP-preferred threshold).",
    },
  ],

  // ─────────── Deviations register (the bid's exception list) ───────────
  deviationsRegister: [
    {
      ref: "TQ-04",
      deviation: "Sales-point meter & analyzer make/model subject to City approval",
      mitigation: "Pre-engagement with City procurement officer scheduled for week of 2026-05-20",
      risk: "LOW",
    },
    {
      ref: "TQ-06",
      deviation: "Local content at 28% (proposal stage); target 32% by award",
      mitigation: "Active vendor onboarding with 2 Corpus Christi HUB vendors",
      risk: "MEDIUM",
    },
  ],
};