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
        title="Every VEH122 request, the day it posts, with a verdict."
        achieves="A scheduled job runs the COMMBUYS public bid search on several keyword variants and the EV charging commodity code, records every new request as a row, and re-reads open bids daily for amendments. Each row then gets a triage verdict, Chase, Consider or Pass, with the reasons printed next to it, so Mayur decides in a minute which of the requests are worth a response. Nine went by in the first seven months of the contract. This screen is why the tenth does not."
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
