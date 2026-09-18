import { ScreenIntro } from "@/app/(main)/dashboard/_components/screen-intro";
import { mapcExportPack } from "@/data/mapc-response";

import { ExportPack } from "./_components/export-pack";

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <ScreenIntro
        eyebrow="Export pack"
        illustration={{
          src: "/media/process-flow.webp",
          alt: "A sealed navy box placed into a building slot",
          aspect: "21/9",
        }}
        flow={{ id: "prep", step: "export" }}
        title="The file set the buyer asked for, named the way the buyer names it."
        achieves="The response folder, named the way the RFP names it. Builds locally, never uploads."
        provenance={[
          { kind: "public", text: "File list and order come from the MAPC RFP, Section 7.2 and Appendix D." },
          {
            kind: "simulated",
            text: "The Assemble button builds the folder locally. It does not upload, email or file anything.",
          },
        ]}
      />
      <ExportPack files={mapcExportPack} />
    </div>
  );
}
