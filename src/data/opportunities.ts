/**
 * VEH122 requests found on the public record. Every row below was read from COMMBUYS
 * (bid detail pages and the public bid search) or from the buyer's own posted RFP.
 * Nothing here needed a COMMBUYS account.
 */

export type BidStatus = "open" | "opened" | "closed" | "bid-to-po";

export type ResponseLoad = "rfq" | "rfp" | "rfp-heavy";

export interface Opportunity {
  bidNumber: string;
  buyer: string;
  buyerType: "state-agency" | "municipality" | "regional-agency" | "transit";
  title: string;
  summary: string;
  categories: number[] | null;
  ceilingUsd: number | null;
  ceilingNote?: string;
  siteCount: number | null;
  posted: string | null;
  closes: string;
  amendments: number;
  status: BidStatus;
  responseLoad: ResponseLoad;
  requiredAttachments?: string[];
  signals: string[];
  sourceUrl: string;
  suryatechResponseOnRecord: boolean;
}

export const opportunities: Opportunity[] = [
  {
    bidNumber: "BD-26-1217-MAP02-MAP02-121989",
    buyer: "Metropolitan Area Planning Council",
    buyerType: "regional-agency",
    title: "Non-grid-tied charging equipment and services, coupled with EV carshare, 6 municipal sites",
    summary:
      "Open to VEH122 vendors in categories 1 and 4. Pilot funded by a MassCEC ACT4All grant. Partners: Framingham, Quincy, Natick, and the housing authorities of Boston, Chelsea and Somerville.",
    categories: [1, 4],
    ceilingUsd: 660000,
    ceilingNote: "No single site above $110,000",
    siteCount: 6,
    posted: "2025-10-27",
    closes: "2025-12-15",
    amendments: 7,
    status: "closed",
    responseLoad: "rfp-heavy",
    requiredAttachments: [
      "Tab 1 cover letter and 13 signed forms",
      "Tab 2 Minimum Quality Requirements Form",
      "Tab 3 experience, 5 pages",
      "Tab 6 three references, one non-grid-tied, one carshare",
      "Tab 7 Price Proposal Template (xlsx), one price per site",
      "Site Selection Form",
    ],
    signals: ["non-grid-tied", "solar", "battery", "carshare-operator-required", "per-site-pricing", "grant-funded"],
    sourceUrl: "https://www.commbuys.com/bso/external/bidDetail.sdo?docId=BD-26-1217-MAP02-MAP02-121989",
    suryatechResponseOnRecord: false,
  },
  {
    bidNumber: "BD-26-1030-0H100-0H001-124479",
    buyer: "MassDOT, Office of the Chief Engineer",
    buyerType: "state-agency",
    title: "RFQ VEH122: Fleet charging",
    summary:
      "Attachments: RFQ document, revised RFQ, figures 1 to 5, concept plans, baseline schedule template, SDP form.",
    categories: null,
    ceilingUsd: null,
    siteCount: null,
    posted: "2026-01",
    closes: "2026-02-13",
    amendments: 1,
    status: "closed",
    responseLoad: "rfq",
    requiredAttachments: ["SDP Form", "Baseline schedule"],
    signals: ["fleet", "sdp-form", "schedule-template"],
    sourceUrl: "https://www.commbuys.com/bso/external/bidDetail.sdo?docId=BD-26-1030-0H100-0H001-124479",
    suryatechResponseOnRecord: false,
  },
  {
    bidNumber: "BD-26-1206-MBTA-MBTA-126475",
    buyer: "Massachusetts Bay Transportation Authority",
    buyerType: "transit",
    title: "RFP 31-26: Fleet EV charging station installations, Everett Shops",
    summary:
      "Install agency-owned Heliox and ChargePoint equipment: 10 ports, raised concrete islands, crash bollards, onboarding to the MBTA central management system. Evaluation 25/30/25/20.",
    categories: null,
    ceilingUsd: 2000000,
    ceilingNote: "Aggregator estimate $500,000 to $2,000,000",
    siteCount: 1,
    posted: "2026-03-12",
    closes: "2026-04-20",
    amendments: 0,
    status: "opened",
    responseLoad: "rfp",
    requiredAttachments: [
      "Signed cover letter",
      "Business and technical response",
      "Cost Response Form C",
      "Signed MBTA contract",
    ],
    signals: ["agency-owned-hardware", "civil-work", "large", "licensed-electricians", "bonds-likely"],
    sourceUrl: "https://www.commbuys.com/bso/external/bidDetail.sdo?docId=BD-26-1206-MBTA-MBTA-126475",
    suryatechResponseOnRecord: false,
  },
  {
    bidNumber: "BD-26-1020-DCRCU-DC250-126957",
    buyer: "Department of Conservation and Recreation",
    buyerType: "state-agency",
    title: "VEH122 DCR fleet EV charging station, Blackstone River and Canal Heritage State Park",
    summary: "One of three DCR park-site requests opened the same day.",
    categories: null,
    ceilingUsd: null,
    siteCount: 1,
    posted: null,
    closes: "2026-04-10",
    amendments: 0,
    status: "bid-to-po",
    responseLoad: "rfq",
    signals: ["park-site", "fleet", "remote-site", "repeat-buyer"],
    sourceUrl: "https://www.commbuys.com/bso/external/bidDetail.sdo?docId=BD-26-1020-DCRCU-DC250-126957",
    suryatechResponseOnRecord: false,
  },
  {
    bidNumber: "BD-26-1020-DCRCU-DC250-126947",
    buyer: "Department of Conservation and Recreation",
    buyerType: "state-agency",
    title: "VEH122 DCR fleet EV charging station, Blackstone Heritage Corridor",
    summary: "One of three DCR park-site requests opened the same day.",
    categories: null,
    ceilingUsd: null,
    siteCount: 1,
    posted: null,
    closes: "2026-04-10",
    amendments: 0,
    status: "bid-to-po",
    responseLoad: "rfq",
    signals: ["park-site", "fleet", "remote-site", "repeat-buyer"],
    sourceUrl: "https://www.commbuys.com/bso/external/bidDetail.sdo?docId=BD-26-1020-DCRCU-DC250-126947",
    suryatechResponseOnRecord: false,
  },
  {
    bidNumber: "BD-26-1020-DCRCU-DC250-126933",
    buyer: "Department of Conservation and Recreation",
    buyerType: "state-agency",
    title: "VEH122 DCR fleet EV charging station, Breakheart Reservation",
    summary: "One of three DCR park-site requests opened the same day.",
    categories: null,
    ceilingUsd: null,
    siteCount: 1,
    posted: null,
    closes: "2026-04-10",
    amendments: 0,
    status: "bid-to-po",
    responseLoad: "rfq",
    signals: ["park-site", "fleet", "remote-site", "repeat-buyer"],
    sourceUrl: "https://www.commbuys.com/bso/external/bidDetail.sdo?docId=BD-26-1020-DCRCU-DC250-126933",
    suryatechResponseOnRecord: false,
  },
  {
    bidNumber: "BD-26-1046-DFW-FWE11-124737",
    buyer: "Department of Fish and Game",
    buyerType: "state-agency",
    title: "VEH122 RFQ, EV charging stations, Belchertown (McLaughlin)",
    summary: "Second Belchertown request, one month after the first.",
    categories: null,
    ceilingUsd: null,
    siteCount: 1,
    posted: null,
    closes: "2026-02-10",
    amendments: 0,
    status: "bid-to-po",
    responseLoad: "rfq",
    signals: ["wildlife-office", "remote-site", "repeat-buyer"],
    sourceUrl: "https://www.commbuys.com/bso/external/bidDetail.sdo?docId=BD-26-1046-DFW-FWE11-124737",
    suryatechResponseOnRecord: false,
  },
  {
    bidNumber: "BD-26-1046-DFW-FWE21-123827",
    buyer: "Department of Fish and Game",
    buyerType: "state-agency",
    title: "VEH122 RFQ, EV charging stations, Belchertown (McLaughlin)",
    summary: "First Belchertown request. Closed without a purchase order and was reissued.",
    categories: null,
    ceilingUsd: null,
    siteCount: 1,
    posted: null,
    closes: "2026-01-15",
    amendments: 0,
    status: "closed",
    responseLoad: "rfq",
    signals: ["wildlife-office", "remote-site", "repeat-buyer"],
    sourceUrl: "https://www.commbuys.com/bso/external/bidDetail.sdo?docId=BD-26-1046-DFW-FWE21-123827",
    suryatechResponseOnRecord: false,
  },
  {
    bidNumber: "BD-26-1046-DFW-FWE11-123818",
    buyer: "Department of Fish and Game",
    buyerType: "state-agency",
    title: "VEH122 RFQ, EV charging stations, Westborough",
    summary: "Fish and Game field headquarters.",
    categories: null,
    ceilingUsd: null,
    siteCount: 1,
    posted: null,
    closes: "2026-01-15",
    amendments: 0,
    status: "bid-to-po",
    responseLoad: "rfq",
    signals: ["wildlife-office", "remote-site", "repeat-buyer"],
    sourceUrl: "https://www.commbuys.com/bso/external/bidDetail.sdo?docId=BD-26-1046-DFW-FWE11-123818",
    suryatechResponseOnRecord: false,
  },
];

export interface AmendmentEvent {
  date: string;
  bidNumber: string;
  text: string;
  kind: "date-change" | "attachment" | "criteria" | "qa";
}

/** MAPC's amendment history, as posted on COMMBUYS. This is what "watch open bids daily" catches. */
export const mapcAmendments: AmendmentEvent[] = [
  {
    date: "2025-10-27",
    bidNumber: "BD-26-1217-MAP02-MAP02-121989",
    kind: "attachment",
    text: "RFP FINAL, corrected, replaces the original file.",
  },
  {
    date: "2025-11-06",
    bidNumber: "BD-26-1217-MAP02-MAP02-121989",
    kind: "qa",
    text: "Bidders conference held. Video and slide deck posted.",
  },
  {
    date: "2025-11-12",
    bidNumber: "BD-26-1217-MAP02-MAP02-121989",
    kind: "date-change",
    text: "Bid opening moved from 11/24/2025 to 12/15/2025. Questions and responses posted.",
  },
  {
    date: "2025-11-26",
    bidNumber: "BD-26-1217-MAP02-MAP02-121989",
    kind: "criteria",
    text: "Amendment 5: evaluation criteria added to Section 8. Framingham and Natick sites revised.",
  },
  {
    date: "2025-12-01",
    bidNumber: "BD-26-1217-MAP02-MAP02-121989",
    kind: "attachment",
    text: "Corrected redlined RFP posted.",
  },
  {
    date: "2025-12-02",
    bidNumber: "BD-26-1217-MAP02-MAP02-121989",
    kind: "qa",
    text: "Amendment 6: additional response to question 11.",
  },
];

/** The search variants a watcher has to run. MAPC and MassDOT do not match the plain keyword. */
export const watcherQueries = [
  { query: "VEH122", matches: 8, note: "Plain keyword. Misses MAPC and MassDOT." },
  { query: "VEH 122", matches: 1, note: "With a space. Catches MAPC." },
  { query: "EV charging", matches: 14, note: "Broad. Catches c.30B municipal bids outside VEH122 too." },
  { query: "UNSPSC 25-17-50", matches: 6, note: "Commodity code for EV charging systems." },
] as const;

export function formatUsd(value: number | null): string {
  if (value === null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}
