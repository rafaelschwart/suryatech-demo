import { ScreenIntro } from "@/app/(main)/dashboard/_components/screen-intro";
import { mapcResponse } from "@/data/mapc-response";

import { ResponseAssembler } from "./_components/response-assembler";

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <ScreenIntro
        eyebrow="Response assembler"
        title="The buyer's required format, filled from what Suryatech already has."
        achieves="A VEH122 request is answered in the buyer's structure, not in prose. This screen takes that structure, here MAPC's seven tabs, and fills every field it can from the company record and the answer library, marks what still needs a person, and counts what is missing per tab. Company facts fill automatically, past scope text and rates pull from the library, and the red items are the only real work left. It does not write scope, set a price or invent a reference. A person reviews and a person sends."
        provenance={[
          {
            kind: "public",
            text: "Tab structure, page limits, form list and the per-site price rule come from the MAPC RFP as posted. Company facts come from COMMBUYS and the Lowell filing.",
          },
          {
            kind: "sample",
            text: "Form templates, scope blocks and the Lowell reference stand in for Suryatech files we have not seen.",
          },
        ]}
      />
      <ResponseAssembler tabs={mapcResponse} />
    </div>
  );
}
