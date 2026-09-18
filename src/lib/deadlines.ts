import type { DeadlineRow } from "@/app/(main)/dashboard/deadlines/_components/deadline-table";
import { buildObligations, daysUntil } from "@/data/obligations";
import { opportunities } from "@/data/opportunities";

/**
 * Every dated item Suryatech owes or missed, as one list: recurring obligations with a next date,
 * every VEH122 request that posted, and obligations whose date is unknown until Discovery.
 * Shared by the deadline board and the overview.
 */
export function buildDeadlineRows(now: Date): DeadlineRow[] {
  const obligations = buildObligations(now);
  return [
    ...obligations
      .filter((o) => o.nextDate && o.id !== "veh122")
      .map((o) => ({
        id: o.id,
        due: o.nextDate as string,
        item: o.name,
        owner: o.owner,
        status: o.status === "due" ? ("due" as const) : ("confirm" as const),
        daysLeft: daysUntil(o.nextDate as string, now),
        source: o.source,
      })),
    ...opportunities.map((o) => ({
      id: o.bidNumber,
      due: o.closes,
      item: `${o.buyer}: ${o.title}`,
      owner: null,
      status: o.status === "bid-to-po" ? ("awarded" as const) : ("closed" as const),
      daysLeft: daysUntil(o.closes, now),
      source: `${o.bidNumber}${o.amendments ? ` · ${o.amendments} amendments` : ""}`,
    })),
    ...obligations
      .filter((o) => !o.nextDate)
      .map((o) => ({
        id: o.id,
        due: null,
        item: o.name,
        owner: o.owner,
        status: "unknown" as const,
        daysLeft: null,
        source: o.source,
      })),
  ].sort((a, b) => {
    if (a.due === null) return 1;
    if (b.due === null) return -1;
    return b.due.localeCompare(a.due);
  });
}

/** The rows still ahead of today, soonest first. */
export function upcomingDeadlines(rows: DeadlineRow[], limit: number): DeadlineRow[] {
  return rows
    .filter((r) => r.daysLeft !== null && r.daysLeft >= 0)
    .sort((a, b) => (a.daysLeft ?? 0) - (b.daysLeft ?? 0))
    .slice(0, limit);
}
