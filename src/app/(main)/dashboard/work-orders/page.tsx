import { Kanban } from "@/app/(main)/dashboard/_components/kanban";
import { ScreenIntro } from "@/app/(main)/dashboard/_components/screen-intro";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { workOrderCards, workOrderColumns } from "@/data/boards";

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <ScreenIntro
        phase={2}
        eyebrow="Project operations · Work orders"
        title="Faults and maintenance, from report to resolution."
        achieves="What the O&M clause of VEH122 (category 4) asks Suryatech to run. Each card opens its station."
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
          <CardDescription>Seven stations, six open or recent items. Drag a card as the work moves.</CardDescription>
        </CardHeader>
        <CardContent>
          <Kanban columns={workOrderColumns} cards={workOrderCards} storageKey="suryatech-board-work-orders" />
        </CardContent>
      </Card>
    </div>
  );
}
