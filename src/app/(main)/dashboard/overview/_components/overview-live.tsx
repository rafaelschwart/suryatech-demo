"use client";

import Link from "next/link";

import { AlertTriangle, ArrowUpRight, CircleAlert, Info } from "lucide-react";

import { AnimatedNumber } from "@/app/(main)/dashboard/_components/motion";
import { stationStatus, usd } from "@/app/(main)/dashboard/_components/operations/station-status";
import { useFleet } from "@/app/(main)/dashboard/_components/operations/use-fleet";
import { ProcessFlow } from "@/app/(main)/dashboard/_components/process-flow";
import type { DeadlineRow } from "@/app/(main)/dashboard/deadlines/_components/deadline-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { workOrderCards } from "@/data/boards";
import { cn } from "@/lib/utils";

export type Severity = "critical" | "warning" | "info";

export interface AttentionItem {
  id: string;
  severity: Severity;
  title: string;
  detail: string;
  href: string;
}

interface OverviewLiveProps {
  prepAttention: AttentionItem[];
  prepCounts: Record<string, string>;
  prepNumbers: { label: string; value: string; tone?: "ok" | "warning" | "critical" }[];
  upcoming: DeadlineRow[];
  boardCounts: { title: string; count: number; tone: string }[];
}

const severityOrder: Record<Severity, number> = { critical: 0, warning: 1, info: 2 };
const severityIcon: Record<Severity, typeof Info> = { critical: CircleAlert, warning: AlertTriangle, info: Info };
const severityClass: Record<Severity, string> = {
  critical: "text-destructive",
  warning: "text-amber-600 dark:text-amber-300",
  info: "text-sky-600 dark:text-sky-300",
};

/**
 * The overview body. Server-side facts about package preparation come in as props; the operations
 * half is read live from the fleet so the attention list and the flow counts move with the stations.
 */
export function OverviewLive({ prepAttention, prepCounts, prepNumbers, upcoming, boardCounts }: OverviewLiveProps) {
  const { stations } = useFleet(3000);
  const fleet = stations ?? [];

  const opsAttention: AttentionItem[] = [];
  for (const s of fleet) {
    const href = `/dashboard/operations?station=${s.id}`;
    for (const f of s.faults) {
      opsAttention.push({ id: `${s.id}-${f}`, severity: "critical", title: `${s.name}: fault`, detail: f, href });
    }
    if (!s.online) {
      opsAttention.push({
        id: `${s.id}-offline`,
        severity: "warning",
        title: `${s.name}: offline`,
        detail: "No heartbeat. Rebooting or disconnected.",
        href,
      });
    } else if (s.availability === "Inoperative") {
      opsAttention.push({
        id: `${s.id}-oos`,
        severity: "warning",
        title: `${s.name}: out of service`,
        detail: "Set Inoperative. See the work order.",
        href: "/dashboard/work-orders",
      });
    }
  }
  const attention = [...opsAttention, ...prepAttention].sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity],
  );

  const output = fleet.reduce((n, s) => n + s.outputKw, 0);
  const cars = fleet.reduce((n, s) => n + s.sessionsToday, 0);
  const revenue = fleet.reduce((n, s) => n + s.revenueTodayUsd, 0);
  const online = fleet.filter((s) => s.online).length;
  const faults = fleet.reduce((n, s) => n + s.faults.length, 0);
  const charging = fleet.filter((s) => s.connectors.some((c) => c.status === "Charging")).length;
  const openOrders = workOrderCards.filter((w) => w.column !== "resolved").length;

  const opsCounts = stations
    ? {
        locate: `${online}/${fleet.length} online`,
        inspect: `${faults} fault${faults === 1 ? "" : "s"}`,
        control: `${charging} charging`,
        bill: `${usd(revenue)} today`,
        maintain: `${openOrders} open`,
      }
    : undefined;

  return (
    <div className="flex flex-col gap-4">
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle>Needs attention</CardTitle>
          <CardDescription>Most urgent first. Each line opens where it is fixed.</CardDescription>
          <CardAction>
            <Badge variant="secondary" className="rounded-sm tabular-nums">
              {stations ? attention.length : "…"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          {stations ? (
            <ul className="grid grid-cols-1 gap-x-6 gap-y-1 lg:grid-cols-2">
              {attention.map((a) => {
                const Icon = severityIcon[a.severity];
                return (
                  <li key={a.id}>
                    <Link
                      prefetch={false}
                      href={a.href}
                      className="group flex items-start gap-2.5 rounded-md px-2 py-1.5 text-sm hover:bg-muted/60"
                    >
                      <Icon className={cn("mt-0.5 size-4 shrink-0", severityClass[a.severity])} />
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium leading-snug">{a.title}</span>
                        <span className="block truncate text-muted-foreground text-xs">{a.detail}</span>
                      </span>
                      <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <Skeleton className="h-24 w-full" />
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 2xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Project operations</CardTitle>
            <CardDescription>Live from the fleet.</CardDescription>
            <CardAction>
              <Badge variant="outline" className="rounded-sm text-[10px] uppercase tracking-wider">
                Phase 2
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <ProcessFlow flow="ops" size="large" counts={opsCounts} />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Figure label="EV output now" value={stations ? `${output.toFixed(1)} kW` : null} />
              <Figure label="Cars charged today" value={stations ? String(cars) : null} />
              <Figure label="Revenue today" value={stations ? usd(revenue) : null} tone="ok" />
              <Figure label="Open faults" value={stations ? String(faults) : null} tone={faults ? "critical" : "ok"} />
            </div>
            <div>
              <p className="mb-1.5 text-muted-foreground text-xs uppercase tracking-wider">Stations</p>
              <div className="flex flex-wrap gap-1.5">
                {fleet.map((s) => {
                  const st = stationStatus(s);
                  return (
                    <Link
                      key={s.id}
                      prefetch={false}
                      href={`/dashboard/operations?station=${s.id}`}
                      className="flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs hover:bg-muted/60"
                    >
                      <span aria-hidden="true" className="size-2 rounded-full" style={{ backgroundColor: st.color }} />
                      {s.town}
                      <span className="text-muted-foreground tabular-nums">{s.outputKw.toFixed(0)} kW</span>
                    </Link>
                  );
                })}
                {!stations ? <Skeleton className="h-7 w-full" /> : null}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Package preparation</CardTitle>
            <CardDescription>Requests, deadlines, the response.</CardDescription>
            <CardAction>
              <Button variant="ghost" size="sm" asChild>
                <Link prefetch={false} href="/dashboard/board">
                  Response board
                  <ArrowUpRight data-icon="inline-end" />
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <ProcessFlow flow="prep" size="large" counts={prepCounts} />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {prepNumbers.map((n) => (
                <Figure key={n.label} label={n.label} value={n.value} tone={n.tone} />
              ))}
            </div>
            <div>
              <p className="mb-1.5 text-muted-foreground text-xs uppercase tracking-wider">Response board</p>
              <div className="flex flex-wrap gap-1.5">
                {boardCounts.map((b) => (
                  <Link
                    key={b.title}
                    prefetch={false}
                    href="/dashboard/board"
                    className="flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs hover:bg-muted/60"
                  >
                    <span aria-hidden="true" className={cn("size-2 rounded-sm", b.tone)} />
                    {b.title}
                    <span className="font-medium tabular-nums">{b.count}</span>
                  </Link>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Next deadlines</CardTitle>
          <CardDescription>Filings and closings still ahead, soonest first.</CardDescription>
          <CardAction>
            <Button variant="ghost" size="sm" asChild>
              <Link prefetch={false} href="/dashboard/deadlines">
                Deadline board
                <ArrowUpRight data-icon="inline-end" />
              </Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {upcoming.length ? (
            <ul className="divide-y">
              {upcoming.map((r) => (
                <li key={r.id} className="flex items-center gap-3 py-2 text-sm">
                  <span className="w-24 shrink-0 font-mono text-muted-foreground text-xs">{r.due}</span>
                  <span className="min-w-0 flex-1 truncate">{r.item}</span>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "shrink-0 rounded-sm tabular-nums",
                      (r.daysLeft ?? 99) <= 14
                        ? "bg-destructive/10 text-destructive"
                        : (r.daysLeft ?? 99) <= 45
                          ? "bg-amber-500/10 text-amber-700 dark:text-amber-300"
                          : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
                    )}
                  >
                    {r.daysLeft} days
                  </Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">Nothing dated is ahead.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Figure({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string | null;
  tone?: "neutral" | "ok" | "warning" | "critical";
}) {
  return (
    <div className="rounded-lg border px-3 py-2">
      <div className="text-muted-foreground text-xs">{label}</div>
      {value === null ? (
        <Skeleton className="mt-1.5 h-6 w-16" />
      ) : (
        <div
          className={cn(
            "mt-0.5 font-medium text-xl tabular-nums tracking-tight",
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
