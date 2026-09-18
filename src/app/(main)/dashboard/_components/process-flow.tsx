"use client";

import Link from "next/link";

import { FLOWS, type FlowId } from "@/data/flows";
import { cn } from "@/lib/utils";

interface ProcessFlowProps {
  flow: FlowId;
  /** The step this screen is on. Omit to highlight none (a board that spans the flow). */
  current?: string;
  /** Live figure printed under a step, keyed by step id. */
  counts?: Partial<Record<string, string>>;
  size?: "compact" | "large";
  className?: string;
}

/**
 * The process as a stepper: navy nodes, the current step in gold, and a gold pulse travelling
 * along the rail so the direction of the flow is visible without reading. Every node is a link.
 */
export function ProcessFlow({ flow, current, counts, size = "compact", className }: ProcessFlowProps) {
  const def = FLOWS[flow];
  const large = size === "large";
  return (
    <nav aria-label={`${def.title} process`} className={cn("overflow-x-auto", className)}>
      <ol
        className="pf grid min-w-[560px]"
        style={{ gridTemplateColumns: `repeat(${def.steps.length}, minmax(0, 1fr))` }}
        data-size={size}
      >
        {def.steps.map((s, i) => {
          const Icon = s.icon;
          const isCurrent = s.id === current;
          const count = counts?.[s.id];
          return (
            <li key={s.id} className="relative flex flex-col items-center px-1 text-center">
              {i < def.steps.length - 1 ? <span aria-hidden="true" className="pf-rail" /> : null}
              <Link
                prefetch={false}
                href={s.href}
                aria-current={isCurrent ? "step" : undefined}
                title={s.hint}
                className={cn("pf-node", isCurrent && "pf-node--current")}
              >
                <Icon className={large ? "size-5" : "size-4"} />
                <span className="pf-num">{String(i + 1).padStart(2, "0")}</span>
              </Link>
              <span
                className={cn(
                  "mt-2 font-medium leading-tight",
                  large ? "text-sm" : "text-xs",
                  isCurrent && "text-primary",
                )}
              >
                {s.label}
              </span>
              {large ? <span className="mt-0.5 text-[11px] text-muted-foreground leading-tight">{s.hint}</span> : null}
              {count ? (
                <span className="mt-1 rounded-sm bg-primary/8 px-1.5 py-0.5 font-medium text-[11px] text-primary tabular-nums">
                  {count}
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
