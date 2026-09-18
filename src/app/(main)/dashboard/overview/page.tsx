import { format } from "date-fns";

import { ScreenIntro } from "@/app/(main)/dashboard/_components/screen-intro";
import { COMPANY } from "@/data/company";
import { buildObligations, daysUntil, sdpReportSchedule } from "@/data/obligations";
import { opportunities } from "@/data/opportunities";
import { scoreOpportunity } from "@/lib/fit";

import { type DeadlineRow, DeadlineTable } from "./_components/deadline-table";
import { DeskFlow } from "./_components/desk-flow";
import { OverviewKpis } from "./_components/overview-kpis";

export default function Page() {
  const now = new Date();
  const sdp = sdpReportSchedule(now);
  const obligations = buildObligations(now);

  const seen = opportunities.length;
  const awarded = opportunities.filter((o) => o.status === "bid-to-po").length;
  const chase = opportunities.filter((o) => scoreOpportunity(o).verdict === "chase").length;
  const contractDaysLeft = daysUntil(COMPANY.contractEnd, now);

  const rows: DeadlineRow[] = [
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

  return (
    <div className="flex flex-col gap-4">
      <ScreenIntro
        eyebrow="Deadline board"
        title={`What is due, and what already went by. ${format(now, "EEEE, MMMM d, yyyy")}.`}
        achieves="One place that puts a date on everything Suryatech owes: the next VEH122 request closing, the next SDP spending report, the MBE renewal, the MassCEC milestones. Being on the state contract does not bring orders, it brings requests with deadlines. This board exists so the next one is visible the day it posts, beside the filing already owed."
        provenance={[
          {
            kind: "public",
            text: "Requests, closing dates, amendment counts and program rules are read from COMMBUYS and mass.gov.",
          },
          {
            kind: "sample",
            text: "Certification dates, milestone schedules and whether last quarter was filed are unknown until Discovery.",
          },
        ]}
      />
      <OverviewKpis
        sdpDaysLeft={sdp.current.daysLeft}
        sdpDue={format(sdp.current.due, "MMM d, yyyy")}
        sdpQuarter={sdp.current.label}
        seen={seen}
        awarded={awarded}
        chase={chase}
        contractDaysLeft={contractDaysLeft}
      />
      <DeskFlow />
      <DeadlineTable rows={rows} />
    </div>
  );
}
