import { format } from "date-fns";

import { ScreenIntro } from "@/app/(main)/dashboard/_components/screen-intro";
import { buildObligations, sdpReportSchedule } from "@/data/obligations";

import { EvidenceTable } from "./_components/evidence-table";
import { SdpCalculator } from "./_components/sdp-calculator";

export default function Page() {
  const now = new Date();
  const obligations = buildObligations(now);
  const sdp = sdpReportSchedule(now);

  return (
    <div className="flex flex-col gap-4">
      <ScreenIntro
        eyebrow="Evidence register"
        title="The obligations that outlast any single request, with their documents."
        achieves="Winning a VEH122 purchase order creates paperwork that recurs for years: an SDP spending report every quarter within 45 days of quarter end, MBE renewal every three years or the company drops off the state directory, MassCEC milestone reports paid against deliverables. This register holds one row per obligation, the document that proves it and the date it is next due, so reporting becomes retrieval instead of reconstruction. It reports what it is given. It does not assert that Suryatech is compliant."
        provenance={[
          {
            kind: "public",
            text: "Rules and cadences come from the SDP spending report form, mass.gov SDO guidance and the InnovateMass RFP. The SDP due date is computed from today.",
          },
          {
            kind: "sample",
            text: "Certification dates, milestone schedules and documents on file are unknown until Discovery.",
          },
        ]}
      />
      <div className="flex flex-col gap-4">
        <SdpCalculator
          currentLabel={sdp.current.label}
          currentDue={format(sdp.current.due, "MMMM d, yyyy")}
          currentDays={sdp.current.daysLeft}
          previousLabel={sdp.previous.label}
          previousDue={format(sdp.previous.due, "MMMM d, yyyy")}
          previousDaysAgo={sdp.previous.daysAgo}
        />
        <EvidenceTable obligations={obligations} />
      </div>
    </div>
  );
}
