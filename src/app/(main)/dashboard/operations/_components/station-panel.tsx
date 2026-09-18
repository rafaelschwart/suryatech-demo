"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { Activity, ArrowUpRight, BatteryCharging, Sun, UtilityPole, Zap } from "lucide-react";
import { toast } from "sonner";

import { kwh, siteTypeLabel, stationStatus, usd } from "@/app/(main)/dashboard/_components/operations/station-status";
import { ProvenanceBadge } from "@/app/(main)/dashboard/_components/screen-intro";
import { StationChart } from "@/app/(main)/dashboard/stations/_components/station-chart";
import type {
  CommandResponse,
  PowerCheckReport,
  StationSnapshot,
  TelemetryPoint,
} from "@/app/(main)/dashboard/stations/_components/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { deskFetch } from "@/lib/desk-api/client";
import { cn } from "@/lib/utils";

interface StationPanelProps {
  station: StationSnapshot | null;
  onSnapshot: (snapshot: StationSnapshot) => void;
}

/**
 * Everything the operator wants to know about the station picked on the map: status, live
 * readings, what it did today and over the last month, connectors, faults, the 90-minute curve,
 * and a power check that goes through the same API call the Power and performance screen uses.
 */
export function StationPanel({ station, onSnapshot }: StationPanelProps) {
  const [points, setPoints] = useState<TelemetryPoint[]>([]);
  const [busy, setBusy] = useState(false);
  const [report, setReport] = useState<PowerCheckReport | null>(null);
  const id = station?.id ?? null;

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setPoints([]);
    setReport(null);
    const load = async () => {
      const res = await deskFetch(`/api/stations/${id}/telemetry?minutes=90`, { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { points: TelemetryPoint[] };
      if (!cancelled) setPoints(data.points);
    };
    void load();
    const t = window.setInterval(() => void load(), 12_000);
    return () => {
      cancelled = true;
      window.clearInterval(t);
    };
  }, [id]);

  async function powerCheck() {
    if (!station) return;
    setBusy(true);
    try {
      const res = await deskFetch(`/api/stations/${station.id}/commands`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: "PowerCheck" }),
        cache: "no-store",
      });
      const data = (await res.json()) as CommandResponse;
      if (!res.ok) throw new Error("rejected");
      onSnapshot(data.snapshot);
      setReport(data.report ?? null);
      const health = data.report?.health ?? "pass";
      const line = `${data.report?.score ?? 0}/100 · ${data.latencyMs} ms`;
      if (health === "pass") toast.success(`Power check passed on ${station.id}`, { description: line });
      else if (health === "warn") toast(`Power check with warnings on ${station.id}`, { description: line });
      else toast.error(`Power check failed on ${station.id}`, { description: line });
    } catch {
      toast.error("Power check failed", { description: "The management system did not accept the call." });
    } finally {
      setBusy(false);
    }
  }

  if (!station) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Station</CardTitle>
          <CardDescription>Select a marker on the map or a row in the table.</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
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
              {station.town} · {siteTypeLabel[station.siteType]} · buyer type: {station.buyerHint}
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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
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

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <StatBlock
            title="Today"
            rows={[
              ["Cars charged", String(station.sessionsToday)],
              ["Energy delivered", kwh(station.energyTodayKwh)],
              ["Revenue", usd(station.revenueTodayUsd, true)],
            ]}
          />
          <StatBlock
            title="Last 30 days"
            rows={[
              ["Cars charged", String(station.sessions30d)],
              ["Energy delivered", kwh(station.energy30dKwh)],
              ["Revenue", usd(station.revenue30dUsd)],
              ["Uptime", `${station.uptime30dPct.toFixed(1)}%`],
            ]}
          />
        </div>

        <div>
          <p className="mb-1 text-muted-foreground text-xs uppercase tracking-wider">Connectors</p>
          <ul className="flex flex-col gap-1 text-sm">
            {station.connectors.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-2 rounded-md bg-muted/50 px-2.5 py-1.5">
                <span className="font-mono text-xs">
                  {c.id} · {c.type} · {c.maxKw} kW
                </span>
                <span className="flex items-center gap-2 text-xs">
                  <span className="tabular-nums">{c.outputKw.toFixed(1)} kW</span>
                  <Badge variant="outline" className="rounded-sm px-1.5 py-0 text-[11px]">
                    {c.status}
                  </Badge>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {station.faults.length ? (
          <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm">
            <p className="mb-1 font-medium text-destructive text-xs uppercase tracking-wider">Open faults</p>
            <ul className="list-disc space-y-0.5 pl-4 text-xs">
              {station.faults.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div>
          <p className="mb-1 text-muted-foreground text-xs uppercase tracking-wider">Last 90 minutes</p>
          {points.length ? <StationChart points={points} /> : <Skeleton className="h-64 w-full" />}
        </div>

        {report ? (
          <div className="rounded-md border px-3 py-2 text-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium">Power check</span>
              <Badge
                variant="secondary"
                className={cn(
                  "rounded-sm",
                  report.health === "pass" && "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
                  report.health === "warn" && "bg-amber-500/10 text-amber-700 dark:text-amber-300",
                  report.health === "fail" && "bg-destructive/10 text-destructive",
                )}
              >
                {report.health} · {report.score}/100
              </Badge>
            </div>
            <ul className="mt-1 space-y-0.5 text-muted-foreground text-xs">
              {report.checks
                .filter((c) => c.result !== "pass")
                .map((c) => (
                  <li key={c.name}>
                    {c.name}: {c.value}, expected {c.expected}
                  </li>
                ))}
              {report.checks.every((c) => c.result === "pass") ? (
                <li>All {report.checks.length} checks passed.</li>
              ) : null}
            </ul>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <Button onClick={powerCheck} disabled={busy || !station.online}>
            <Activity data-icon="inline-start" className={busy ? "animate-pulse" : undefined} />
            Run power check
          </Button>
          <Button variant="outline" asChild>
            <Link prefetch={false} href={`/dashboard/stations?station=${station.id}`}>
              Open in Power and performance
              <ArrowUpRight data-icon="inline-end" />
            </Link>
          </Button>
        </div>
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

function StatBlock({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <div className="rounded-lg border px-3 py-2">
      <p className="mb-1 text-muted-foreground text-xs uppercase tracking-wider">{title}</p>
      <dl className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-0.5 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="text-right font-medium tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
