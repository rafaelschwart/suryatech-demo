import { BoardViews } from "@/app/(main)/dashboard/_components/board-views";
import { ScreenIntro } from "@/app/(main)/dashboard/_components/screen-intro";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { filingCards, filingColumns, responseCards, responseColumns } from "@/data/boards";

export default function Page() {
  const now = new Date();
  return (
    <div className="flex flex-col gap-4">
      <ScreenIntro
        eyebrow="Package preparation · Response board"
        illustration={{
          src: "/media/process-flow.webp",
          alt: "Five-step process from a public notice to a submitted pack",
          aspect: "21/9",
        }}
        title="Where every request and every filing stands."
        achieves="One board for responses, one for filings. List or board, your pick."
        flow={{ id: "prep" }}
        provenance={[
          {
            kind: "public",
            text: "The nine VEH122 requests and their closing dates come from COMMBUYS. All nine closed with no Suryatech response on the public record.",
          },
          {
            kind: "sample",
            text: "The two in-flight cards show how a request moves across the desk. They are not real Suryatech work.",
          },
        ]}
      />
      <Card>
        <CardHeader>
          <CardTitle>Responses</CardTitle>
          <CardDescription>
            From a posting on COMMBUYS to a submitted pack. Closed cards are the public record.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BoardViews
            itemLabel="Request"
            columns={responseColumns}
            cards={responseCards()}
            storageKey="suryatech-board-responses"
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Filings</CardTitle>
          <CardDescription>
            Recurring obligations: SDP quarterly reports, MBE renewal, MassCEC milestones.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BoardViews
            itemLabel="Filing"
            columns={filingColumns}
            cards={filingCards(now)}
            storageKey="suryatech-board-filings"
          />
        </CardContent>
      </Card>
    </div>
  );
}
