"use client";

import { kwh, siteTypeLabel, stationStatus, usd } from "@/app/(main)/dashboard/_components/operations/station-status";
import { ProvenanceBadge } from "@/app/(main)/dashboard/_components/screen-intro";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

import type { StationSnapshot } from "./types";

interface StationHeaderProps {
  stations: StationSnapshot[] | null;
  selected: StationSnapshot | null;
  onSelect: (id: string) => void;
  daylight: boolean;
  onDaylight: (on: boolean) => void;
}

/** Which station this page is about, how it is doing, and the simulation clock. */
export function StationHeader({ stations, selected, onSelect, daylight, onDaylight }: StationHeaderProps) {
  const st = selected ? stationStatus(selected) : null;
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-3 text-card-foreground lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
        {stations ? (
          <Select value={selected?.id} onValueChange={onSelect}>
            <SelectTrigger aria-label="Select station" className="w-full sm:w-80">
              <SelectValue placeholder="Choose a station" />
            </SelectTrigger>
            <SelectContent>
              {stations.map((s) => {
                const ss = stationStatus(s);
                return (
                  <SelectItem key={s.id} value={s.id}>
                    <span aria-hidden="true" className="size-2 rounded-full" style={{ backgroundColor: ss.color }} />
                    {s.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        ) : (
          <Skeleton className="h-9 w-full sm:w-80" />
        )}
        {selected && st ? (
          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            <Badge variant="secondary" className={cn("rounded-sm px-1.5 py-0.5 font-medium", st.badgeClass)}>
              {st.label}
            </Badge>
            <ProvenanceBadge kind={selected.provenance} />
            <span className="truncate text-muted-foreground text-xs">
              {selected.town} · {siteTypeLabel[selected.siteType]} · {selected.buyerHint}
            </span>
          </div>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        {selected ? (
          <>
            <Stat label="Cars today" value={String(selected.sessionsToday)} />
            <Stat label="Energy today" value={kwh(selected.energyTodayKwh)} />
            <Stat label="Revenue today" value={usd(selected.revenueTodayUsd, true)} />
            <Stat label="Uptime 30d" value={`${selected.uptime30dPct.toFixed(1)}%`} />
          </>
        ) : null}
        <div className="flex items-center gap-2 border-l pl-4">
          <Label htmlFor="daylight-clock" className="text-muted-foreground text-xs">
            Noon clock
          </Label>
          <Switch id="daylight-clock" checked={daylight} onCheckedChange={onDaylight} />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-right">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className="font-medium text-sm tabular-nums">{value}</div>
    </div>
  );
}
