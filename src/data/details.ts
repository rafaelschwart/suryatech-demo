import { scoreOpportunity, verdictLabel } from "@/lib/fit";

import { filingColumns, responseColumns, workOrderCards, workOrderColumns } from "./boards";
import type { Provenance } from "./company";
import { sampleDocuments } from "./documents";
import { mapcExportPack, mapcResponse } from "./mapc-response";
import { buildObligations, daysUntil, sdpReportSchedule } from "./obligations";
import { formatUsd, mapcAmendments, opportunities } from "./opportunities";

/**
 * The story behind every item on the boards and the deadline board: where it sits in its
 * pipeline, what happened when, the facts that matter, what comes next, and the document for
 * that stage. Keyed by the same ids the boards and tables use.
 */

export type StageState = "done" | "current" | "pending" | "skipped";

export interface DetailStage {
  id: string;
  title: string;
  state: StageState;
  note?: string;
}

export interface DetailEvent {
  date: string;
  label: string;
  note?: string;
  tone?: "ok" | "warning" | "critical" | "neutral";
}

export interface DetailAction {
  label: string;
  hint?: string;
  href: string;
  external?: boolean;
}

export interface ItemDetail {
  id: string;
  kind: "request" | "filing" | "work-order";
  title: string;
  subtitle?: string;
  provenance: Provenance;
  status?: { label: string; tone: "ok" | "warning" | "critical" | "neutral" };
  stages: DetailStage[];
  facts: [string, string][];
  timeline: DetailEvent[];
  next: DetailAction[];
  docs: { label: string; file: string }[];
}

function doc(id: string) {
  const d = sampleDocuments.find((x) => x.id === id);
  return d ? [{ label: d.title, file: d.file }] : [];
}

function stagesFrom(
  columns: { id: string; title: string }[],
  current: string,
  skipped: string[] = [],
  notes: Record<string, string> = {},
): DetailStage[] {
  const idx = columns.findIndex((c) => c.id === current);
  return columns.map((c, i) => {
    let state: StageState = i < idx ? "done" : i === idx ? "current" : "pending";
    if (skipped.includes(c.id)) state = "skipped";
    return { id: c.id, title: c.title, state, note: notes[c.id] };
  });
}

const buyerTypeLabel = {
  "state-agency": "State agency",
  municipality: "Municipality",
  "regional-agency": "Regional agency",
  transit: "Transit authority",
} as const;

const loadLabel = { rfq: "RFQ, short", rfp: "RFP", "rfp-heavy": "RFP, heavy" } as const;

function requestDetails(): ItemDetail[] {
  return opportunities.map((o) => {
    const fit = scoreOpportunity(o);
    const awarded = o.status === "bid-to-po";
    const amendments = mapcAmendments.filter((a) => a.bidNumber === o.bidNumber);
    const timeline: DetailEvent[] = [];
    if (o.posted)
      timeline.push({ date: o.posted, label: "Posted on COMMBUYS", note: `${o.buyer}. ${loadLabel[o.responseLoad]}.` });
    for (const a of amendments)
      timeline.push({
        date: a.date,
        label: "Amendment",
        note: a.text,
        tone: a.kind === "date-change" ? "warning" : "neutral",
      });
    timeline.push({
      date: o.posted ?? o.closes,
      label: `Triage: ${verdictLabel[fit.verdict]} (${fit.score})`,
      note: fit.reasons[0],
      tone: fit.verdict === "chase" ? "ok" : fit.verdict === "consider" ? "warning" : "neutral",
    });
    timeline.push({
      date: o.closes,
      label: awarded ? "Closed and awarded to another vendor" : "Closed",
      note: "No Suryatech response on the public record.",
      tone: "critical",
    });
    return {
      id: o.bidNumber,
      kind: "request",
      title: o.buyer,
      subtitle: o.title,
      provenance: "public",
      status: {
        label: awarded ? "Awarded to others" : "No response on record",
        tone: awarded ? "critical" : "warning",
      },
      stages: stagesFrom(responseColumns, "closed", ["assembling", "ready", "submitted"], {
        watching: o.posted ? `posted ${o.posted}` : "posting date not shown",
        triage: `${verdictLabel[fit.verdict]}, ${fit.score}`,
        assembling: "never started",
        submitted: "nothing on record",
        closed: `closed ${o.closes}`,
      }),
      facts: [
        ["Bid number", o.bidNumber],
        ["Buyer", `${o.buyer} (${buyerTypeLabel[o.buyerType]})`],
        ["Ceiling", `${formatUsd(o.ceilingUsd)}${o.ceilingNote ? `, ${o.ceilingNote}` : ""}`],
        ["Categories", o.categories ? o.categories.join(" and ") : "not stated"],
        ["Sites", o.siteCount ? String(o.siteCount) : "not stated"],
        ["Response load", `${loadLabel[o.responseLoad]}, about ${fit.effortHours} hours`],
        ["Amendments", String(o.amendments)],
        ...(o.requiredAttachments
          ? ([["Required attachments", o.requiredAttachments.join("; ")]] as [string, string][])
          : []),
        ["What the buyer wanted", o.summary],
      ],
      timeline,
      next: [
        {
          label: "Reuse what this request taught",
          hint: "Scope blocks and answers in the library",
          href: "/dashboard/library",
        },
        {
          label: "Assemble the next one in the buyer's format",
          hint: "The MAPC seven-tab worked example",
          href: "/dashboard/assembler",
        },
        { label: "Open on COMMBUYS", href: o.sourceUrl, external: true },
      ],
      docs: [...doc("intake"), ...doc("digest")],
    };
  });
}

function sampleRequestDetails(): ItemDetail[] {
  const fields = mapcResponse.flatMap((t) => t.fields);
  const ready = fields.filter((f) => f.state === "ready").length;
  const missing = fields.filter((f) => f.state === "missing").length;
  const blocked = mapcExportPack.filter((f) => f.state === "blocked").length;
  const today = new Date().toISOString().slice(0, 10);
  return [
    {
      id: "sample-dcr-new",
      kind: "request",
      title: "Department of Conservation and Recreation",
      subtitle: "VEH122 DCR fleet EV charging station, simulated posting",
      provenance: "sample",
      status: { label: "New this morning", tone: "ok" },
      stages: stagesFrom(responseColumns, "watching", [], { watching: "found by the 07:00 search" }),
      facts: [
        ["Bid number", "BD-27-1020-DCRCU-DC250-SIMULATED"],
        ["Buyer", "Department of Conservation and Recreation (state agency)"],
        ["Closes", "2026-10-30"],
        ["Why it is here", "The Simulate switch on Opportunities adds this posting to show the alert flow."],
      ],
      timeline: [
        {
          date: today,
          label: "Found by the morning search",
          note: "Matched the VEH122 and EV charging query variants.",
          tone: "ok",
        },
        { date: today, label: "Waiting for triage", note: "The rules will score it once a person opens it." },
      ],
      next: [
        { label: "Triage it", hint: "Chase, consider or pass, with reasons", href: "/dashboard/opportunities" },
        { label: "Start the intake sheet", href: "/dashboard/documents" },
      ],
      docs: [...doc("digest"), ...doc("intake")],
    },
    {
      id: "sample-mapc-example",
      kind: "request",
      title: "MAPC, worked example",
      subtitle: "Non-grid-tied charging, 6 municipal sites (BD-26-1217)",
      provenance: "sample",
      status: { label: `${ready} of ${fields.length} fields ready`, tone: "warning" },
      stages: stagesFrom(responseColumns, "assembling", [], {
        watching: "posted 2025-10-27",
        triage: "Chase, 45",
        assembling: `${ready}/${fields.length} fields`,
        ready: `${blocked} files blocked`,
      }),
      facts: [
        ["Format", "Seven tabs, thirteen signed forms in Tab 1, price per site in Tab 7"],
        ["Filled from the library", `${ready} fields`],
        ["Still need a person", `${missing} fields`],
        ["Export pack", `${mapcExportPack.length} files, ${blocked} blocked on signatures and certificates`],
        ["Why this request", "It asked for exactly Suryatech's product: non-grid-tied charging on municipal lots."],
      ],
      timeline: [
        { date: "2025-10-27", label: "Posted on COMMBUYS", note: "Metropolitan Area Planning Council." },
        ...mapcAmendments.map((a) => ({
          date: a.date,
          label: "Amendment",
          note: a.text,
          tone: (a.kind === "date-change" ? "warning" : "neutral") as DetailEvent["tone"],
        })),
        {
          date: "2025-12-15",
          label: "Closed",
          note: "Used here as the worked example of the format.",
          tone: "neutral",
        },
      ],
      next: [
        { label: `Fill the ${missing} missing fields`, href: "/dashboard/assembler" },
        {
          label: `Unblock the ${blocked} export files`,
          hint: "Signatures, W9, certificate of authority",
          href: "/dashboard/export",
        },
        { label: "Check the evidence that Tab 1 needs", href: "/dashboard/evidence" },
      ],
      docs: [...doc("cover"), ...doc("experience"), ...doc("price"), ...doc("manifest")],
    },
  ];
}

function filingDetails(now: Date): ItemDetail[] {
  const sdp = sdpReportSchedule(now);
  return buildObligations(now).map((o) => {
    const days = o.nextDate ? daysUntil(o.nextDate, now) : null;
    let current = "upcoming";
    if (o.status === "confirm") current = "confirm";
    else if (o.status === "on-file") current = "filed";
    else if (o.status === "unknown") current = "preparing";
    const timeline: DetailEvent[] = [];
    if (o.id === "sdp-current") {
      const quarterEnd = new Date(sdp.current.due.getTime() - 45 * 86_400_000);
      timeline.push({ date: quarterEnd.toISOString().slice(0, 10), label: `Quarter ends (${sdp.current.label})` });
      timeline.push({
        date: o.nextDate as string,
        label: "Report due",
        note: "45 days after quarter end.",
        tone: days !== null && days <= 14 ? "critical" : "warning",
      });
    } else if (o.id === "sdp-previous") {
      timeline.push({
        date: o.nextDate as string,
        label: "Report was due",
        note: "Whether it was filed is unknown until Discovery.",
        tone: "warning",
      });
    } else if (o.nextDate) {
      timeline.push({ date: o.nextDate, label: "Date", note: o.cadence });
    } else {
      timeline.push({ date: "—", label: "Date to confirm", note: o.source, tone: "neutral" });
    }
    const next: DetailAction[] = [
      { label: "Evidence register", hint: "Cadence, next date and the proving document", href: "/dashboard/evidence" },
    ];
    if (o.id.startsWith("sdp"))
      next.unshift({
        label: "Prepare the SDP report",
        hint: "Contract sales and SDP partner spend for the quarter",
        href: "/dashboard/evidence",
      });
    if (o.id === "mbe")
      next.push({
        label: "SDO certification renewal (mass.gov)",
        href: "https://www.mass.gov/how-to/maintain-your-sdo-certification",
        external: true,
      });
    return {
      id: o.id,
      kind: "filing",
      title: o.name,
      subtitle: o.cadence,
      provenance: o.provenance,
      status: {
        label: days !== null ? (days >= 0 ? `${days} days` : "past due") : "date to confirm",
        tone: days !== null ? (days <= 14 ? "critical" : days <= 45 ? "warning" : "ok") : "neutral",
      },
      stages: stagesFrom(filingColumns, current),
      facts: [
        ["Rule", o.rule],
        ["Cadence", o.cadence],
        ["Next date", o.nextDate ?? "unknown"],
        ["Document on file", o.documentOnFile ?? "none seen"],
        ["Owner", o.owner ?? "to assign"],
        ["Source", o.source],
      ],
      timeline,
      next,
      docs: o.id.startsWith("sdp") ? doc("sdp") : [],
    };
  });
}

function workOrderDetails(): ItemDetail[] {
  return workOrderCards.map((w) => {
    const station = w.meta?.split(" · ")[0] ?? "";
    const when = w.meta?.split(" · ")[1];
    const colIdx = workOrderColumns.findIndex((c) => c.id === w.column);
    const timeline: DetailEvent[] = workOrderColumns.slice(0, colIdx + 1).map((c, i) => ({
      date: i === colIdx && when ? when : i === 0 ? "reported" : "—",
      label: c.title,
      note: i === colIdx ? w.subtitle : undefined,
      tone:
        i === colIdx
          ? w.badgeTone === "critical"
            ? "critical"
            : w.badgeTone === "warning"
              ? "warning"
              : "ok"
          : "neutral",
    }));
    return {
      id: w.id,
      kind: "work-order",
      title: w.title,
      subtitle: w.subtitle,
      provenance: w.provenance,
      status: w.badge ? { label: w.badge, tone: w.badgeTone ?? "neutral" } : undefined,
      stages: stagesFrom(workOrderColumns, w.column),
      facts: [
        ["Station", station],
        ["When", when ?? "—"],
        ["Raised by", w.column === "reported" ? "StatusNotification from the station" : "Operator"],
      ],
      timeline,
      next: [
        { label: "Open the station", hint: "3D unit, consumption, controls", href: w.href ?? "/dashboard/operations" },
        {
          label: "Run a power check",
          hint: "Compares every reading to a threshold",
          href: w.href ?? "/dashboard/operations",
        },
      ],
      docs: doc("powercheck"),
    };
  });
}

export function buildDetails(now: Date): Map<string, ItemDetail> {
  const all = [...requestDetails(), ...sampleRequestDetails(), ...filingDetails(now), ...workOrderDetails()];
  return new Map(all.map((d) => [d.id, d]));
}
