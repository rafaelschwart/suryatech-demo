import type { BoardCard, BoardColumn } from "@/app/(main)/dashboard/_components/kanban";

import { mapcExportPack, mapcResponse } from "./mapc-response";
import { buildObligations, daysUntil } from "./obligations";
import { opportunities } from "./opportunities";

/**
 * Board data. Real VEH122 requests sit where the public record puts them (all closed, none with a
 * Suryatech response on record). The in-flight cards are samples that show how a request moves
 * across the desk; they are labelled Sample on the card.
 */

export const responseColumns: BoardColumn[] = [
  { id: "watching", title: "Watching", hint: "New on COMMBUYS, not yet triaged", tone: "navy" },
  { id: "triage", title: "Triage", hint: "Chase, consider or pass", tone: "sky" },
  { id: "assembling", title: "Assembling", hint: "Filling the buyer's format", tone: "gold" },
  { id: "ready", title: "Ready to submit", hint: "Pack built, nothing blocked", tone: "emerald" },
  { id: "submitted", title: "Submitted", hint: "Uploaded to COMMBUYS by a person", tone: "amber" },
  { id: "closed", title: "Closed", hint: "Deadline passed", tone: "muted" },
];

export function responseCards(): BoardCard[] {
  const fields = mapcResponse.flatMap((t) => t.fields);
  const ready = fields.filter((f) => f.state === "ready").length;
  const real: BoardCard[] = opportunities.map((o) => ({
    id: o.bidNumber,
    column: "closed",
    title: o.buyer,
    subtitle: o.title,
    meta: `closed ${o.closes}`,
    badge: o.status === "bid-to-po" ? "Awarded to others" : "No response on record",
    badgeTone: o.status === "bid-to-po" ? "critical" : "warning",
    provenance: "public",
    href: "/dashboard/opportunities",
  }));
  const samples: BoardCard[] = [
    {
      id: "sample-dcr-new",
      column: "watching",
      title: "Department of Conservation and Recreation",
      subtitle: "VEH122 DCR fleet EV charging station, simulated posting",
      meta: "closes 2026-10-30",
      badge: "New this morning",
      badgeTone: "ok",
      provenance: "sample",
      href: "/dashboard/opportunities",
    },
    {
      id: "sample-mapc-example",
      column: "assembling",
      title: "MAPC, worked example",
      subtitle: "Non-grid-tied charging, 6 municipal sites (BD-26-1217)",
      meta: `${ready} of ${fields.length} fields ready`,
      badge: `${mapcExportPack.filter((f) => f.state === "blocked").length} files blocked`,
      badgeTone: "warning",
      provenance: "sample",
      href: "/dashboard/assembler",
    },
  ];
  return [...samples, ...real];
}

export const filingColumns: BoardColumn[] = [
  { id: "upcoming", title: "Upcoming", hint: "Dated, not started", tone: "navy" },
  { id: "preparing", title: "In preparation", hint: "Evidence being gathered", tone: "gold" },
  { id: "confirm", title: "Confirm filed", hint: "Past due date, filing unknown", tone: "amber" },
  { id: "filed", title: "Filed", hint: "On record", tone: "emerald" },
];

export function filingCards(now: Date): BoardCard[] {
  return buildObligations(now)
    .filter((o) => o.id !== "veh122")
    .map((o) => {
      const days = o.nextDate ? daysUntil(o.nextDate, now) : null;
      let column = "upcoming";
      if (o.status === "confirm") column = "confirm";
      else if (o.status === "on-file") column = "filed";
      else if (o.status === "unknown") column = "preparing";
      return {
        id: o.id,
        column,
        title: o.name,
        subtitle: o.cadence,
        meta: o.nextDate ? `due ${o.nextDate}` : "date to confirm",
        badge: days !== null ? (days >= 0 ? `${days} days` : "past due") : undefined,
        badgeTone: days !== null ? (days <= 14 ? "critical" : days <= 45 ? "warning" : "ok") : "neutral",
        provenance: o.provenance,
        href: "/dashboard/evidence",
      } satisfies BoardCard;
    });
}

export const workOrderColumns: BoardColumn[] = [
  { id: "reported", title: "Reported", hint: "Raised by the station or a power check", tone: "red" },
  { id: "scheduled", title: "Scheduled", hint: "Site visit or remote fix booked", tone: "amber" },
  { id: "onsite", title: "On site", hint: "Technician working", tone: "gold" },
  { id: "resolved", title: "Resolved", hint: "Closed with a record", tone: "emerald" },
];

/** Simulated maintenance queue. The first two mirror the open faults the simulator reports. */
export const workOrderCards: BoardCard[] = [
  {
    id: "wo-blue-hills-ground",
    column: "reported",
    title: "Blue Hills Reservation · connector 1 GroundFailure",
    subtitle: "Reported 02:14 by StatusNotification. CCS1 out until inspected.",
    meta: "ST-SAMPLE-03",
    badge: "Fault",
    badgeTone: "critical",
    provenance: "simulated",
    href: "/dashboard/stations?station=ST-SAMPLE-03",
  },
  {
    id: "wo-blue-hills-soc",
    column: "reported",
    title: "Blue Hills Reservation · battery below 25% reserve",
    subtitle: "Three overcast days and a faulted DC connector; check PV string and BMS log.",
    meta: "ST-SAMPLE-03",
    badge: "Warning",
    badgeTone: "warning",
    provenance: "simulated",
    href: "/dashboard/stations?station=ST-SAMPLE-03",
  },
  {
    id: "wo-blue-hills-firmware",
    column: "scheduled",
    title: "Blue Hills Reservation · firmware 3.9.7 to 4.0.2",
    subtitle: "Remote update window booked for the next low-sun morning.",
    meta: "ST-SAMPLE-03 · 2026-09-19",
    provenance: "simulated",
    href: "/dashboard/stations?station=ST-SAMPLE-03",
  },
  {
    id: "wo-somerville-panel",
    column: "onsite",
    title: "Assembly Row · service panel swap",
    subtitle: "Station set Inoperative for the day. Return to service after the power check.",
    meta: "ST-SAMPLE-06 · today",
    badge: "Out of service",
    badgeTone: "warning",
    provenance: "simulated",
    href: "/dashboard/stations?station=ST-SAMPLE-06",
  },
  {
    id: "wo-lynn-cable",
    column: "scheduled",
    title: "Lynn Shore · J1772 cable strain relief",
    subtitle: "Wear reported by a driver. Replace on the next coastal route visit.",
    meta: "ST-SAMPLE-07 · 2026-09-23",
    provenance: "simulated",
    href: "/dashboard/stations?station=ST-SAMPLE-07",
  },
  {
    id: "wo-lowell-quarterly",
    column: "resolved",
    title: "Lowell · quarterly inspection",
    subtitle: "Panel clean, torque check, diagnostics pulled. Report attached to the O&M record.",
    meta: "ST-LOWELL-01 · 2026-09-12",
    badge: "Closed",
    badgeTone: "ok",
    provenance: "simulated",
    href: "/dashboard/stations?station=ST-LOWELL-01",
  },
  {
    id: "wo-alewife-reset",
    column: "resolved",
    title: "Alewife · soft reset after heartbeat gap",
    subtitle: "Remote reset accepted, reconnected in 14 s. No site visit needed.",
    meta: "ST-SAMPLE-04 · 2026-09-15",
    badge: "Closed",
    badgeTone: "ok",
    provenance: "simulated",
    href: "/dashboard/stations?station=ST-SAMPLE-04",
  },
];
