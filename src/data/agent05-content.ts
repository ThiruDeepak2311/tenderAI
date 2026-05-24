// src/data/agent05-content.ts
// "Supplier RFQ" output from Agent 05. Drafted from the approved BOM.

export const agent05Content = {
  summary: {
    totalRfqs: 6,
    vendorsContacted: 17,
    expectedReturnRate: "82%",
    criticalPathRfq: "MD-RFQ-2026-001-A",
    issuedOn: "2026-04-12",
  },

  // ─────────── RFQ packages ───────────
  rfqPackages: [
    {
      rfqNo: "MD-RFQ-2026-001-A",
      commodity: "RICE Engine-Generator Sets (1.4 MW × 2)",
      priority: "CRITICAL",
      issueDate: "2026-04-12",
      responseDeadline: "2026-05-10",
      rfqScope: "Supply, FAT and delivery of 2 × 1.4 MW RICE engine-generator sets for LFG fuel service, ATEX Zone 2, with full SCADA interface and 5-year parts plan.",
      vendors: [
        { name: "Caterpillar Energy Solutions", country: "Germany / USA", status: "Approved", contact: "biogas@cat.com" },
        { name: "INNIO Jenbacher", country: "Austria", status: "Approved", contact: "lfg-sales@innio.com" },
        { name: "MTU Onsite Energy", country: "Germany", status: "Approved", contact: "renewables@mtu-solutions.com" },
      ],
      keyDocs: ["Engine Datasheet", "LFG Composition Profile", "Site Conditions Sheet", "Compliance Matrix Template"],
      commercialReqs: ["USD pricing", "DAP Corpus Christi", "Lead time from PO", "5+ comparable references"],
    },
    {
      rfqNo: "MD-RFQ-2026-001-B",
      commodity: "Gas Conditioning Skid (Dehydration + Siloxane Removal)",
      priority: "CRITICAL",
      issueDate: "2026-04-12",
      responseDeadline: "2026-05-10",
      rfqScope: "Modular gas conditioning package — refrigerated dehydration to −30°C dew point and activated-carbon siloxane removal vessels.",
      vendors: [
        { name: "Pioneer Air Systems", country: "USA", status: "Approved", contact: "rfq@pioneerair.com" },
        { name: "Unison Solutions", country: "USA", status: "Approved", contact: "sales@unisonsolutions.com" },
        { name: "PpTek (Pall Pneumatic)", country: "UK", status: "Approved", contact: "info@pptek.co.uk" },
      ],
      keyDocs: ["Skid Datasheet", "LFG Composition Profile", "ATEX Cert Requirements"],
      commercialReqs: ["USD pricing", "Lead time 26 weeks max", "Performance guarantee on dew point & H2S"],
    },
    {
      rfqNo: "MD-RFQ-2026-001-C",
      commodity: "LFG Flare System (5,000 scfm)",
      priority: "HIGH",
      issueDate: "2026-04-15",
      responseDeadline: "2026-05-13",
      rfqScope: "Enclosed ground flare, 5,000 scfm capacity, NSPS Subpart WWW compliant, with continuous combustion monitoring.",
      vendors: [
        { name: "Perennial Energy", country: "USA", status: "Approved", contact: "flares@perennialenergy.com" },
        { name: "John Zink Hamworthy", country: "USA", status: "Approved", contact: "biogas@johnzinkhamworthy.com" },
      ],
      keyDocs: ["Flare Datasheet", "TCEQ Compliance Matrix", "Monitoring Spec"],
      commercialReqs: ["USD pricing", "Lead time ≤22 weeks", "NSPS test certificate"],
    },
    {
      rfqNo: "MD-RFQ-2026-001-D",
      commodity: "Sales-Point Metering Package (Flow + Methane Analyzer)",
      priority: "HIGH",
      issueDate: "2026-04-15",
      responseDeadline: "2026-05-13",
      rfqScope: "Ultrasonic flow meter (AGA-9) + continuous methane analyzer for sales-point custody transfer. City approval of make/model required.",
      vendors: [
        { name: "Daniel — Emerson", country: "USA", status: "Approved", contact: "daniel.sales@emerson.com" },
        { name: "Sick Maihak", country: "Germany", status: "Approved", contact: "process-solutions@sick.com" },
        { name: "Thermo Fisher / Servomex", country: "UK / USA", status: "Approved", contact: "analyzers@thermofisher.com" },
      ],
      keyDocs: ["Custody Transfer Spec", "Calibration Procedure", "City Mutually-Acceptable Approval Form"],
      commercialReqs: ["USD pricing", "30-week max lead", "Includes 3-year service contract option"],
    },
    {
      rfqNo: "MD-RFQ-2026-001-E",
      commodity: "Electrical & Controls Package (MCC + PLC + F&G)",
      priority: "MEDIUM",
      issueDate: "2026-04-19",
      responseDeadline: "2026-05-17",
      rfqScope: "Integrated electrical & controls package: MCC, switchgear, Allen-Bradley PLC, fire & gas detection system, SIL-2 ESD.",
      vendors: [
        { name: "Rockwell Automation", country: "USA", status: "Approved", contact: "biogas@rockwellautomation.com" },
        { name: "Honeywell Process Solutions", country: "USA", status: "Approved", contact: "hps-sales@honeywell.com" },
        { name: "Siemens Industry", country: "USA / Germany", status: "Approved", contact: "process-automation@siemens.com" },
      ],
      keyDocs: ["I/O List", "P&ID", "F&G Spec", "SIL-2 Verification Plan"],
      commercialReqs: ["USD pricing", "Lead time ≤26 weeks", "On-site commissioning included"],
    },
    {
      rfqNo: "MD-RFQ-2026-001-F",
      commodity: "Civil & Skid Foundations (Subcontract)",
      priority: "MEDIUM",
      issueDate: "2026-04-22",
      responseDeadline: "2026-05-20",
      rfqScope: "Civil foundations, anchor bolts, equipment pads, fencing & access road grading. HUB / LSB-preferred Corpus Christi vendors prioritized.",
      vendors: [
        { name: "Bay Ltd. (Corpus Christi)", country: "USA · TX", status: "Approved · LSB", contact: "bids@bayltd.com" },
        { name: "Berry GP", country: "USA · TX", status: "Approved", contact: "construction@berrygp.com" },
      ],
      keyDocs: ["Civil Drawings", "Geotech Report", "TX HUB Form"],
      commercialReqs: ["USD pricing", "Local content reporting", "Lead time ≤12 weeks from NTP"],
    },
  ],
};