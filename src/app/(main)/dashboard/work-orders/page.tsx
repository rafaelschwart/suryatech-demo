import { BoardViews } from "@/app/(main)/dashboard/_components/board-views";
import { ScreenIntro } from "@/app/(main)/dashboard/_components/screen-intro";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { workOrderCards, workOrderColumns } from "@/data/boards";

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <ScreenIntro
        phase={2}
        eyebrow="Project operations · Work orders"
        illustration={{
          src: "/media/site-municipal-v2.webp",
          alt: "A hybrid charger in a municipal lot",
          aspect: "16/9",
        }}
        title="Faults and maintenance, from report to resolution."
        achieves="Maintenance under VEH122 category 4. Cards open their station."
        flow={{ id: "ops", step: "maintain" }}
        provenance={[
          {
            kind: "simulated",
            text: "Every work order is generated for the demo. The two Reported cards mirror the faults the station simulator raises on Blue Hills.",
          },
        ]}
      />
      <Card>
        <CardHeader>
          <CardTitle>Maintenance queue</CardTitle>
          <CardDescription>Drag a card as the work moves.</CardDescription>
        </CardHeader>
        <CardContent>
          <BoardViews
            itemLabel="Work order"
            columns={workOrderColumns}
            cards={workOrderCards}
            storageKey="suryatech-board-work-orders"
          />
        </CardContent>
      </Card>
    </div>
  );
}
