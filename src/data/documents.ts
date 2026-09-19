import type { Provenance } from "./company";

export interface SampleDocument {
  id: string;
  stage: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  stageLabel: string;
  title: string;
  what: string;
  pages: number;
  file: string;
  provenance: Provenance;
  screen: string;
  screenUrl: string;
}

/**
 * The documents the desk produces, one or more per stage, as samples Mayur can open.
 * Company facts and the MAPC request are public record. Values marked SAMPLE inside the
 * documents are placeholders for material Suryatech has not shared.
 */
export const sampleDocuments: SampleDocument[] = [
  {
    id: "intake",
    stage: 1,
    stageLabel: "A buyer posts",
    title: "Opportunity intake sheet",
    what: "The MAPC request as the watcher captured it: buyer, ceiling, sites, the seven required tabs, the fit verdict with reasons, and the full amendment log.",
    pages: 2,
    file: "/documents/01-opportunity-intake-sheet.pdf",
    provenance: "public",
    screen: "Opportunities",
    screenUrl: "/dashboard/opportunities",
  },
  {
    id: "digest",
    stage: 2,
    stageLabel: "The watcher sees it",
    title: "Morning watch digest",
    what: "The 07:00 report reconstructed for November 13, 2025, the morning after MAPC moved its due date: what changed, which queries ran, what is on the watch list, the one thing to act on.",
    pages: 1,
    file: "/documents/02-morning-watch-digest.pdf",
    provenance: "public",
    screen: "Opportunities",
    screenUrl: "/dashboard/opportunities",
  },
  {
    id: "cover",
    stage: 3,
    stageLabel: "The response assembles",
    title: "Tab 1 cover letter",
    what: "The letter to MAPC on Suryatech letterhead, drafted from company constants. The carshare partner and signatures are placeholders.",
    pages: 1,
    file: "/documents/03-tab1-cover-letter.pdf",
    provenance: "sample",
    screen: "Response assembler",
    screenUrl: "/dashboard/assembler",
  },
  {
    id: "experience",
    stage: 3,
    stageLabel: "The response assembles",
    title: "Tab 3 experience and qualifications",
    what: "Company, product validation, past work, key personnel and organization, within the five-page limit. Public facts filled, team detail placeholders.",
    pages: 2,
    file: "/documents/04-tab3-experience.pdf",
    provenance: "sample",
    screen: "Response assembler",
    screenUrl: "/dashboard/assembler",
  },
  {
    id: "price",
    stage: 3,
    stageLabel: "The response assembles",
    title: "Tab 7 price proposal summary",
    what: "Six Framingham sites priced under the $110,000 cap and ranked, with cost share and the basis of variation. Sample figures.",
    pages: 1,
    file: "/documents/05-tab7-price-proposal.pdf",
    provenance: "sample",
    screen: "Response assembler",
    screenUrl: "/dashboard/assembler",
  },
  {
    id: "manifest",
    stage: 4,
    stageLabel: "The pack is built",
    title: "Submission pack manifest",
    what: "The eight files named the way the RFP names them, each with its state, and the gate: nothing uploads while a line is blocked.",
    pages: 1,
    file: "/documents/06-submission-pack-manifest.pdf",
    provenance: "public",
    screen: "Export pack",
    screenUrl: "/dashboard/export",
  },
  {
    id: "record",
    stage: 5,
    stageLabel: "A person uploads",
    title: "Submission record",
    what: "Who uploaded, when, with what margin to the deadline, and the file fingerprints matched to the manifest. Recorded by a person, never by the system.",
    pages: 1,
    file: "/documents/07-submission-record.pdf",
    provenance: "sample",
    screen: "Export pack",
    screenUrl: "/dashboard/export",
  },
  {
    id: "sdp",
    stage: 6,
    stageLabel: "Evidence register",
    title: "SDP spending report",
    what: "The quarterly Prime Contractor Spending Report in the OSD structure, with the 30% commitment check across the fiscal year. Sample values.",
    pages: 1,
    file: "/documents/08-sdp-spending-report.pdf",
    provenance: "sample",
    screen: "Evidence register",
    screenUrl: "/dashboard/evidence",
  },
  {
    id: "powercheck",
    stage: 7,
    stageLabel: "Stations",
    title: "Station power check report",
    what: "One API call as a document: seven checks with reading, threshold and result, findings, and actions with owners. Simulated station.",
    pages: 1,
    file: "/documents/09-station-power-check-report.pdf",
    provenance: "simulated",
    screen: "Stations",
    screenUrl: "/dashboard/operations",
  },
];
