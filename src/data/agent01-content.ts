// src/data/agent01-content.ts
// "Extracted intelligence" from the sample tender PDF that Agent 01 displays.
// All values here are pulled from the real Corpus Christi RFP No. 3940 document.

export const agent01Content = {
  // ─────────── The source document being processed ───────────
  document: {
    fileName: "RFP 3940 - Landfill Gas to Energy.pdf",
    fileUrl: "/tender-sample.pdf",
    pageCount: 61,
    fileSize: "1.8 MB",
    parsedAt: "2 sec ago",
    status: "Parsed successfully",
  },

  // ─────────── High-level project overview ───────────
  projectOverview: {
    client: "City of Corpus Christi, Texas",
    rfpNumber: "RFP No. 3940",
    projectTitle: "Landfill Gas-to-Energy (LFGTE) Facility",
    location: "Cefe Valenzuela Landfill, Robstown, Nueces County, Texas",
    scopeType: "Design, Build, Own, Operate (DBOO)",
    contractStructure: "Lease Agreement + Gas Purchase Agreement",
    issueDate: "February 7, 2022",
  },

  // ─────────── Key dates from the procurement schedule ───────────
  keyDates: [
    { label: "RFP Released", date: "Feb 7, 2022", type: "info" },
    { label: "Pre-Proposal Conference", date: "Feb 16, 2022 — 10:00 AM CT", type: "info" },
    { label: "Clarification Requests Due", date: "Feb 23, 2022 — 5:00 PM", type: "warning" },
    { label: "Addendum Posted", date: "Mar 2, 2022", type: "info" },
    { label: "Proposals Due", date: "Mar 9, 2022 — 2:00 PM", type: "critical" },
    { label: "Finalist Interviews", date: "Week of Mar 28, 2022", type: "info" },
    { label: "Award of Contract", date: "April 2022 (projected)", type: "info" },
  ],

  // ─────────── Scope of work summary ───────────
  scopeSummary: [
    "Design, permit, construct, operate and maintain LFGTE Facility on ~1.5 acres of leased Landfill property",
    "Receive Landfill Gas (LFG) from City's existing Gas Collection & Control System (GCCS)",
    "Convert LFG into medium-BTU gas, high-BTU gas, or onsite electrical generation for sale",
    "Negotiate downstream sales agreements with industrial users or utility purchasers",
    "Finance, own and operate the facility through full contract term",
    "Handle all permits, by-product disposal, environmental compliance, and end-of-term decommissioning",
  ],

  // ─────────── Hard technical numbers detected ───────────
  technicalRequirements: [
    { parameter: "Projected LFG Flow Rate (2021)", value: "1,115 scfm" },
    { parameter: "Average LFG Flow Rate (2020)", value: "1,050 scfm" },
    { parameter: "Existing Flare Capacity", value: "4,000 scfm" },
    { parameter: "Methane Content", value: "50% by volume" },
    { parameter: "Wellfield Vacuum Requirement", value: "−6 in. W.C." },
    { parameter: "Landfill Permitted Airspace", value: "130,495,000 cubic yards" },
    { parameter: "Project Land Lease Area", value: "~1.5 acres" },
    { parameter: "Energy Output Options", value: "Medium-BTU / High-BTU / Electrical" },
  ],

  // ─────────── Standards and regulations referenced ───────────
  standardsDetected: [
    { code: "40 CFR Part 60, Subpart WWW", body: "EPA", description: "New Source Performance Standards (NSPS) for MSW Landfills" },
    { code: "Title V", body: "EPA / TCEQ", description: "Operating permit program for major emission sources" },
    { code: "TCEQ MSW Permit No. 2269", body: "TCEQ", description: "Texas state landfill permit governing the site" },
    { code: "OSHA", body: "US Dept of Labor", description: "Occupational safety regulations for facility operations" },
    { code: "Texas Local Govt Code Ch. 176", body: "State of Texas", description: "Conflict of Interest disclosure (Form CIQ)" },
    { code: "Texas Govt Code § 2252.908", body: "State of Texas", description: "Form 1295 — Certificate of Interested Parties" },
  ],

  // ─────────── Proposal evaluation criteria & weighting ───────────
  evaluationCriteria: [
    { criterion: "Minimum Qualifications", weight: "Pass / Fail", detail: "5+ yrs experience, 2 commercial facilities, no litigation/regulatory issues" },
    { criterion: "Technical Proposal", weight: "50 pts", detail: "Firm experience (18) + Team experience (14) + Project understanding (18)" },
    { criterion: "Interview", weight: "20 pts", detail: "Firm experience (7) + Team identification (6) + Scope understanding (7)" },
    { criterion: "Price", weight: "30 pts", detail: "Best Value scoring, prorated across qualified proposers" },
  ],

  // ─────────── Mandatory compliance forms / submissions ───────────
  complianceChecklist: [
    "Transmittal letter on company letterhead",
    "Minimum Requirements form (with documentation)",
    "References — 3 current + 3 former clients",
    "Disclosure of Interest form",
    "Business Designation form (HUB / LSB)",
    "Ethical Behavior form",
    "Conflict of Interest Questionnaire (Form CIQ)",
    "Form 1295 — Certificate of Interested Parties (upon award)",
    "Pricing Form (separate sealed envelope)",
    "Insurance: $1M CGL Per Occurrence + $1M Aggregate, Workers' Comp",
  ],

  // ─────────── Risks the agent flagged for human review ───────────
  flaggedForReview: [
    {
      severity: "high",
      title: "LFG quantity not contractually guaranteed",
      detail: "City explicitly disclaims any guarantee that modeled LFG volumes will match actual extracted volumes. Resource risk sits entirely with proposer.",
    },
    {
      severity: "high",
      title: "Change-in-Law risk borne by proposer",
      detail: "Future regulatory changes affecting emissions, conversion or marketing of LFG-derived energy are the proposer's responsibility — no relief mechanism.",
    },
    {
      severity: "medium",
      title: "Flow meter & methane analyzer mutually acceptable",
      detail: "Sales-point metering equipment must be 'mutually acceptable' — no specific make/model given. Negotiation risk on measurement basis.",
    },
    {
      severity: "medium",
      title: "Contract term defined by proposer",
      detail: "Schedule §1.2 leaves the contract term open — proposer must propose. Affects financing model and risk allocation.",
    },
    {
      severity: "low",
      title: "Excess flare capacity above 4,000 scfm is proposer's responsibility",
      detail: "Existing flare maxes at 4,000 scfm; any overflow requires additional flare capacity at proposer's cost.",
    },
  ],
};