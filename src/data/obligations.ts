import { addDays, differenceInCalendarDays, format, parseISO } from "date-fns";

import { COMPANY, type Provenance } from "./company";

export type ObligationStatus = "due" | "confirm" | "unknown" | "on-file";

export interface Obligation {
  id: string;
  name: string;
  rule: string;
  cadence: string;
  nextDate: string | null;
  documentOnFile: string | null;
  status: ObligationStatus;
  owner: string | null;
  provenance: Provenance;
  source: string;
}

/** Massachusetts fiscal quarters run Jul 1 to Jun 30. */
export function fiscalQuarterFor(date: Date): { label: string; start: Date; end: Date; fiscalYear: number } {
  const month = date.getMonth();
  const year = date.getFullYear();
  const starts = [
    { m: 6, label: "Q1", fyOffset: 1 },
    { m: 9, label: "Q2", fyOffset: 1 },
    { m: 0, label: "Q3", fyOffset: 0 },
    { m: 3, label: "Q4", fyOffset: 0 },
  ];
  const startMonth = month >= 9 ? 9 : month >= 6 ? 6 : month >= 3 ? 3 : 0;
  const q = starts.find((s) => s.m === startMonth) ?? starts[0];
  const start = new Date(year, startMonth, 1);
  const end = new Date(year, startMonth + 3, 0);
  return { label: q.label, start, end, fiscalYear: year + q.fyOffset };
}

/** SDP Prime Contractor Spending Report: due within 45 days of the end of each quarter. */
export function sdpReportSchedule(now: Date) {
  const current = fiscalQuarterFor(now);
  const currentDue = addDays(current.end, 45);
  const prevEnd = addDays(current.start, -1);
  const prev = fiscalQuarterFor(prevEnd);
  const prevDue = addDays(prev.end, 45);
  return {
    current: {
      label: `FY${current.fiscalYear} ${current.label} (${format(current.start, "MMM d")} to ${format(current.end, "MMM d")})`,
      due: currentDue,
      daysLeft: differenceInCalendarDays(currentDue, now),
    },
    previous: {
      label: `FY${prev.fiscalYear} ${prev.label} (${format(prev.start, "MMM d")} to ${format(prev.end, "MMM d")})`,
      due: prevDue,
      daysAgo: differenceInCalendarDays(now, prevDue),
    },
  };
}

export function buildObligations(now: Date): Obligation[] {
  const sdp = sdpReportSchedule(now);
  return [
    {
      id: "sdp-current",
      name: `SDP spending report, ${sdp.current.label}`,
      rule: `Quarterly contract sales, spend with each certified SDP partner, relationship type, year-to-date check against the ${COMPANY.sdpCommitmentPct}% commitment, explanation if short.`,
      cadence: "Quarterly, within 45 days of quarter end",
      nextDate: format(sdp.current.due, "yyyy-MM-dd"),
      documentOnFile: null,
      status: "due",
      owner: COMPANY.founder,
      provenance: "public",
      source: "SDP Prime Contractor Spending Report form, OSD",
    },
    {
      id: "sdp-previous",
      name: `SDP spending report, ${sdp.previous.label}`,
      rule: "Same report for the quarter that already closed.",
      cadence: "Quarterly",
      nextDate: format(sdp.previous.due, "yyyy-MM-dd"),
      documentOnFile: null,
      status: "confirm",
      owner: COMPANY.founder,
      provenance: "sample",
      source: "Whether this was filed is a Discovery question",
    },
    {
      id: "mbe",
      name: "MBE certification renewal",
      rule: "Renew through the SDO portal with a renewal affidavit. A lapse removes the business from the SDO directory.",
      cadence: "Every 3 years",
      nextDate: null,
      documentOnFile: null,
      status: "unknown",
      owner: COMPANY.founder,
      provenance: "sample",
      source: "mass.gov, maintaining your SDO certification. Certification date unknown.",
    },
    {
      id: "masscec",
      name: `MassCEC InnovateMass, $${COMPANY.massCecAwardUsd.toLocaleString("en-US")} award`,
      rule: "5 to 8 milestones. Payment on accepted deliverables, invoices, proof of expenditure and budget-to-actual. 50% cost share. Final report closes it.",
      cadence: "Per milestone",
      nextDate: null,
      documentOnFile: null,
      status: "unknown",
      owner: null,
      provenance: "sample",
      source: "InnovateMass RFP, MassCEC. Milestone schedule unknown.",
    },
    {
      id: "veh122",
      name: "VEH122 vendor standing",
      rule: `${COMPANY.mbpo}, categories 1 and 4.`,
      cadence: "Contract term",
      nextDate: COMPANY.contractEnd,
      documentOnFile: "COMMBUYS master blanket record",
      status: "on-file",
      owner: null,
      provenance: "public",
      source: "COMMBUYS",
    },
    {
      id: "forms",
      name: "Standing certification forms",
      rule: "Tax Compliance, Non-Collusion, Non-Debarment, c.151B, Conflict of Interest, Lobbying, Right to Know. Signed per response.",
      cadence: "Per response",
      nextDate: null,
      documentOnFile: null,
      status: "unknown",
      owner: null,
      provenance: "sample",
      source: "MAPC RFP, Section 11",
    },
  ];
}

export function daysUntil(iso: string, now: Date): number {
  return differenceInCalendarDays(parseISO(iso), now);
}
