import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import type { Provenance } from "@/data/company";
import { cn } from "@/lib/utils";

const provenanceStyles: Record<Provenance, string> = {
  public: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  sample: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  simulated: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  illustration: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
};

const provenanceLabels: Record<Provenance, string> = {
  public: "Public record",
  sample: "Sample",
  simulated: "Simulated",
  illustration: "Illustration",
};

export function ProvenanceBadge({ kind, className }: { kind: Provenance; className?: string }) {
  return (
    <Badge
      variant="secondary"
      className={cn("rounded-sm px-1.5 py-0.5 font-medium", provenanceStyles[kind], className)}
    >
      {provenanceLabels[kind]}
    </Badge>
  );
}

interface ScreenIntroProps {
  eyebrow: string;
  title: string;
  achieves: ReactNode;
  provenance: { kind: Provenance; text: string }[];
  actions?: ReactNode;
  phase?: 1 | 2;
}

/**
 * Every screen opens with this: what the section achieves for Suryatech in one paragraph,
 * and where the data on the screen comes from, so a viewer never mistakes a sample for a fact.
 */
export function ScreenIntro({ eyebrow, title, achieves, provenance, actions, phase = 1 }: ScreenIntroProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">{eyebrow}</span>
            <Badge variant="outline" className="h-auto rounded-sm px-1.5 py-0 text-[10px] uppercase tracking-wider">
              Phase {phase}
            </Badge>
          </div>
          <h1 className="font-medium text-2xl leading-tight tracking-tight sm:text-3xl sm:leading-none">{title}</h1>
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
      <div className="rounded-lg border border-l-4 border-l-primary bg-card px-4 py-3 text-card-foreground">
        <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">What this section achieves</p>
        <p className="mt-1 max-w-4xl text-sm leading-relaxed">{achieves}</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
          {provenance.map((p) => (
            <span key={`${p.kind}-${p.text}`} className="flex items-center gap-2 text-muted-foreground text-xs">
              <ProvenanceBadge kind={p.kind} />
              <span>{p.text}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
