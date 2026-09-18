import { ScreenIntro } from "@/app/(main)/dashboard/_components/screen-intro";
import { mapcResponse } from "@/data/mapc-response";

import { ResponseAssembler } from "./_components/response-assembler";

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <ScreenIntro
        eyebrow="Response assembler"
        illustration={{
          src: "/media/process-flow.webp",
          alt: "Seven folder tabs assembled into one binder",
          aspect: "21/9",
        }}
        flow={{ id: "prep", step: "assemble" }}
        title="The buyer's required format, filled from what Suryatech already has."
        achieves="The buyer's format, filled from the library. Red items are the real work."
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
