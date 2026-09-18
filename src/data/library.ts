import type { Provenance } from "./company";

export interface LibraryEntry {
  id: string;
  title: string;
  detail: string;
  lastUsed: string | null;
  provenance: Provenance;
}

export const scopeBlocks: LibraryEntry[] = [
  {
    id: "scope-ngt",
    title: "Non-grid-tied hybrid solar and battery charger, site description",
    detail: "Reusable paragraph for Tab 4. Not yet written.",
    lastUsed: null,
    provenance: "sample",
  },
  {
    id: "scope-install",
    title: "Installation and commissioning approach",
    detail: "Survey, design, permitting, procurement, install, commissioning, handover.",
    lastUsed: null,
    provenance: "sample",
  },
  {
    id: "scope-om",
    title: "Operations and maintenance, category 4",
    detail: "Service history, alerts, warranty handling after handover.",
    lastUsed: null,
    provenance: "sample",
  },
];

export const rateCard: LibraryEntry[] = [
  {
    id: "rate-eng",
    title: "Hourly rate, engineering",
    detail: "Required in every VEH122 quote",
    lastUsed: null,
    provenance: "sample",
  },
  {
    id: "rate-elec",
    title: "Hourly rate, MA-licensed electrician",
    detail: "MBTA RFP requires staffing plan with licenses",
    lastUsed: null,
    provenance: "sample",
  },
  {
    id: "rate-pw",
    title: "Prevailing wage markup",
    detail: "Buyers read the Bidder Response Form for this",
    lastUsed: null,
    provenance: "sample",
  },
];

export const references: LibraryEntry[] = [
  {
    id: "ref-lowell",
    title: "1460 Middlesex Street, Lowell",
    detail: "Hybrid solar station at a Mobil site. Public filing exists. Contact and completion to confirm.",
    lastUsed: null,
    provenance: "sample",
  },
  { id: "ref-2", title: "Reference 2", detail: "Not on file", lastUsed: null, provenance: "sample" },
  { id: "ref-3", title: "Reference 3", detail: "Not on file", lastUsed: null, provenance: "sample" },
];

export const formTemplates: LibraryEntry[] = [
  { id: "f-sig", title: "Proposal Signature Page", detail: "MAPC Section 11", lastUsed: null, provenance: "sample" },
  {
    id: "f-noncoll",
    title: "Certificate of Non-Collusion",
    detail: "Standard Commonwealth form",
    lastUsed: null,
    provenance: "sample",
  },
  {
    id: "f-tax",
    title: "Certificate of Tax Compliance",
    detail: "Standard Commonwealth form",
    lastUsed: null,
    provenance: "sample",
  },
  {
    id: "f-coi",
    title: "Conflict of Interest Certification",
    detail: "Standard Commonwealth form",
    lastUsed: null,
    provenance: "sample",
  },
  {
    id: "f-151b",
    title: "Certificate of Compliance with M.G.L. c.151B",
    detail: "Standard Commonwealth form",
    lastUsed: null,
    provenance: "sample",
  },
  {
    id: "f-debar",
    title: "Certificate of Non-Debarment",
    detail: "Standard Commonwealth form",
    lastUsed: null,
    provenance: "sample",
  },
  { id: "f-lobby", title: "Lobbying Certification", detail: "Federal rider", lastUsed: null, provenance: "sample" },
  {
    id: "f-sdp",
    title: "SDP Plan Form",
    detail: "Required by MassDOT RFQ and every bid above $250,000",
    lastUsed: null,
    provenance: "sample",
  },
];
