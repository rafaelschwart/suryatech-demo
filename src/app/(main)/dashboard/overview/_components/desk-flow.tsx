import { ExternalLink, FileCheck2, PackageCheck, Radar, ScrollText, Upload } from "lucide-react";

import { OptionalIllustration } from "@/app/(main)/dashboard/_components/optional-illustration";
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

/** The desk in one strip: five isometric platforms on one gold path, drawn in the interface itself. */
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
        <OptionalIllustration
          src="/media/process-flow.webp"
          alt="Isometric diagram of the five steps: a posting, a radar, seven tabs assembled, a sealed pack, a hand placing it into a public building"
          caption="The five steps as one path"
          aspect="21/9"
        />
        <div className="relative">
          <svg
            aria-hidden="true"
            className="absolute inset-x-0 top-9 hidden h-2 w-full lg:block"
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
            <line
              x1="10"
              y1="1"
              x2="90"
              y2="1"
              stroke="var(--chart-1)"
              strokeWidth="2"
              strokeDasharray="6 10"
              vectorEffect="non-scaling-stroke"
              className="motion-safe:animate-[dash_1.6s_linear_infinite]"
            />
          </svg>
          <ol className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <li key={s.title} className="flex flex-col items-center gap-3 text-center">
                  <div className="relative">
                    <div
                      aria-hidden="true"
                      className="absolute -bottom-2 left-1/2 h-4 w-16 -translate-x-1/2 rounded-[50%] bg-primary/25 blur-[2px]"
                    />
                    <div className="relative flex size-20 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md [transform:rotateX(18deg)_rotateZ(-6deg)] motion-safe:transition-transform motion-safe:duration-300 hover:[transform:rotateX(0deg)_rotateZ(0deg)_translateY(-4px)]">
                      <Icon className="size-8" />
                      <span className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-[var(--chart-1)] font-medium text-[11px] text-[var(--primary)] shadow">
                        {i + 1}
                      </span>
                    </div>
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
