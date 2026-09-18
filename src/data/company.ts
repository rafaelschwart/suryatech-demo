/**
 * Company constants. Everything marked `public` comes from the public record
 * (COMMBUYS, mass.gov, the Lowell filing, LinkedIn). Nothing here is confidential.
 */

export type Provenance = "public" | "sample" | "simulated" | "illustration";

export interface CompanyFact {
  key: string;
  label: string;
  value: string;
  usedIn: string;
  provenance: Provenance;
}

export const COMPANY = {
  legalName: "Suryatech EV Power LLC",
  brand: "SuryaTech",
  founder: "Mayur Kamalakar",
  email: "mayur.kamalakar@suryatechpower.com",
  phone: "339-244-9464",
  address: "48 Riley Road, Tyngsboro, MA 01879",
  founded: 2022,
  employees: "2 to 10",
  mbpo: "PO-25-1080-OSD03-OSD03-37680",
  contract: "VEH122",
  contractStart: "2025-10-01",
  contractEnd: "2033-09-30",
  categories: [1, 4] as const,
  sdoCertification: "MBE",
  sdpCommitmentPct: 30,
  promptPayment: "2% 10 · 1% 15 · 1% 20",
  product: "Hybrid solar and battery, non-grid-tied EV charging",
  massCecAwardUsd: 91000,
} as const;

export const companyFacts: CompanyFact[] = [
  { key: "legal", label: "Legal name", value: COMPANY.legalName, usedIn: "Every form", provenance: "public" },
  { key: "mbpo", label: "VEH122 MBPO", value: COMPANY.mbpo, usedIn: "Cover letter, Tab 1", provenance: "public" },
  {
    key: "cats",
    label: "Contract categories",
    value: "1 (EVSE, hardware, software, ancillary services) and 4 (EVSE operation and maintenance)",
    usedIn: "Tab 2 minimum requirements",
    provenance: "public",
  },
  { key: "sdo", label: "SDO certification", value: "MBE", usedIn: "Tab 1, SDP form", provenance: "public" },
  { key: "sdp", label: "SDP commitment", value: "30%", usedIn: "SDP form, quarterly report", provenance: "public" },
  { key: "founded", label: "Founded", value: "2022", usedIn: "Tab 3", provenance: "public" },
  { key: "size", label: "Employees", value: COMPANY.employees, usedIn: "Tab 3", provenance: "public" },
  { key: "office", label: "Office", value: COMPANY.address, usedIn: "Tab 3, W9", provenance: "public" },
  {
    key: "terms",
    label: "Prompt payment terms",
    value: COMPANY.promptPayment,
    usedIn: "Price proposal",
    provenance: "public",
  },
  {
    key: "contact",
    label: "Primary contact",
    value: `${COMPANY.founder} · ${COMPANY.email} · ${COMPANY.phone}`,
    usedIn: "Tab 3, cover letter",
    provenance: "public",
  },
];
