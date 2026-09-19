"use client";

import { Activity, Car, CircleDollarSign, type LucideIcon, RadioTower, Sun, Zap } from "lucide-react";

import { AnimatedNumber } from "@/app/(main)/dashboard/_components/motion";
import type { StationSnapshot } from "@/app/(main)/dashboard/stations/_components/types";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { usd } from "./station-status";

/** The five numbers an operator looks at first, computed from the same fleet read the map uses. */
export function FleetKpis({ stations, className }: { stations: StationSnapshot[] | null; className?: string }) {
  const fleet = stations ?? [];
  const output = fleet.reduce((n, s) => n + s.outputKw, 0);
  const pv = fleet.reduce((n, s) => n + s.pvKw, 0);
  const sessions = fleet.reduce((n, s) => n + s.sessionsToday, 0);
  const revenue = fleet.reduce((n, s) => n + s.revenueTodayUsd, 0);
  const faults = fleet.reduce((n, s) => n + s.faults.length, 0);
  const online = fleet.filter((s) => s.online).length;

  return (
    <div className={cn("grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6", className)}>
      <Kpi icon={Zap} label="EV output now" value={`${output.toFixed(1)} kW`} loading={!stations} />
      <Kpi icon={Sun} label="Solar now" value={`${pv.toFixed(1)} kW`} loading={!stations} />
      <Kpi icon={Car} label="Cars charged today" value={String(sessions)} loading={!stations} />
      <Kpi icon={CircleDollarSign} label="Revenue today" value={usd(revenue)} loading={!stations} />
      <Kpi
        icon={Activity}
        label="Stations online"
        value={`${online} / ${fleet.length}`}
        tone={online === fleet.length ? "ok" : "warning"}
        loading={!stations}
      />
      <Kpi
        icon={RadioTower}
        label="Open faults"
        value={String(faults)}
        tone={faults ? "critical" : "ok"}
        loading={!stations}
      />
    </div>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  tone = "neutral",
  loading,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone?: "neutral" | "ok" | "warning" | "critical";
  loading: boolean;
}) {
  return (
    <div className="rounded-xl border bg-card px-4 py-3 text-card-foreground">
      <div className="flex items-center gap-2 text-muted-foreground text-xs">
        <Icon className="size-3.5" />
        {label}
      </div>
      {loading ? (
        <Skeleton className="mt-2 h-7 w-20" />
      ) : (
        <div
          className={cn(
            "mt-1 font-medium text-2xl tabular-nums tracking-tight",
            tone === "ok" && "text-emerald-700 dark:text-emerald-300",
            tone === "warning" && "text-amber-700 dark:text-amber-300",
            tone === "critical" && "text-destructive",
          )}
        >
          <AnimatedNumber value={value} />
        </div>
      )}
    </div>
  );
}
