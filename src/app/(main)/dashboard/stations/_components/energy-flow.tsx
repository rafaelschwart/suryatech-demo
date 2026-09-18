"use client";

import { ArrowDownLeft, ArrowUpRight, BatteryCharging, Car, Sun, UtilityPole } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import type { StationSnapshot } from "./types";

/** Values and directions are driven by the selected station's simulator readings. */
export function EnergyFlow({ station }: { station: StationSnapshot | null }) {
  const pv = station?.pvKw ?? 0;
  const battery = station?.batteryKw ?? 0;
  const output = station?.outputKw ?? 0;
  const grid = station?.gridKw ?? 0;
  const charging = battery > 0.1;
  const discharging = battery < -0.1;
  const batteryMode = charging ? "Charging" : discharging ? "Discharging" : "Standby";
  const reading = (value: number) => (station ? `${value.toFixed(1)} kW` : "—");

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-xl border bg-card text-card-foreground">
      <div className="flex items-start justify-between gap-3 border-b p-4">
        <div>
          <h2 className="font-medium">Power distribution</h2>
          <p className="mt-1 text-xs text-muted-foreground">Selected station · simulated readings</p>
        </div>
        <Badge variant="outline" className="rounded-sm text-muted-foreground">
          kW
        </Badge>
      </div>
      <div className="hidden flex-1 flex-col justify-center px-4 py-5 sm:flex">
        <svg
          viewBox="0 0 640 270"
          role="img"
          aria-label={`Power distribution: solar ${reading(pv)}, grid ${reading(grid)}, battery ${batteryMode.toLowerCase()} at ${reading(Math.abs(battery))}, vehicle output ${reading(output)}.`}
          className="w-full text-muted-foreground"
        >
          <title>Solar and grid feed the charging bus; battery flow changes with charge or discharge.</title>
          <g fill="none" stroke="var(--border)" strokeWidth="2">
            <path d="M176 73H452" />
            <path d="M176 207H220V73" />
            <path d="M320 73V170" />
          </g>
          <g fill="none" stroke="var(--chart-3)" strokeWidth="2" strokeDasharray="5 7">
            {pv > 0.1 ? <path d="M176 73H320" className="motion-safe:animate-[dash_2s_linear_infinite]" /> : null}
            {output > 0.1 ? <path d="M320 73H452" className="motion-safe:animate-[dash_2s_linear_infinite]" /> : null}
            {grid > 0.1 ? <path d="M176 207H220V73" className="motion-safe:animate-[dash_2s_linear_infinite]" /> : null}
            {charging || discharging ? (
              <path
                d={charging ? "M320 73V170" : "M320 170V73"}
                className="motion-safe:animate-[dash_2s_linear_infinite]"
              />
            ) : null}
          </g>
          <circle cx="320" cy="73" r="4" fill="var(--foreground)" />
          <text x="320" y="49" textAnchor="middle" fill="var(--muted-foreground)" fontSize="11">
            Charging bus
          </text>
          <text x="334" y="135" fill="var(--muted-foreground)" fontSize="11">
            {batteryMode}
          </text>
          <DiagramNode
            x={24}
            y={32}
            label="SOLAR INPUT"
            value={reading(pv)}
            detail={station ? `${station.pvCapacityKw} kW installed` : "Awaiting data"}
          />
          <DiagramNode
            x={452}
            y={32}
            label="VEHICLE OUTPUT"
            value={reading(output)}
            detail={output > 0.1 ? "Delivering power" : "No active delivery"}
          />
          <DiagramNode
            x={24}
            y={170}
            label="GRID BACKUP"
            value={reading(grid)}
            detail={grid > 0.1 ? "Importing" : "Standby"}
          />
          <DiagramNode
            x={244}
            y={170}
            label="BATTERY"
            value={reading(Math.abs(battery))}
            detail={station ? `${station.batterySoc.toFixed(0)}% charged` : "Awaiting data"}
          />
        </svg>
      </div>
      <dl className="grid grid-cols-2 gap-4 border-t bg-muted/20 p-4">
        <Reading icon={Sun} label="Solar generation" value={reading(pv)} />
        <Reading icon={Car} label="Vehicle delivery" value={reading(output)} />
        <Reading
          icon={BatteryCharging}
          label={`Battery · ${batteryMode.toLowerCase()}`}
          value={reading(Math.abs(battery))}
        />
        <Reading icon={UtilityPole} label="Grid import" value={reading(grid)} />
      </dl>
      <p className="flex items-center gap-2 border-t px-4 py-3 text-[11px] text-muted-foreground">
        {charging ? <ArrowDownLeft className="size-3.5" /> : <ArrowUpRight className="size-3.5" />}
        {station
          ? charging
            ? "Surplus power is charging the battery."
            : discharging
              ? "Stored energy is supporting vehicle charging."
              : "Battery power is in standby."
          : "Waiting for station readings."}
      </p>
    </section>
  );
}

function DiagramNode({
  x,
  y,
  label,
  value,
  detail,
}: {
  x: number;
  y: number;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width="152" height="80" rx="7" fill="var(--card)" stroke="var(--border)" />
      <text x="14" y="21" fontSize="9" letterSpacing="1" fill="var(--muted-foreground)">
        {label}
      </text>
      <text x="14" y="47" fontSize="21" fontWeight="500" fill="var(--foreground)" className="tabular-nums">
        {value}
      </text>
      <text x="14" y="65" fontSize="10" fill="var(--muted-foreground)">
        {detail}
      </text>
    </g>
  );
}

function Reading({ icon: Icon, label, value }: { icon: typeof Sun; label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <Icon className="size-3.5 shrink-0" />
        {label}
      </dt>
      <dd className="mt-1 pl-5 font-medium text-sm tabular-nums">{value}</dd>
    </div>
  );
}
