"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ArrowUpRight } from "lucide-react";

import { FleetKpis } from "@/app/(main)/dashboard/_components/operations/fleet-kpis";
import { StationMap } from "@/app/(main)/dashboard/_components/operations/station-map";
import { stationStatus, usd } from "@/app/(main)/dashboard/_components/operations/station-status";
import { useFleet } from "@/app/(main)/dashboard/_components/operations/use-fleet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * The operations half of the overview: fleet numbers, the map, and one line per station.
 * A click on a marker or a row opens that station on the Locations screen.
 */
export function OverviewOperations() {
  const { stations } = useFleet(3000);
  const router = useRouter();
  const open = (id: string) => router.push(`/dashboard/operations?station=${id}`);

  return (
    <div className="flex flex-col gap-3">
      <FleetKpis stations={stations} />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="h-[360px] overflow-hidden rounded-xl border bg-card p-1 xl:col-span-7 xl:h-[420px]">
          {stations ? (
            <StationMap stations={stations} selectedId={null} onSelect={open} compact />
          ) : (
            <Skeleton className="h-full w-full rounded-lg" />
          )}
        </div>
        <Card className="xl:col-span-5">
          <CardHeader>
            <CardTitle>Stations now</CardTitle>
            <CardDescription>Status, output and what each site earned today.</CardDescription>
            <CardAction>
              <Button variant="ghost" size="sm" asChild>
                <Link prefetch={false} href="/dashboard/operations">
                  Locations map
                  <ArrowUpRight data-icon="inline-end" />
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {stations ? (
              <ul className="divide-y">
                {stations.map((s) => {
                  const st = stationStatus(s);
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => open(s.id)}
                        className="flex w-full items-center gap-3 px-1 py-2 text-left text-sm hover:bg-muted/60"
                      >
                        <span
                          aria-hidden="true"
                          className={cn("size-2.5 shrink-0 rounded-full", st.key === "charging" && "animate-pulse")}
                          style={{ backgroundColor: st.color }}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium">{s.name}</span>
                          <span className="block text-muted-foreground text-xs">
                            {s.town} · {s.sessionsToday} cars today
                          </span>
                        </span>
                        <span className="hidden w-16 text-right tabular-nums sm:block">{s.outputKw.toFixed(1)} kW</span>
                        <span className="w-16 text-right tabular-nums">{usd(s.revenueTodayUsd)}</span>
                        <Badge variant="secondary" className={cn("w-24 justify-center rounded-sm", st.badgeClass)}>
                          {st.label}
                        </Badge>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <Skeleton className="h-64 w-full" />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
