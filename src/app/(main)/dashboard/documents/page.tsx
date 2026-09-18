import Image from "next/image";
import Link from "next/link";

import { ExternalLink } from "lucide-react";

import { ProvenanceBadge, ScreenIntro } from "@/app/(main)/dashboard/_components/screen-intro";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { sampleDocuments } from "@/data/documents";

const stages = [1, 2, 3, 4, 5, 6, 7] as const;

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <ScreenIntro
        eyebrow="Documents"
        illustration={{ src: "/media/compliance.webp", alt: "A stack of navy document folders", aspect: "16/9" }}
        flow={{ id: "prep", step: "submit" }}
        title="What the desk puts on paper, stage by stage."
        achieves="One sample document per stage, on SuryaTech letterhead."
        provenance={[
          {
            kind: "public",
            text: "Company facts, the MAPC request, its amendments and program rules are public record.",
          },
          {
            kind: "sample",
            text: "Rates, references, staff, sales and signatures are marked SAMPLE inside each document.",
          },
          { kind: "simulated", text: "The power check report comes from the station simulator." },
        ]}
      />
      <div className="flex flex-col gap-4">
        {stages.map((stage) => {
          const docs = sampleDocuments.filter((d) => d.stage === stage);
          if (docs.length === 0) return null;
          const label = docs[0].stageLabel;
          return (
            <Card key={stage}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="secondary" className="rounded-sm px-1.5 py-0.5 font-mono">
                    {stage <= 5 ? `Stage ${stage}` : stage === 6 ? "Compliance" : "Phase 2"}
                  </Badge>
                  {label}
                </CardTitle>
                <CardDescription>
                  Produced on the{" "}
                  <Link href={docs[0].screenUrl} className="underline underline-offset-2">
                    {docs[0].screen}
                  </Link>{" "}
                  screen.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {docs.map((d) => (
                    <div key={d.id} className="flex gap-4 rounded-lg border p-3">
                      <a
                        href={d.file}
                        target="_blank"
                        rel="noreferrer"
                        className="relative block w-24 shrink-0 overflow-hidden rounded-sm border bg-white shadow-sm"
                        aria-label={`Open ${d.title}`}
                      >
                        <Image
                          src={`/documents/thumbs/${d.file.split("/").pop()?.replace(".pdf", ".png")}`}
                          alt=""
                          width={96}
                          height={124}
                          className="h-auto w-full"
                        />
                      </a>
                      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                        <p className="font-medium leading-snug">{d.title}</p>
                        <p className="text-muted-foreground text-xs leading-snug">{d.what}</p>
                        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
                          <ProvenanceBadge kind={d.provenance} />
                          <span className="text-muted-foreground text-xs">
                            {d.pages} {d.pages === 1 ? "page" : "pages"}
                          </span>
                          <Button asChild size="xs" variant="outline" className="ml-auto">
                            <a href={d.file} target="_blank" rel="noreferrer">
                              <ExternalLink data-icon="inline-start" />
                              Open PDF
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
