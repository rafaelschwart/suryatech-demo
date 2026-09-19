"use client";

import { useEffect, useState } from "react";

import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts";

import { AnimatedNumber } from "@/app/(main)/dashboard/_components/motion";
import { kwh, siteTypeLabel, usd } from "@/app/(main)/dashboard/_components/operations/station-status";
import { ProvenanceBadge } from "@/app/(main)/dashboard/_components/screen-intro";
import type { FleetHistory, FleetSummary } from "@/app/(main)/dashboard/stations/_components/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deskFetch } from "@/lib/desk-api/client";
import { cn } from "@/lib/utils";

const chartConfig = {
  revenueUsd: { label: "Revenue $", color: "var(--chart-1)" },
  sessions: { label: "Cars charged", color: "var(--chart-4)" },
} satisfies ChartConfig;

function md(iso: string) {
  const [, m, d] = iso.split("-");
  return `${Number(m)}/${Number(d)}`;
}

/** Fleet economics: cars charged, energy delivered and what it earned, today and over 30 days. */
export function RevenueConsole() {
  const [summary, setSummary] = useState<FleetSummary | null>(null);
  const [history, setHistory] = useState<FleetHistory | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const [a, b] = await Promise.all([
        deskFetch("/api/fleet/summary", { cache: "no-store" }),
        deskFetch("/api/fleet/history?days=30", { cache: "no-store" }),
      ]);
      if (cancelled) return;
      if (a.ok) setSummary((await a.json()) as FleetSummary);
      if (b.ok) setHistory((await b.json()) as FleetHistory);
    };
    void load();
    const t = window.setInterval(() => void load(), 30_000);
    return () => {
      cancelled = true;
      window.clearInterval(t);
    };
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <Kpi label="Cars charged today" value={summary ? String(summary.sessionsToday) : null} />
        <Kpi label="Cars charged, 30 days" value={summary ? String(summary.sessions30d) : null} />
        <Kpi label="Energy delivered, 30 days" value={summary ? kwh(summary.energy30dKwh) : null} />
        <Kpi label="Revenue today" value={summary ? usd(summary.revenueTodayUsd, true) : null} tone="ok" />
        <Kpi label="Revenue, 30 days" value={summary ? usd(summary.revenue30dUsd) : null} tone="ok" />
        <Kpi
          label="Fleet uptime, 30 days"
          value={summary ? `${summary.uptime30dPct.toFixed(1)}%` : null}
          tone={summary && summary.uptime30dPct < 97 ? "warning" : "neutral"}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Last 30 days</CardTitle>
          <CardDescription>Revenue per day, with cars charged.</CardDescription>
        </CardHeader>
        <CardContent>
          {history ? (
            <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
              <ComposedChart accessibilityLayer data={history.series} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={md} tickLine={false} axisLine={false} minTickGap={28} />
                <YAxis
                  yAxisId="usd"
                  tickLine={false}
                  axisLine={false}
                  width={44}
                  tickFormatter={(v) => usd(Number(v))}
                />
                <YAxis yAxisId="n" orientation="right" tickLine={false} axisLine={false} width={30} />
                <ChartTooltip content={<ChartTooltipContent labelFormatter={(v) => md(String(v))} />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  yAxisId="usd"
                  dataKey="revenueUsd"
                  fill="var(--color-revenueUsd)"
                  radius={[3, 3, 0, 0]}
                  isAnimationActive={false}
                />
                <Line
                  yAxisId="n"
                  dataKey="sessions"
                  type="monotone"
                  stroke="var(--color-sessions)"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </ComposedChart>
            </ChartContainer>
          ) : (
            <Skeleton className="h-72 w-full" />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>By station</CardTitle>
          <CardDescription>Revenue is kWh times the site tariff. Tariffs are samples.</CardDescription>
        </CardHeader>
        <CardContent>
          {summary ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Station</TableHead>
                    <TableHead>Site</TableHead>
                    <TableHead className="text-right">Tariff</TableHead>
                    <TableHead className="text-right">Cars today</TableHead>
                    <TableHead className="text-right">Cars 30d</TableHead>
                    <TableHead className="text-right">Energy 30d</TableHead>
                    <TableHead className="text-right">Revenue today</TableHead>
                    <TableHead className="text-right">Revenue 30d</TableHead>
                    <TableHead className="text-right">Uptime 30d</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summary.byStation.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>
                        <div className="font-medium">{s.name}</div>
                        <div className="font-mono text-muted-foreground text-xs">{s.id}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs">
                            {s.town} · {siteTypeLabel[s.siteType]}
                          </span>
                          <ProvenanceBadge kind={s.provenance} className="w-fit" />
                        </div>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">${s.tariffUsdPerKwh.toFixed(2)}/kWh</TableCell>
                      <TableCell className="text-right tabular-nums">{s.sessionsToday}</TableCell>
                      <TableCell className="text-right tabular-nums">{s.sessions30d}</TableCell>
                      <TableCell className="text-right tabular-nums">{kwh(s.energy30dKwh)}</TableCell>
                      <TableCell className="text-right tabular-nums">{usd(s.revenueTodayUsd, true)}</TableCell>
                      <TableCell className="text-right tabular-nums">{usd(s.revenue30dUsd)}</TableCell>
                      <TableCell
                        className={cn(
                          "text-right tabular-nums",
                          s.uptime30dPct < 95 && "text-destructive",
                          s.uptime30dPct >= 95 && s.uptime30dPct < 98 && "text-amber-700 dark:text-amber-300",
                        )}
                      >
                        {s.uptime30dPct.toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <Skeleton className="h-64 w-full" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Kpi({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string | null;
  tone?: "neutral" | "ok" | "warning";
}) {
  return (
    <div className="rounded-xl border bg-card px-4 py-3 text-card-foreground">
      <div className="text-muted-foreground text-xs">{label}</div>
      {value === null ? (
        <Skeleton className="mt-2 h-7 w-24" />
      ) : (
        <div
          className={cn(
            "mt-1 font-medium text-2xl tabular-nums tracking-tight",
            tone === "ok" && "text-emerald-700 dark:text-emerald-300",
            tone === "warning" && "text-amber-700 dark:text-amber-300",
          )}
        >
          <AnimatedNumber value={value} />
        </div>
      )}
    </div>
  );
}
