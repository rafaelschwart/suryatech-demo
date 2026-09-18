import { ScreenIntro } from "@/app/(main)/dashboard/_components/screen-intro";
import { mapcExportPack } from "@/data/mapc-response";

import { ExportPack } from "./_components/export-pack";

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <ScreenIntro
        eyebrow="Export pack"
        title="The file set the buyer asked for, named the way the buyer names it."
        achieves="A response is rejected on paperwork before it is judged on merit: MAPC's Tab 2 rejects the entire proposal on one non-affirmative answer, and thirteen forms have to be signed in a specific order. This screen checks the assembled response against the buyer's own list, builds the folder with the buyer's file names, and stops on anything blocked. A person on Suryatech's side uploads it to COMMBUYS. The system never touches the state portal."
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
