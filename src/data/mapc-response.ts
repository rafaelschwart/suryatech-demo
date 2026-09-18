/**
 * The response MAPC required, tab by tab, from RFP "Non-Grid Tied Electric Vehicle Charging and
 * Electric Vehicle Carshare Services" (issued 2025-10-27, corrected 2025-12-01). Field content
 * marked `public` is filled from the company record. `sample` stands in for Suryatech files we
 * have not seen. `missing` is what a real response would still have to produce.
 */

export type FieldState = "ready" | "sample" | "missing";

export interface ResponseField {
  label: string;
  value: string;
  source: string;
  state: FieldState;
}

export interface ResponseTab {
  id: string;
  number: number;
  title: string;
  rule: string;
  fields: ResponseField[];
}

export const mapcResponse: ResponseTab[] = [
  {
    id: "tab1",
    number: 1,
    title: "Introduction",
    rule: "Cover letter plus the Section 11 forms, in this exact order.",
    fields: [
      {
        label: "Cover letter",
        value: "Drafted from company constants and the MBPO",
        source: "Company file",
        state: "ready",
      },
      { label: "Proposal Signature Page", value: "Ready to sign", source: "Form template", state: "sample" },
      { label: "Certificate of Non-Collusion", value: "Ready to sign", source: "Form template", state: "sample" },
      { label: "Certificate of Tax Compliance", value: "Ready to sign", source: "Form template", state: "sample" },
      { label: "Conflict of Interest Certification", value: "Ready to sign", source: "Form template", state: "sample" },
      {
        label: "Certificate of Compliance with M.G.L. c.151B",
        value: "Ready to sign",
        source: "Form template",
        state: "sample",
      },
      { label: "Certificate of Non-Debarment", value: "Ready to sign", source: "Form template", state: "sample" },
      {
        label: "Federal and State Requirements Page",
        value: "Ready to sign",
        source: "Form template",
        state: "sample",
      },
      { label: "Right to Know Law Page", value: "Ready to sign", source: "Form template", state: "sample" },
      { label: "Lobbying Certification", value: "Ready to sign", source: "Form template", state: "sample" },
      {
        label: "List of subcontractors",
        value: "ELC Electrical Consulting appears on the Lowell filing. Role to confirm.",
        source: "",
        state: "missing",
      },
      { label: "Certificate of Authority, corporate", value: "Not on file", source: "", state: "missing" },
      { label: "IRS Form W9", value: "Not on file", source: "", state: "missing" },
    ],
  },
  {
    id: "tab2",
    number: 2,
    title: "Minimum quality",
    rule: "Every line answered yes. One no, or one qualified answer, rejects the whole proposal.",
    fields: [
      {
        label: "VEH122 categories 1 and 4",
        value: "Yes. PO-25-1080-OSD03-OSD03-37680",
        source: "COMMBUYS",
        state: "ready",
      },
      {
        label: "Non-grid-tied equipment",
        value: "Yes. Hybrid solar and battery charger, MassCEC-funded pilot",
        source: "Public record",
        state: "ready",
      },
      {
        label: "EV carshare operator on the team",
        value: "RFP requires a joint venture with a carshare operator",
        source: "",
        state: "missing",
      },
      {
        label: "Insurance per MAPC Standard Contract, Appendix B",
        value: "Certificate not on file",
        source: "",
        state: "missing",
      },
    ],
  },
  {
    id: "tab3",
    number: 3,
    title: "Experience",
    rule: "Five pages. Resumes as appendices do not count toward the limit.",
    fields: [
      { label: "Founded", value: "2022", source: "LinkedIn", state: "ready" },
      { label: "Employees", value: "2 to 10", source: "LinkedIn", state: "ready" },
      { label: "Office", value: "48 Riley Road, Tyngsboro, MA", source: "Lowell filing", state: "ready" },
      { label: "Staff based in Boston metro", value: "To confirm", source: "", state: "missing" },
      { label: "Key team members and resumes", value: "Not on file", source: "", state: "missing" },
      {
        label: "Past non-grid-tied deployments",
        value: "1460 Middlesex Street, Lowell. Outcome to confirm",
        source: "Lowell filing",
        state: "sample",
      },
      {
        label: "Primary contact",
        value: "Mayur Kamalakar, mayur.kamalakar@suryatechpower.com, 339-244-9464",
        source: "Company file",
        state: "ready",
      },
    ],
  },
  {
    id: "tab4",
    number: 4,
    title: "Scope and approach",
    rule: "Comprehensive description of capacity, approach and equipment for each site.",
    fields: [
      {
        label: "Scope of services narrative",
        value: "Draft from scope block: non-grid-tied hybrid solar and battery charger",
        source: "Answer library",
        state: "sample",
      },
      { label: "Site implementation timeline", value: "Not drafted", source: "", state: "missing" },
      {
        label: "Reporting and performance review approach",
        value: "RFP 6.4 asks for monitoring and possible redeployment",
        source: "",
        state: "missing",
      },
    ],
  },
  {
    id: "tab5",
    number: 5,
    title: "Specs and warranties",
    rule: "Technical specifications of the proposed equipment and its warranty terms.",
    fields: [
      {
        label: "Technical specifications",
        value: "Draft from product sheet",
        source: "Answer library",
        state: "sample",
      },
      { label: "Warranty terms", value: "Not on file", source: "", state: "missing" },
    ],
  },
  {
    id: "tab6",
    number: 6,
    title: "References",
    rule: "At least three, using the Reference Form. One non-grid-tied, one carshare. MAPC calls at random.",
    fields: [
      {
        label: "Reference 1, non-grid-tied charging",
        value: "1460 Middlesex Street, Lowell. Contact and outcome unknown",
        source: "Answer library",
        state: "sample",
      },
      { label: "Reference 2, EV carshare services", value: "Required by the RFP", source: "", state: "missing" },
      { label: "Reference 3", value: "Minimum is three", source: "", state: "missing" },
    ],
  },
  {
    id: "tab7",
    number: 7,
    title: "Price proposal",
    rule: "Appendix D template. One price per candidate site per partner, none above $110,000. Narrative five pages max.",
    fields: [
      { label: "Price Proposal Signature Page", value: "Ready to sign", source: "Form template", state: "sample" },
      {
        label: "Price Proposal Template (xlsx)",
        value: "Six Framingham sites, one price each",
        source: "RFP 6.3",
        state: "ready",
      },
      { label: "Sites 1 to 6, Framingham", value: "Unpriced", source: "", state: "missing" },
      { label: "Site ranking, Site Selection Form", value: "Unranked", source: "", state: "missing" },
      { label: "Price variation narrative", value: "Not drafted", source: "", state: "missing" },
      {
        label: "Cost share contribution",
        value: "Cumulative floor across bidders is $150,000 in-kind",
        source: "",
        state: "missing",
      },
      { label: "Prompt payment terms", value: "2% 10 · 1% 15 · 1% 20", source: "COMMBUYS", state: "ready" },
    ],
  },
];

export interface ExportFile {
  name: string;
  ext: "PDF" | "XLSX";
  state: "ready" | "partial" | "blocked";
  note: string;
}

export const mapcExportPack: ExportFile[] = [
  {
    name: "Tab 1 · Cover letter and 13 signed forms",
    ext: "PDF",
    state: "partial",
    note: "Signatures pending, 3 forms missing",
  },
  { name: "Tab 2 · Minimum Quality Requirements Form", ext: "PDF", state: "blocked", note: "2 lines unanswered" },
  { name: "Tab 3 · Experience and qualifications", ext: "PDF", state: "partial", note: "Resumes missing" },
  { name: "Tab 4 · Scope of services, approach, equipment", ext: "PDF", state: "partial", note: "Draft" },
  { name: "Tab 5 · Technical specifications and warranties", ext: "PDF", state: "partial", note: "Warranty missing" },
  { name: "Tab 6 · Three reference forms", ext: "PDF", state: "blocked", note: "1 of 3" },
  { name: "Tab 7 · Price Proposal Template, Appendix D", ext: "XLSX", state: "blocked", note: "6 of 6 sites unpriced" },
  { name: "Site Selection Form, six Framingham sites ranked", ext: "PDF", state: "blocked", note: "Unranked" },
];
