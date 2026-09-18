"use client";

import { useEffect, useState } from "react";

import { useSearchParams } from "next/navigation";

import { FleetKpis } from "@/app/(main)/dashboard/_components/operations/fleet-kpis";
import { StationMap } from "@/app/(main)/dashboard/_components/operations/station-map";
import { type StationStatusKey, stationStatus } from "@/app/(main)/dashboard/_components/operations/station-status";
import { useFleet } from "@/app/(main)/dashboard/_components/operations/use-fleet";
import { Skeleton } from "@/components/ui/skeleton";

import { StationPanel } from "./station-panel";
import { StationsTable } from "./stations-table";

const LEGEND: { key: StationStatusKey; label: string; color: string }[] = [
  { key: "charging", label: "Charging", color: "#0284c7" },
  { key: "healthy", label: "Available", color: "#059669" },
  { key: "fault", label: "Fault", color: "#dc2626" },
  { key: "inoperative", label: "Out of service", color: "#d97706" },
  { key: "offline", label: "Offline", color: "#64748b" },
];

/** Map on the left, the selected station on the right, every station as a table below. */
export function OperationsConsole() {
  const { stations } = useFleet(3000);
  const requested = useSearchParams().get("station");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!stations || selectedId) return;
    const hit = requested && stations.some((s) => s.id === requested) ? requested : (stations[0]?.id ?? null);
    setSelectedId(hit);
  }, [stations, requested, selectedId]);

  const selected = stations?.find((s) => s.id === selectedId) ?? null;
  const counts = new Map<StationStatusKey, number>();
  for (const s of stations ?? []) {
    const k = stationStatus(s).key;
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }

  return (
    <div className="flex flex-col gap-4">
      <FleetKpis stations={stations} />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="flex flex-col gap-2 xl:col-span-7">
          <div className="h-[420px] overflow-hidden rounded-xl border bg-card p-1 xl:h-[640px]">
            {stations ? (
              <StationMap stations={stations} selectedId={selectedId} onSelect={setSelectedId} />
            ) : (
              <Skeleton className="h-full w-full rounded-lg" />
            )}
          </div>
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 px-1 text-muted-foreground text-xs">
            {LEGEND.map((l) => (
              <li key={l.key} className="flex items-center gap-1.5">
                <span aria-hidden="true" className="size-2.5 rounded-full" style={{ backgroundColor: l.color }} />
                {l.label}
                <span className="tabular-nums">({counts.get(l.key) ?? 0})</span>
              </li>
            ))}
            <li className="ml-auto">Map tiles © Esri</li>
          </ul>
        </div>
        <div className="xl:col-span-5">
          <StationPanel station={selected} />
        </div>
      </div>
      <StationsTable stations={stations} selectedId={selectedId} onSelect={setSelectedId} />
    </div>
  );
}
