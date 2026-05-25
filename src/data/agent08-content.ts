// src/data/agent08-content.ts
// "Proposal Assembly" output from Agent 08. Bundles every prior agent's output
// into the final bid package, ready for submission.

export const agent08Content = {
  proposalRef: "MD-PROP-2026-3940",
  title: "Landfill Gas-to-Energy Facility — Cefe Valenzuela Landfill",
  client: "City of Corpus Christi, Texas",
  submittedBy: "McDermott — Process & Renewable Energy Division",
  submissionDate: "2026-05-25",
  validity: "180 days from submission",
  submissionStatus: "READY FOR REVIEW",
  totalPages: 142,

  executiveSummary:
    "McDermott is pleased to submit our Technical and Commercial Proposal for the Landfill Gas-to-Energy Facility at the City's Cefe Valenzuela Landfill. Our proposal is anchored on five proven LFGTE-comparable plants delivered in the last seven years, including the Denton, TX 2021 reference which achieved 96% LFG utilization in Year 1. We propose a hybrid RICE + future-RNG configuration that hedges off-taker commodity risk, deliver a phased capex approach that protects the City and proposer against LFG resource uncertainty, and commit 28% local content (target 32% by award) with Corpus Christi HUB/LSB partners. Our $24.6M phased commercial offer represents competitive Best Value, validated against our Texas operating fleet.",

  proposalSections: [
    { no: "1", title: "Executive Summary & Transmittal Letter", pages: 4, status: "READY" },
    { no: "2", title: "Minimum Qualifications & Compliance Forms", pages: 12, status: "READY" },
    { no: "3", title: "Technical Proposal — Scope of Supply", pages: 22, status: "READY" },
    { no: "4", title: "Engineering Basis & Reference Design", pages: 14, status: "READY" },
    { no: "5", title: "Preliminary P&ID & General Arrangement", pages: 8, status: "READY" },
    { no: "6", title: "Equipment Datasheets (Major Items)", pages: 16, status: "READY" },
    { no: "7", title: "Bill of Materials (Preliminary)", pages: 18, status: "READY" },
    { no: "8", title: "Quality, HSE & Inspection Plan", pages: 10, status: "READY" },
    { no: "9", title: "Technical Q&A and Compliance Matrix", pages: 9, status: "READY" },
    { no: "10", title: "Project Execution Plan & Schedule", pages: 12, status: "READY" },
    { no: "11", title: "Reference Project Experience", pages: 6, status: "READY" },
    { no: "12", title: "Local Content & HUB/LSB Plan", pages: 4, status: "READY" },
    { no: "13", title: "Deviations Register", pages: 3, status: "READY" },
    { no: "14", title: "Commercial Proposal & Pricing Schedule", pages: 4, status: "PENDING SIGNATURE" },
  ],

  commercialSummary: {
    totalLumpSum: "$24,600,000",
    contingencyPct: "8%",
    marginPct: "13%",
    deliveryWeeksFromPO: 52,
    milestones: [
      { name: "Contract Award & Notice to Proceed", pct: 20, amount: "$4,920,000" },
      { name: "Engineering Complete + Long-Lead PO", pct: 30, amount: "$7,380,000" },
      { name: "Equipment FAT Complete", pct: 25, amount: "$6,150,000" },
      { name: "Site Construction Complete", pct: 15, amount: "$3,690,000" },
      { name: "RFSU & Performance Acceptance", pct: 10, amount: "$2,460,000" },
    ],
  },

  differentiators: [
    "Proven Texas reference project — Denton LFGTE Phase 2 (2021) · 68% engineering reuse",
    "Phased capex protecting both parties against LFG resource uncertainty",
    "INNIO Jenbacher engines — largest US LFGTE fleet, strongest methane-tolerance",
    "28% local content commitment with Corpus Christi HUB/LSB vendors (target 32% at award)",
    "Texas regulatory affairs team with 12 successful Title V filings in 5 years",
  ],

  readinessChecklist: [
    { item: "Technical Proposal", status: "ready" },
    { item: "Bill of Materials", status: "ready" },
    { item: "Commercial Pricing Schedule", status: "ready" },
    { item: "Compliance Matrix", status: "ready" },
    { item: "HSE Plan & QMS Documentation", status: "ready" },
    { item: "Reference Project List", status: "ready" },
    { item: "Local Content / HUB Plan", status: "ready" },
    { item: "Deviations Register", status: "ready" },
    { item: "Conflict of Interest (Form CIQ)", status: "ready" },
    { item: "Business Designation Form", status: "ready" },
    { item: "Ethical Behavior Form", status: "ready" },
    { item: "Form 1295 — Interested Parties", status: "pending" },
    { item: "Signed Cover Letter (Director Signature)", status: "pending" },
    { item: "Bid Bond (Bank Guarantee)", status: "pending" },
  ],

  finalRecommendation:
    "All technical and commercial materials are assembled and consistent across sections. Three administrative items remain pending: Director signature on the cover letter, Form 1295 filing, and Bid Bond finance approval. Recommend submitting all three to Bid Director by 2026-05-23 to meet the Mar 9 proposal deadline with comfortable margin.",
};