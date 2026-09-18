"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import type { TelemetryPoint } from "./types";

const chartConfig = {
  pvKw: { label: "Solar kW", color: "var(--chart-1)" },
  outputKw: { label: "EV output kW", color: "var(--chart-4)" },
  gridKw: { label: "Grid import kW", color: "var(--destructive)" },
} satisfies ChartConfig;

function hhmm(iso: string) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function StationChart({ points }: { points: TelemetryPoint[] }) {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
      <AreaChart accessibilityLayer data={points} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="t" tickFormatter={hhmm} tickLine={false} axisLine={false} minTickGap={40} />
        <YAxis tickLine={false} axisLine={false} width={34} unit=" kW" />
        <ChartTooltip content={<ChartTooltipContent labelFormatter={(v) => hhmm(String(v))} />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          dataKey="pvKw"
          type="monotone"
          fill="var(--color-pvKw)"
          fillOpacity={0.25}
          stroke="var(--color-pvKw)"
          isAnimationActive={false}
        />
        <Area
          dataKey="outputKw"
          type="monotone"
          fill="var(--color-outputKw)"
          fillOpacity={0.15}
          stroke="var(--color-outputKw)"
          isAnimationActive={false}
        />
        <Area
          dataKey="gridKw"
          type="step"
          fill="var(--color-gridKw)"
          fillOpacity={0.15}
          stroke="var(--color-gridKw)"
          isAnimationActive={false}
        />
      </AreaChart>
    </ChartContainer>
  );
}
