"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { FLOWS, type FlowId } from "@/data/flows";
import { cn } from "@/lib/utils";
import styles from "./process-flow.module.css";

interface ProcessFlowProps {
  flow: FlowId;
  current?: string;
  counts?: Partial<Record<string, string>>;
  size?: "compact" | "large";
  className?: string;
}

export function ProcessFlow({ flow, current, counts, size = "compact", className }: ProcessFlowProps) {
  const def = FLOWS[flow];
  const large = size === "large";
  return (
    <nav aria-label={`${def.title} process`} className={cn(styles.flow, className)}>
      <ol
        className={cn("pf", styles.list)}
        style={{ "--flow-count": def.steps.length } as CSSProperties}
        data-size={size}
      >
        {def.steps.map((step, index) => {
          const Icon = step.icon;
          const isCurrent = step.id === current;
          return (
            <li key={step.id} className={styles.step}>
              {index < def.steps.length - 1 && <span aria-hidden="true" className={cn("pf-rail", styles.rail)} />}
              <Link
                prefetch={false}
                href={step.href}
                onClick={(event) => {
                  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                  const destination = new URL(step.href, window.location.origin);
                  const station = new URLSearchParams(window.location.search).get("station");
                  if (
                    station &&
                    window.location.pathname === "/dashboard/operations" &&
                    destination.pathname === "/dashboard/operations"
                  ) {
                    event.preventDefault();
                    destination.searchParams.set("station", station);
                    window.history.pushState(null, "", destination.pathname + destination.search + destination.hash);
                    if (destination.hash)
                      document
                        .getElementById(destination.hash.slice(1))
                        ?.scrollIntoView({ block: "start", behavior: "instant" });
                  }
                }}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`${step.label}: ${step.hint}`}
                title={step.hint}
                className={cn("pf-node", isCurrent && "pf-node--current")}
              >
                <Icon className={large ? "size-5" : "size-4"} />
                <span className="pf-num" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </Link>
              <div className={styles.copy}>
                <span className={cn(styles.label, isCurrent && "text-primary")}>{step.label}</span>
                {large && <span className={styles.hint}>{step.hint}</span>}
                {counts?.[step.id] && <span className={cn(styles.count, "tabular-nums")}>{counts[step.id]}</span>}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
