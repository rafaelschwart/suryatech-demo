"use client";

import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import { siteTypeLabel, stationStatus, usd } from "@/app/(main)/dashboard/_components/operations/station-status";
import { ProvenanceBadge } from "@/app/(main)/dashboard/_components/screen-intro";
import type { StationSnapshot } from "@/app/(main)/dashboard/stations/_components/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface StationsTableProps {
  stations: StationSnapshot[] | null;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

/** Every station as a row, same numbers as the markers. Clicking a row selects it on the map. */
export function StationsTable({ stations, selectedId, onSelect }: StationsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All stations</CardTitle>
        <CardDescription>
          Status, live output and what each site earned today. Click a row to select it on the map, Open for the station
          page.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {stations ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Station</TableHead>
                  <TableHead>Site</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Output</TableHead>
                  <TableHead className="text-right">Solar</TableHead>
                  <TableHead className="text-right">Battery</TableHead>
                  <TableHead className="text-right">Cars today</TableHead>
                  <TableHead className="text-right">Revenue today</TableHead>
                  <TableHead className="text-right">Uptime 30d</TableHead>
                  <TableHead className="w-24" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {stations.map((s) => {
                  const st = stationStatus(s);
                  const selected = s.id === selectedId;
                  return (
                    <TableRow
                      key={s.id}
                      data-state={selected ? "selected" : undefined}
                      className="cursor-pointer"
                      onClick={() => onSelect(s.id)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span
                            aria-hidden="true"
                            className="size-2.5 shrink-0 rounded-full"
                            style={{ backgroundColor: st.color }}
                          />
                          <div className="min-w-0">
                            <div className="font-medium">{s.name}</div>
                            <div className="font-mono text-muted-foreground text-xs">{s.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs">
                            {s.town} · {siteTypeLabel[s.siteType]}
                          </span>
                          <ProvenanceBadge kind={s.provenance} className="w-fit" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={cn("rounded-sm px-1.5 py-0.5", st.badgeClass)}>
                          {st.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{s.outputKw.toFixed(1)} kW</TableCell>
                      <TableCell className="text-right tabular-nums">{s.pvKw.toFixed(1)} kW</TableCell>
                      <TableCell className="text-right tabular-nums">{s.batterySoc.toFixed(0)}%</TableCell>
                      <TableCell className="text-right tabular-nums">{s.sessionsToday}</TableCell>
                      <TableCell className="text-right tabular-nums">{usd(s.revenueTodayUsd, true)}</TableCell>
                      <TableCell className="text-right tabular-nums">{s.uptime30dPct.toFixed(1)}%</TableCell>
                      <TableCell className="text-right">
                        <Button size="xs" variant="outline" asChild onClick={(e) => e.stopPropagation()}>
                          <Link prefetch={false} href={`/dashboard/stations?station=${s.id}`}>
                            Open
                            <ArrowUpRight data-icon="inline-end" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <Skeleton className="h-48 w-full" />
        )}
      </CardContent>
    </Card>
  );
}
