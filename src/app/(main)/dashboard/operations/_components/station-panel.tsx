"use client";

import Image from "next/image";
import Link from "next/link";

import { ArrowUpRight, BatteryCharging, Box, Sun, UtilityPole, Zap } from "lucide-react";

import { kwh, siteTypeLabel, stationStatus, usd } from "@/app/(main)/dashboard/_components/operations/station-status";
import { ProvenanceBadge } from "@/app/(main)/dashboard/_components/screen-intro";
import type { StationSnapshot } from "@/app/(main)/dashboard/stations/_components/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const covers: Record<StationSnapshot["siteType"], string> = {
  commercial: "/media/site-commercial-v2.webp",
  municipal: "/media/site-municipal-v2.webp",
  "state-park": "/media/site-park-v2.webp",
  transit: "/media/site-municipal-v2.webp",
  "park-and-ride": "/media/site-commercial-v2.webp",
};

/**
 * The station picked on the map, at a glance. The 3D unit, the consumption curve and the controls
 * live one click further, on the station page.
 */
export function StationPanel({ station }: { station: StationSnapshot | null }) {
  if (!station) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Station</CardTitle>
          <CardDescription>Pick a marker or a row.</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    );
  }

  const st = stationStatus(station);
  const charging = station.connectors.filter((c) => c.status === "Charging").length;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <CardTitle className="truncate">{station.name}</CardTitle>
            <CardDescription>
              {station.town} · {siteTypeLabel[station.siteType]} · {station.buyerHint}
            </CardDescription>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <ProvenanceBadge kind={station.provenance} />
            <Badge variant="secondary" className={cn("rounded-sm px-1.5 py-0.5 font-medium", st.badgeClass)}>
              {st.label}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="relative aspect-[16/6] overflow-hidden rounded-lg border bg-muted">
          <Image
            src={covers[station.siteType]}
            alt="Illustrative charging-site setting; not a photograph of this station"
            fill
            sizes="(min-width: 1280px) 520px, 100vw"
            className="object-cover"
          />
          <span className="absolute right-2 bottom-2 rounded-sm bg-slate-950/75 px-2 py-1 text-[10px] text-white">
            Illustrative site · Higgsfield render
          </span>
        </div>
        <Button size="lg" asChild className="w-full">
          <Link prefetch={false} href={`/dashboard/stations?station=${station.id}`}>
            <Box data-icon="inline-start" />
            Open station: 3D unit, consumption, controls
            <ArrowUpRight data-icon="inline-end" />
          </Link>
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <Reading icon={Zap} label="Output" value={`${station.outputKw.toFixed(1)} kW`} sub={`${charging} charging`} />
          <Reading
            icon={Sun}
            label="Solar"
            value={`${station.pvKw.toFixed(1)} kW`}
            sub={`of ${station.pvCapacityKw} kW`}
          />
          <Reading
            icon={BatteryCharging}
            label="Battery"
            value={`${station.batterySoc.toFixed(0)}%`}
            sub={`${station.batteryKw >= 0 ? "charging" : "discharging"} ${Math.abs(station.batteryKw).toFixed(1)} kW`}
          >
            <Progress value={station.batterySoc} className="mt-2 h-1.5" />
          </Reading>
          <Reading
            icon={UtilityPole}
            label="Grid import"
            value={`${station.gridKw.toFixed(1)} kW`}
            sub={station.gridKw > 0 ? "battery below reserve" : "self-sufficient"}
          />
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-1 rounded-lg border px-3 py-2 text-sm sm:grid-cols-4">
          <Fact label="Cars today" value={String(station.sessionsToday)} />
          <Fact label="Energy today" value={kwh(station.energyTodayKwh)} />
          <Fact label="Revenue today" value={usd(station.revenueTodayUsd, true)} />
          <Fact label="Revenue 30d" value={usd(station.revenue30dUsd)} />
        </dl>

        {station.faults.length ? (
          <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm">
            <p className="mb-1 font-medium text-destructive text-xs uppercase tracking-wider">Open faults</p>
            <ul className="list-disc space-y-0.5 pl-4 text-xs">
              {station.faults.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <Button variant="link" size="sm" asChild className="h-auto px-0 pt-1 text-xs">
              <Link prefetch={false} href="/dashboard/work-orders">
                See the work orders
              </Link>
            </Button>
          </div>
        ) : null}

        <p className="text-muted-foreground text-xs">{station.site}</p>
      </CardContent>
    </Card>
  );
}

function Reading({
  icon: Icon,
  label,
  value,
  sub,
  children,
}: {
  icon: typeof Zap;
  label: string;
  value: string;
  sub: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border px-3 py-2">
      <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
        <Icon className="size-3.5" />
        {label}
      </div>
      <div className="mt-1 font-medium text-xl tabular-nums leading-none">{value}</div>
      <p className="mt-1 text-muted-foreground text-xs">{sub}</p>
      {children}
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] text-muted-foreground">{label}</dt>
      <dd className="font-medium tabular-nums">{value}</dd>
    </div>
  );
}
