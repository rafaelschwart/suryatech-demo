"use client";

import Image from "next/image";

import { BatteryCharging, Car, Sun, UtilityPole, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { useMediaAvailable } from "@/hooks/use-media-available";
import { cn } from "@/lib/utils";

import type { StationSnapshot } from "./types";

/**
 * The energy path, drawn once by Higgsfield and driven live by the API: each link below the diagram
 * animates only while power is actually moving through it on the selected station.
 */
export function EnergyFlow({ station }: { station: StationSnapshot | null }) {
  const pv = station?.pvKw ?? 0;
  const bat = station?.batteryKw ?? 0;
  const out = station?.outputKw ?? 0;
  const grid = station?.gridKw ?? 0;
  const soc = station?.batterySoc ?? 0;
  const hasLoop = useMediaAvailable("/media/energy-flow-loop.mp4");

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-card text-card-foreground">
      <div className="flex items-center justify-between gap-2 px-4 pt-3">
        <div>
          <p className="font-medium leading-tight">How the unit moves power</p>
          <p className="text-muted-foreground text-xs">
            Sun to battery to charger to car. Grid only when the battery is below reserve.
          </p>
        </div>
        <Badge
          variant="secondary"
          className="rounded-sm bg-amber-500/10 px-1.5 py-0.5 text-amber-700 dark:text-amber-300"
        >
          Illustration
        </Badge>
      </div>
      <div className="relative mx-4 mt-3 aspect-[16/9] overflow-hidden rounded-lg bg-white">
        <Image
          src="/media/energy-flow.webp"
          alt="Isometric diagram: solar canopy feeding a battery cabinet, the cabinet feeding a charger, the charger feeding a car, with a faint grid line as backup"
          fill
          sizes="(min-width: 1280px) 560px, 100vw"
          className="object-cover motion-safe:animate-[drift_18s_ease-in-out_infinite_alternate]"
        />
        {hasLoop ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src="/media/energy-flow-loop.mp4"
            poster="/media/energy-flow.webp"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : null}
      </div>
      <div className="grid grid-cols-[auto_1fr_auto_1fr_auto_1fr_auto] items-center gap-1 px-4 py-4">
        <Node icon={Sun} label="Solar" value={`${pv.toFixed(1)} kW`} active={pv > 0.3} />
        <Link active={pv > 0.3} strength={pv / 12} />
        <Node
          icon={BatteryCharging}
          label="Battery"
          value={`${soc.toFixed(0)}%`}
          sub={bat >= 0 ? `+${bat.toFixed(1)} kW` : `${bat.toFixed(1)} kW`}
          active={Math.abs(bat) > 0.3}
        />
        <Link active={out > 0.3} strength={out / 60} />
        <Node icon={Zap} label="Charger" value={`${out.toFixed(1)} kW`} active={out > 0.3} />
        <Link active={out > 0.3} strength={out / 60} />
        <Node icon={Car} label="Car" value={out > 0.3 ? "Charging" : "Idle"} active={out > 0.3} />
      </div>
      <div className="flex items-center gap-2 border-t px-4 py-2 text-xs">
        <UtilityPole className={cn("size-3.5", grid > 0 ? "text-destructive" : "text-muted-foreground")} />
        <span className={cn(grid > 0 ? "text-destructive" : "text-muted-foreground")}>
          Grid backup {grid > 0 ? `drawing ${grid.toFixed(1)} kW` : "idle"}
        </span>
      </div>
    </div>
  );
}

function Node({
  icon: Icon,
  label,
  value,
  sub,
  active,
}: {
  icon: typeof Sun;
  label: string;
  value: string;
  sub?: string;
  active: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-1 text-center">
      <span
        className={cn(
          "flex size-9 items-center justify-center rounded-full border transition-colors",
          active
            ? "border-amber-400/60 bg-amber-400/15 text-amber-700 dark:text-amber-300"
            : "bg-muted text-muted-foreground",
        )}
      >
        <Icon className="size-4" />
      </span>
      <span className="text-[11px] text-muted-foreground uppercase tracking-wider">{label}</span>
      <span className="font-medium text-sm tabular-nums">{value}</span>
      {sub ? <span className="text-[11px] text-muted-foreground tabular-nums">{sub}</span> : null}
    </div>
  );
}

function Link({ active, strength }: { active: boolean; strength: number }) {
  const speed = Math.max(0.8, 2.6 - Math.min(Math.max(strength, 0), 1) * 1.8);
  return (
    <div className="relative mb-7 h-1.5 overflow-hidden rounded-full bg-muted">
      <div
        className={cn(
          "absolute inset-0 rounded-full bg-[length:60%_100%] bg-[linear-gradient(90deg,transparent_0%,var(--chart-1)_40%,transparent_80%)] transition-opacity duration-500",
          active ? "opacity-100 motion-safe:animate-[flow_var(--speed)_linear_infinite]" : "opacity-0",
        )}
        style={{ "--speed": `${speed}s` } as React.CSSProperties}
      />
    </div>
  );
}
