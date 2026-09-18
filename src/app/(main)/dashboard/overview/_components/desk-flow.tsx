import { ExternalLink, FileCheck2, PackageCheck, Radar, ScrollText, Upload } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  {
    icon: ScrollText,
    title: "A buyer posts",
    detail: "A VEH122 request appears on COMMBUYS with a closing date.",
    doc: { label: "Intake sheet", file: "/documents/01-opportunity-intake-sheet.pdf" },
  },
  {
    icon: Radar,
    title: "The watcher sees it",
    detail: "The public search runs daily. The request becomes a row here the same morning.",
    doc: { label: "Morning digest", file: "/documents/02-morning-watch-digest.pdf" },
  },
  {
    icon: FileCheck2,
    title: "The response assembles",
    detail: "Company facts and library parts fill the buyer's format. Red items are the real work.",
    doc: { label: "Cover letter", file: "/documents/03-tab1-cover-letter.pdf" },
  },
  {
    icon: PackageCheck,
    title: "The pack is built",
    detail: "Files named the way the RFP names them, blocked on anything missing.",
    doc: { label: "Pack manifest", file: "/documents/06-submission-pack-manifest.pdf" },
  },
  {
    icon: Upload,
    title: "A person uploads",
    detail: "On COMMBUYS, by Suryatech. The system never touches the state portal.",
    doc: { label: "Submission record", file: "/documents/07-submission-record.pdf" },
  },
];

/** A compact, accessible workflow with a concrete document at every step. */
export function DeskFlow() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>How the desk works</CardTitle>
        <CardDescription>
          From a public posting to a submitted response. Every step is a screen in the sidebar, and each one ends in a
          document you can open.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="relative">
          <svg
            aria-hidden="true"
            className="absolute inset-x-0 top-5 hidden h-px w-full lg:block"
            preserveAspectRatio="none"
            viewBox="0 0 100 2"
          >
            <line
              x1="10"
              y1="1"
              x2="90"
              y2="1"
              stroke="var(--border)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <ol className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <li key={s.title} className="flex flex-col items-start gap-3 bg-card lg:px-2">
                  <div className="relative flex items-center gap-2 bg-card pr-3">
                    <span className="flex size-10 items-center justify-center rounded-lg border bg-muted/40">
                      <Icon className="size-4 text-muted-foreground" />
                    </span>
                    <span className="font-mono text-muted-foreground text-xs">0{i + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{s.title}</p>
                    <p className="mt-1 text-muted-foreground text-xs leading-snug">{s.detail}</p>
                    <a
                      href={s.doc.file}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-primary text-xs underline-offset-2 hover:underline"
                    >
                      <ExternalLink className="size-3" />
                      {s.doc.label}
                    </a>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
