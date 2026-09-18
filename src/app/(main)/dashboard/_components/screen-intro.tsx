import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Provenance } from "@/data/company";
import type { FlowId } from "@/data/flows";
import { cn } from "@/lib/utils";

import { ProcessFlow } from "./process-flow";

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
  /** One sentence. The rest of the screen explains itself. */
  achieves: ReactNode;
  provenance: { kind: Provenance; text: string }[];
  actions?: ReactNode;
  phase?: 1 | 2;
  /** Which process this screen belongs to and where on it. */
  flow?: { id: FlowId; step?: string };
}

/**
 * Every screen opens with this: title, one sentence, the data sources as labels (full text on
 * hover), and the process flow with this screen's step lit.
 */
export function ScreenIntro({ eyebrow, title, achieves, provenance, actions, phase = 1, flow }: ScreenIntroProps) {
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
          <h1 className="font-medium text-2xl leading-tight tracking-tight">{title}</h1>
          <p className="max-w-3xl text-muted-foreground text-sm">{achieves}</p>
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground text-xs">Data:</span>
        {provenance.map((p) => (
          <Tooltip key={`${p.kind}-${p.text}`}>
            <TooltipTrigger asChild>
              <span className="cursor-help">
                <ProvenanceBadge kind={p.kind} />
              </span>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-xs leading-relaxed">{p.text}</TooltipContent>
          </Tooltip>
        ))}
        <span className="text-[11px] text-muted-foreground">hover for the source</span>
      </div>
      {flow ? (
        <div className="rounded-xl border bg-card px-3 py-3">
          <ProcessFlow flow={flow.id} current={flow.step} />
        </div>
      ) : null}
    </div>
  );
}
