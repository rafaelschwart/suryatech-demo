"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import Image from "next/image";
import { useSearchParams } from "next/navigation";

import {
  Activity,
  BatteryCharging,
  Cable,
  FileDown,
  Play,
  Power,
  RadioTower,
  RotateCcw,
  Square,
  Sun,
  ThermometerSun,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { ProvenanceBadge } from "@/app/(main)/dashboard/_components/screen-intro";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deskFetch } from "@/lib/desk-api/client";
import { cn } from "@/lib/utils";

import { ApiConsole, type ApiExchange } from "./api-console";
import { EnergyFlow } from "./energy-flow";
import { StationChart } from "./station-chart";
import { StationStage } from "./station-stage";
import type {
  CommandName,
  CommandRequest,
  CommandResponse,
  ConnectorStatus,
  StationSnapshot,
  TelemetryPoint,
} from "./types";

const POLL_MS = 3000;

const covers: Record<StationSnapshot["siteType"], string> = {
  commercial: "/media/site-commercial-v2.webp",
  municipal: "/media/site-municipal-v2.webp",
  "state-park": "/media/site-park-v2.webp",
  transit: "/media/site-municipal-v2.webp",
  "park-and-ride": "/media/site-commercial-v2.webp",
};

const connectorStyle: Record<ConnectorStatus, string> = {
  Available: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  Preparing: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  Charging: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  Finishing: "bg-muted text-muted-foreground",
  Faulted: "bg-destructive/10 text-destructive",
  Unavailable: "bg-muted text-muted-foreground",
};

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function StationsConsole() {
  const [stations, setStations] = useState<StationSnapshot[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [points, setPoints] = useState<TelemetryPoint[]>([]);
  const [exchanges, setExchanges] = useState<ApiExchange[]>([]);
  const [lastCommand, setLastCommand] = useState<CommandResponse | null>(null);
  const [busy, setBusy] = useState<CommandName | null>(null);
  const [audit, setAudit] = useState<string[]>([]);
  const [daylight, setDaylight] = useState(true);
  const consoleRef = useRef<HTMLDivElement>(null);
  const requested = useSearchParams().get("station");

  const record = useCallback((e: Omit<ApiExchange, "id" | "at">) => {
    setExchanges((prev) => [{ id: newId(), at: new Date().toISOString(), ...e }, ...prev].slice(0, 40));
  }, []);

  const call = useCallback(
    async <T,>(method: "GET" | "POST", path: string, body?: unknown): Promise<T | null> => {
      const started = performance.now();
      try {
        const res = await deskFetch(path, {
          method,
          headers: body ? { "Content-Type": "application/json" } : undefined,
          body: body ? JSON.stringify(body) : undefined,
          cache: "no-store",
        });
        const json = (await res.json()) as T;
        record({
          method,
          path,
          requestBody: body,
          status: res.status,
          latencyMs: Math.round(performance.now() - started),
          responseBody: json,
        });
        return res.ok ? json : null;
      } catch {
        record({
          method,
          path,
          requestBody: body,
          status: 0,
          latencyMs: Math.round(performance.now() - started),
          responseBody: { error: "network" },
        });
        return null;
      }
    },
    [record],
  );

  const refresh = useCallback(async () => {
    const list = await call<{ stations: StationSnapshot[] }>(
      "GET",
      `/api/stations?clock=${daylight ? "daylight" : "live"}`,
    );
    if (list) {
      setStations(list.stations);
      setSelectedId((cur) => {
        if (cur) return cur;
        if (requested && list.stations.some((s) => s.id === requested)) return requested;
        return list.stations[0]?.id ?? null;
      });
    }
  }, [call, daylight, requested]);

  useEffect(() => {
    void refresh();
    const t = window.setInterval(() => void refresh(), POLL_MS);
    return () => window.clearInterval(t);
  }, [refresh]);

  useEffect(() => {
    if (!selectedId) return;
    let cancelled = false;
    const load = async () => {
      const data = await call<{ points: TelemetryPoint[] }>("GET", `/api/stations/${selectedId}/telemetry?minutes=90`);
      if (data && !cancelled) setPoints(data.points);
    };
    void load();
    const t = window.setInterval(() => void load(), POLL_MS * 4);
    return () => {
      cancelled = true;
      window.clearInterval(t);
    };
  }, [selectedId, call]);

  const selected = stations?.find((s) => s.id === selectedId) ?? null;

  async function send(req: CommandRequest) {
    if (!selected) return;
    setBusy(req.command);
    const res = await call<CommandResponse>("POST", `/api/stations/${selected.id}/commands`, req);
    setBusy(null);
    if (!res) {
      toast.error(`${req.command} failed`, { description: "The management system did not accept the call." });
      return;
    }
    setLastCommand(res);
    setAudit((a) =>
      [
        `${new Date(res.receivedAt).toLocaleTimeString()} · ${res.command} on ${res.stationId} · ${res.status} · ${res.latencyMs} ms · Mayur`,
        ...a,
      ].slice(0, 12),
    );
    setStations((prev) => prev?.map((s) => (s.id === res.snapshot.id ? res.snapshot : s)) ?? prev);
    if (res.status === "Accepted") toast.success(`${res.command}: accepted`, { description: res.detail });
    else if (res.status === "Scheduled") toast(`${res.command}: scheduled`, { description: res.detail });
    else toast.error(`${res.command}: rejected`, { description: res.detail });
    consoleRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  const fleet = stations ?? [];
  const totalOutput = fleet.reduce((n, s) => n + s.outputKw, 0);
  const totalPv = fleet.reduce((n, s) => n + s.pvKw, 0);
  const avgSoc = fleet.length ? fleet.reduce((n, s) => n + s.batterySoc, 0) / fleet.length : 0;
  const sessions = fleet.reduce((n, s) => n + s.sessionsToday, 0);
  const faults = fleet.reduce((n, s) => n + s.faults.length, 0);

  return (
    <div className="flex flex-col gap-4" id="fleet">
      <div className="flex items-center justify-between gap-3 rounded-lg border border-dashed px-3 py-2">
        <Label htmlFor="daylight-clock" className="text-muted-foreground text-xs">
          Simulated clock at 12:30, so the solar curve is visible at any hour. Switch off to use the real time of day.
        </Label>
        <Switch id="daylight-clock" checked={daylight} onCheckedChange={setDaylight} />
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <FleetKpi icon={Zap} label="EV output now" value={`${totalOutput.toFixed(1)} kW`} loading={!stations} />
        <FleetKpi icon={Sun} label="Solar now" value={`${totalPv.toFixed(1)} kW`} loading={!stations} />
        <FleetKpi icon={BatteryCharging} label="Average battery" value={`${avgSoc.toFixed(0)}%`} loading={!stations} />
        <FleetKpi icon={Activity} label="Sessions today" value={String(sessions)} loading={!stations} />
        <FleetKpi
          icon={RadioTower}
          label="Open faults"
          value={String(faults)}
          tone={faults ? "critical" : "ok"}
          loading={!stations}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {stations
          ? stations.map((s) => (
              <StationCard key={s.id} station={s} selected={s.id === selectedId} onSelect={() => setSelectedId(s.id)} />
            ))
          : [0, 1, 2].map((i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
      </div>

      {selected ? (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <div className="xl:col-span-5">
            <StationStage station={selected} daylight={daylight} />
          </div>
          <div className="xl:col-span-7">
            <EnergyFlow station={selected} />
          </div>
          <div className="flex flex-col gap-4 xl:col-span-8">
            <Card>
              <CardHeader>
                <CardTitle>{selected.name}</CardTitle>
                <CardDescription>
                  Last 90 minutes, one point per minute, read from{" "}
                  <span className="font-mono">/api/stations/{selected.id}/telemetry</span>.
                </CardDescription>
                <CardAction>
                  <ProvenanceBadge kind="simulated" />
                </CardAction>
              </CardHeader>
              <CardContent>
                {points.length ? <StationChart points={points} /> : <Skeleton className="h-64 w-full" />}
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Reading
                    label="Battery"
                    value={`${selected.batterySoc.toFixed(0)}%`}
                    sub={`${selected.batteryKw >= 0 ? "charging" : "discharging"} ${Math.abs(selected.batteryKw).toFixed(1)} kW`}
                  >
                    <Progress value={selected.batterySoc} className="mt-2 h-1.5" />
                  </Reading>
                  <Reading
                    label="Solar"
                    value={`${selected.pvKw.toFixed(1)} kW`}
                    sub={`of ${selected.pvCapacityKw} kW installed`}
                  />
                  <Reading
                    label="Grid import"
                    value={`${selected.gridKw.toFixed(1)} kW`}
                    sub={selected.gridKw > 0 ? "battery below reserve" : "self-sufficient"}
                  />
                  <Reading
                    label="Enclosure"
                    value={`${selected.enclosureTempC.toFixed(0)} °C`}
                    sub={`${selected.energyTodayKwh} kWh today`}
                    icon={ThermometerSun}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Controls</CardTitle>
                <CardDescription>
                  Each button sends one call to{" "}
                  <span className="font-mono">POST /api/stations/{selected.id}/commands</span>. Destructive ones ask
                  first.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => send({ command: "PowerCheck" })} disabled={busy !== null || !selected.online}>
                    <Activity
                      data-icon="inline-start"
                      className={busy === "PowerCheck" ? "animate-pulse" : undefined}
                    />
                    Run power check
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => send({ command: "RemoteStartTransaction", connectorId: 1 })}
                    disabled={busy !== null || !selected.online}
                  >
                    <Play data-icon="inline-start" />
                    Start session, connector 1
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => send({ command: "RemoteStopTransaction", connectorId: 1 })}
                    disabled={busy !== null || !selected.online}
                  >
                    <Square data-icon="inline-start" />
                    Stop session, connector 1
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      send({
                        command: "ChangeAvailability",
                        type: selected.availability === "Operative" ? "Inoperative" : "Operative",
                      })
                    }
                    disabled={busy !== null || !selected.online}
                  >
                    <Power data-icon="inline-start" />
                    {selected.availability === "Operative" ? "Take out of service" : "Return to service"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => send({ command: "GetDiagnostics" })}
                    disabled={busy !== null || !selected.online}
                  >
                    <FileDown data-icon="inline-start" />
                    Pull diagnostics
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" disabled={busy !== null || !selected.online}>
                        <RotateCcw data-icon="inline-start" />
                        Soft reset
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reset {selected.name}?</AlertDialogTitle>
                        <AlertDialogDescription>
                          The station reboots and drops off the network for about 15 seconds. Any running session ends.
                          This is logged against your user.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => send({ command: "Reset", type: "Soft" })}>
                          Reset
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                {lastCommand?.report ? <PowerCheckResult report={lastCommand.report} /> : null}

                <div>
                  <p className="mb-1 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                    Command audit
                  </p>
                  {audit.length ? (
                    <ul className="flex flex-col gap-1 font-mono text-xs">
                      {audit.map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground text-xs">No commands sent this session.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-4 xl:col-span-4" ref={consoleRef}>
            <ApiConsole exchanges={exchanges} />
            <Card>
              <CardHeader>
                <CardTitle>Connectors</CardTitle>
                <CardDescription>
                  {selected.ocppVersion} · firmware {selected.firmware} · heartbeat{" "}
                  {new Date(selected.lastHeartbeat).toLocaleTimeString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>Connector</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Output</TableHead>
                      <TableHead className="text-right">Session</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selected.connectors.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell>
                          <span className="flex items-center gap-1.5">
                            <Cable className="size-4 text-muted-foreground" />
                            {c.id} · {c.type} · {c.maxKw} kW
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={cn("rounded-sm px-1.5 py-0.5", connectorStyle[c.status])}
                          >
                            {c.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">{c.outputKw.toFixed(1)} kW</TableCell>
                        <TableCell className="text-right text-muted-foreground tabular-nums">
                          {c.sessionKwh === null ? "—" : `${c.sessionKwh.toFixed(1)} kWh`}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {selected.faults.length ? (
                  <ul className="mt-3 flex flex-col gap-1 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-xs">
                    {selected.faults.map((f) => (
                      <li key={f} className="text-destructive">
                        {f}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FleetKpi({
  icon: Icon,
  label,
  value,
  tone = "neutral",
  loading,
}: {
  icon: typeof Zap;
  label: string;
  value: string;
  tone?: "neutral" | "ok" | "critical";
  loading: boolean;
}) {
  return (
    <Card size="sm" className="gap-2">
      <CardHeader className="pb-0">
        <CardDescription className="flex items-center gap-1.5 text-xs">
          <Icon className="size-3.5" />
          {label}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-7 w-20" />
        ) : (
          <div
            className={cn(
              "text-2xl tabular-nums leading-none tracking-tight",
              tone === "critical" && "text-destructive",
              tone === "ok" && "text-emerald-700 dark:text-emerald-300",
            )}
          >
            {value}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StationCard({
  station,
  selected,
  onSelect,
}: {
  station: StationSnapshot;
  selected: boolean;
  onSelect: () => void;
}) {
  const worst = station.faults.length
    ? "fault"
    : !station.online
      ? "offline"
      : station.availability === "Inoperative"
        ? "out"
        : "ok";
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "group flex flex-col gap-3 overflow-hidden rounded-xl border bg-card p-4 text-left text-card-foreground transition-colors hover:bg-muted/40 focus-visible:outline-2 focus-visible:outline-ring",
        selected && "border-primary ring-1 ring-primary",
      )}
    >
      <div className="relative -mx-4 -mt-4 mb-1 aspect-[16/6] overflow-hidden bg-muted">
        <Image
          src={covers[station.siteType]}
          alt="Illustrative charging-site setting; not a photograph of this station"
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover"
        />
        <span className="absolute right-2 bottom-2 rounded-sm bg-slate-950/75 px-2 py-1 text-[10px] text-white">
          Illustrative site
        </span>
      </div>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-medium leading-tight">{station.name}</p>
          <p className="font-mono text-muted-foreground text-xs">{station.id}</p>
        </div>
        <Badge
          variant="secondary"
          className={cn(
            "shrink-0 gap-1 rounded-sm px-1.5 py-0.5",
            worst === "ok" && "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
            worst === "fault" && "bg-destructive/10 text-destructive",
            (worst === "offline" || worst === "out") && "bg-muted text-muted-foreground",
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full",
              worst === "ok" ? "bg-emerald-500" : worst === "fault" ? "bg-destructive" : "bg-muted-foreground",
            )}
          />
          {worst === "ok"
            ? "Healthy"
            : worst === "fault"
              ? "Fault"
              : worst === "offline"
                ? "Rebooting"
                : "Out of service"}
        </Badge>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div>
          <p className="text-muted-foreground">Output</p>
          <p className="font-medium tabular-nums">{station.outputKw.toFixed(1)} kW</p>
        </div>
        <div>
          <p className="text-muted-foreground">Solar</p>
          <p className="font-medium tabular-nums">{station.pvKw.toFixed(1)} kW</p>
        </div>
        <div>
          <p className="text-muted-foreground">Battery</p>
          <p className="font-medium tabular-nums">{station.batterySoc.toFixed(0)}%</p>
        </div>
      </div>
      <Progress value={station.batterySoc} className="h-1.5" />
      <div className="flex items-center justify-between">
        <ProvenanceBadge kind={station.provenance} />
        <span className="text-muted-foreground text-xs">{station.sessionsToday} sessions today</span>
      </div>
    </button>
  );
}

function Reading({
  label,
  value,
  sub,
  icon: Icon,
  children,
}: {
  label: string;
  value: string;
  sub: string;
  icon?: typeof Zap;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border bg-muted/30 p-3">
      <p className="flex items-center gap-1 text-muted-foreground text-xs">
        {Icon ? <Icon className="size-3.5" /> : null}
        {label}
      </p>
      <p className="mt-1 text-xl tabular-nums leading-none tracking-tight">{value}</p>
      <p className="mt-1 text-muted-foreground text-xs">{sub}</p>
      {children}
    </div>
  );
}

function PowerCheckResult({ report }: { report: CommandResponse["report"] & object }) {
  const tone = report.health === "pass" ? "emerald" : report.health === "warn" ? "amber" : "destructive";
  return (
    <div className="rounded-lg border">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">Power check</span>
          <Badge
            variant="secondary"
            className={cn(
              "rounded-sm px-1.5 py-0.5",
              tone === "emerald" && "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
              tone === "amber" && "bg-amber-500/10 text-amber-700 dark:text-amber-300",
              tone === "destructive" && "bg-destructive/10 text-destructive",
            )}
          >
            {report.health === "pass" ? "Pass" : report.health === "warn" ? "Warnings" : "Fail"} · {report.score}/100
          </Badge>
        </div>
        <span className="font-mono text-muted-foreground text-xs">
          {new Date(report.ranAt).toLocaleTimeString()} · {report.durationMs} ms
        </span>
      </div>
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Check</TableHead>
            <TableHead>Reading</TableHead>
            <TableHead>Expected</TableHead>
            <TableHead className="w-20">Result</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {report.checks.map((c) => (
            <TableRow key={c.name}>
              <TableCell className="whitespace-normal font-medium">{c.name}</TableCell>
              <TableCell className="tabular-nums">{c.value}</TableCell>
              <TableCell className="whitespace-normal text-muted-foreground text-xs">{c.expected}</TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={cn(
                    "rounded-sm px-1.5 py-0.5",
                    c.result === "pass" && "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
                    c.result === "warn" && "bg-amber-500/10 text-amber-700 dark:text-amber-300",
                    c.result === "fail" && "bg-destructive/10 text-destructive",
                  )}
                >
                  {c.result}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
