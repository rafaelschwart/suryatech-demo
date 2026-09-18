import { format } from "date-fns";

import { PreparationKpis } from "@/app/(main)/dashboard/_components/preparation-kpis";
import { ScreenIntro } from "@/app/(main)/dashboard/_components/screen-intro";
import { COMPANY } from "@/data/company";
import { daysUntil, sdpReportSchedule } from "@/data/obligations";
import { opportunities } from "@/data/opportunities";
import { buildDeadlineRows } from "@/lib/deadlines";
import { scoreOpportunity } from "@/lib/fit";

import { DeadlineTable } from "./_components/deadline-table";

export default function Page() {
  const now = new Date();
  const sdp = sdpReportSchedule(now);

  const seen = opportunities.length;
  const awarded = opportunities.filter((o) => o.status === "bid-to-po").length;
  const chase = opportunities.filter((o) => scoreOpportunity(o).verdict === "chase").length;
  const contractDaysLeft = daysUntil(COMPANY.contractEnd, now);

  const rows = buildDeadlineRows(now);

  return (
    <div className="flex flex-col gap-4">
      <ScreenIntro
        eyebrow="Deadline board"
        illustration={{ src: "/media/compliance.webp", alt: "A desk calendar with quarter markers", aspect: "16/9" }}
        flow={{ id: "prep", step: "report" }}
        title={`What is due, and what already went by. ${format(now, "EEEE, MMMM d, yyyy")}.`}
        achieves="Every date Suryatech owes, on one board."
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
      <PreparationKpis
        sdpDaysLeft={sdp.current.daysLeft}
        sdpDue={format(sdp.current.due, "MMM d, yyyy")}
        sdpQuarter={sdp.current.label}
        seen={seen}
        awarded={awarded}
        chase={chase}
        contractDaysLeft={contractDaysLeft}
      />
      <DeadlineTable rows={rows} />
    </div>
  );
}
