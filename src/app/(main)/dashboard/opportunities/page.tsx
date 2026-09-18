import { ScreenIntro } from "@/app/(main)/dashboard/_components/screen-intro";
import { mapcAmendments, opportunities } from "@/data/opportunities";
import { API_IN_BROWSER } from "@/lib/desk-api/flags";
import { scoreOpportunity } from "@/lib/fit";

import { AmendmentFeed } from "./_components/amendment-feed";
import { OpportunitiesTable, type OpportunityRow } from "./_components/opportunities-table";
import { WatcherStatus } from "./_components/watcher-status";

export default function Page() {
  const rows: OpportunityRow[] = opportunities
    .map((o) => ({ opportunity: o, fit: scoreOpportunity(o) }))
    .sort((a, b) => b.fit.score - a.fit.score);

  return (
    <div className="flex flex-col gap-4">
      <ScreenIntro
        eyebrow="Opportunities"
        illustration={{ src: "/media/watcher.webp", alt: "A radar sweeping a public notice board", aspect: "16/9" }}
        flow={{ id: "prep", step: "watch" }}
        title="Every request, with a verdict."
        achieves="The day it posts: Chase, Consider or Pass."
        provenance={[
          {
            kind: "public",
            text: "All nine requests, their dates, ceilings and amendment history come from COMMBUYS. No account was used.",
          },
          {
            kind: "simulated",
            text: API_IN_BROWSER
              ? "The Run search button replays the last verified result from a copy held in this browser tab; the scheduled job that queries COMMBUYS runs on a server in a deployment. The Simulate switch adds one invented posting to show the alert flow."
              : "The Run search button replays the last verified result. The Simulate switch adds one invented posting to show the alert flow.",
          },
        ]}
      />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <WatcherStatus />
        </div>
        <div className="xl:col-span-4">
          <AmendmentFeed events={mapcAmendments} />
        </div>
      </div>
      <OpportunitiesTable rows={rows} />
    </div>
  );
}
