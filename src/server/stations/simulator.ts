import type {
  CommandRequest,
  CommandResponse,
  Connector,
  FleetHistory,
  FleetStationStats,
  FleetSummary,
  PowerCheckReport,
  SiteType,
  StationSnapshot,
  TelemetryPoint,
} from "@/app/(main)/dashboard/stations/_components/types";

/**
 * Station simulator. Stands in for the charge station management system (CSMS) that a real
 * deployment would expose over OCPP 1.6J or 2.0.1. Every number here is generated; the only
 * real fact is the Lowell address, which comes from the public filing. The other six sites are
 * placed on public lots of the kind VEH122 buyers have asked for (municipal, DCR, MBTA, MassDOT),
 * so the map shows what a deployed fleet across greater Boston would look like. The point of the
 * module is the shape of the integration: what a power check reads, what a remote command returns,
 * what a day of sessions is worth, and how the dashboard consumes it.
 */

type LiveField =
  | "pvKw"
  | "batterySoc"
  | "batteryKw"
  | "gridKw"
  | "outputKw"
  | "energyTodayKwh"
  | "connectors"
  | "lastHeartbeat"
  | "online"
  | "faults"
  | "enclosureTempC"
  | "revenueTodayUsd"
  | "sessions30d"
  | "energy30dKwh"
  | "revenue30dUsd"
  | "uptime30dPct";

interface StationState {
  base: Omit<StationSnapshot, LiveField>;
  soc: number;
  availability: "Operative" | "Inoperative";
  connectors: Connector[];
  faults: string[];
  resetAt: number | null;
  offlineUntil: number | null;
  sessionsToday: number;
  /** Typical weekday sessions, the anchor for the 30-day history. */
  baseDailySessions: number;
  uptime30dPct: number;
}

const MODEL = "SuryaTech hybrid solar and battery DC charger";

function station(
  id: string,
  base: Omit<
    StationState["base"],
    "id" | "model" | "availability" | "sessionsToday" | "pvCapacityKw" | "batteryCapacityKwh"
  >,
  live: Omit<StationState, "base">,
): [string, StationState] {
  return [
    id,
    {
      base: {
        id,
        model: MODEL,
        availability: "Operative",
        sessionsToday: 0,
        pvCapacityKw: 12,
        batteryCapacityKwh: 120,
        ...base,
      },
      ...live,
    },
  ];
}

const stations: Record<string, StationState> = Object.fromEntries([
  station(
    "ST-LOWELL-01",
    {
      name: "Lowell, 1460 Middlesex Street",
      site: "Mobil fuel site, Lowell MA. Address from the public filing; commissioning status to confirm.",
      town: "Lowell",
      siteType: "commercial",
      buyerHint: "Private site owner",
      lat: 42.6318,
      lng: -71.3395,
      provenance: "public",
      firmware: "4.0.2",
      ocppVersion: "2.0.1",
      tariffUsdPerKwh: 0.39,
    },
    {
      soc: 68,
      availability: "Operative",
      connectors: [
        { id: 1, type: "CCS1", maxKw: 60, status: "Charging", outputKw: 0, sessionKwh: 0 },
        { id: 2, type: "J1772", maxKw: 7.2, status: "Available", outputKw: 0, sessionKwh: null },
      ],
      faults: [],
      resetAt: null,
      offlineUntil: null,
      sessionsToday: 7,
      baseDailySessions: 9,
      uptime30dPct: 99.2,
    },
  ),
  station(
    "ST-SAMPLE-02",
    {
      name: "Newton, city hall lot",
      site: "Illustrative. A town-hall lot with no three-phase service, the case for a non-grid-tied unit.",
      town: "Newton",
      siteType: "municipal",
      buyerHint: "Municipality",
      lat: 42.337,
      lng: -71.2092,
      provenance: "sample",
      firmware: "4.0.2",
      ocppVersion: "2.0.1",
      tariffUsdPerKwh: 0.35,
    },
    {
      soc: 54,
      availability: "Operative",
      connectors: [
        { id: 1, type: "CCS1", maxKw: 60, status: "Available", outputKw: 0, sessionKwh: null },
        { id: 2, type: "J1772", maxKw: 7.2, status: "Charging", outputKw: 0, sessionKwh: 0 },
      ],
      faults: [],
      resetAt: null,
      offlineUntil: null,
      sessionsToday: 4,
      baseDailySessions: 6,
      uptime30dPct: 98.7,
    },
  ),
  station(
    "ST-SAMPLE-03",
    {
      name: "Blue Hills Reservation, Milton",
      site: "Illustrative. A remote DCR park lot of the kind the department requested three times in April 2026.",
      town: "Milton",
      siteType: "state-park",
      buyerHint: "DCR",
      lat: 42.2178,
      lng: -71.093,
      provenance: "sample",
      firmware: "3.9.7",
      ocppVersion: "1.6J",
      tariffUsdPerKwh: 0.35,
    },
    {
      soc: 23,
      availability: "Operative",
      connectors: [
        { id: 1, type: "CCS1", maxKw: 60, status: "Faulted", outputKw: 0, sessionKwh: null },
        { id: 2, type: "J1772", maxKw: 7.2, status: "Available", outputKw: 0, sessionKwh: null },
      ],
      faults: ["Connector 1: GroundFailure reported 02:14. Awaiting site visit.", "Battery SoC below 25% reserve."],
      resetAt: null,
      offlineUntil: null,
      sessionsToday: 1,
      baseDailySessions: 5,
      uptime30dPct: 94.1,
    },
  ),
  station(
    "ST-SAMPLE-04",
    {
      name: "Alewife, Cambridge (MBTA lot)",
      site: "Illustrative. A transit park-and-ride garage lot, the kind of site in the MBTA request BD-26-1206.",
      town: "Cambridge",
      siteType: "transit",
      buyerHint: "MBTA",
      lat: 42.3954,
      lng: -71.1425,
      provenance: "sample",
      firmware: "4.0.2",
      ocppVersion: "2.0.1",
      tariffUsdPerKwh: 0.42,
    },
    {
      soc: 81,
      availability: "Operative",
      connectors: [
        { id: 1, type: "CCS1", maxKw: 60, status: "Charging", outputKw: 0, sessionKwh: 0 },
        { id: 2, type: "J1772", maxKw: 7.2, status: "Charging", outputKw: 0, sessionKwh: 0 },
      ],
      faults: [],
      resetAt: null,
      offlineUntil: null,
      sessionsToday: 11,
      baseDailySessions: 13,
      uptime30dPct: 99.6,
    },
  ),
  station(
    "ST-SAMPLE-05",
    {
      name: "Braintree park-and-ride (MassDOT)",
      site: "Illustrative. A highway park-and-ride lot, the site type in the MassDOT request BD-26-1030.",
      town: "Braintree",
      siteType: "park-and-ride",
      buyerHint: "MassDOT",
      lat: 42.2079,
      lng: -71.0011,
      provenance: "sample",
      firmware: "4.0.2",
      ocppVersion: "2.0.1",
      tariffUsdPerKwh: 0.39,
    },
    {
      soc: 61,
      availability: "Operative",
      connectors: [
        { id: 1, type: "CCS1", maxKw: 60, status: "Available", outputKw: 0, sessionKwh: null },
        { id: 2, type: "J1772", maxKw: 7.2, status: "Available", outputKw: 0, sessionKwh: null },
      ],
      faults: [],
      resetAt: null,
      offlineUntil: null,
      sessionsToday: 6,
      baseDailySessions: 8,
      uptime30dPct: 99.1,
    },
  ),
  station(
    "ST-SAMPLE-06",
    {
      name: "Assembly Row, Somerville (municipal)",
      site: "Illustrative. A municipal surface lot beside a transit stop; out of service today for a scheduled panel swap.",
      town: "Somerville",
      siteType: "municipal",
      buyerHint: "Municipality",
      lat: 42.3926,
      lng: -71.0776,
      provenance: "sample",
      firmware: "4.0.2",
      ocppVersion: "2.0.1",
      tariffUsdPerKwh: 0.42,
    },
    {
      soc: 92,
      availability: "Inoperative",
      connectors: [
        { id: 1, type: "CCS1", maxKw: 60, status: "Unavailable", outputKw: 0, sessionKwh: null },
        { id: 2, type: "J1772", maxKw: 7.2, status: "Unavailable", outputKw: 0, sessionKwh: null },
      ],
      faults: [],
      resetAt: null,
      offlineUntil: null,
      sessionsToday: 0,
      baseDailySessions: 10,
      uptime30dPct: 91.4,
    },
  ),
  station(
    "ST-SAMPLE-07",
    {
      name: "Lynn Shore Reservation (DCR)",
      site: "Illustrative. A beachfront DCR lot with seasonal traffic and no nearby three-phase feed.",
      town: "Lynn",
      siteType: "state-park",
      buyerHint: "DCR",
      lat: 42.4631,
      lng: -70.9366,
      provenance: "sample",
      firmware: "4.0.2",
      ocppVersion: "2.0.1",
      tariffUsdPerKwh: 0.35,
    },
    {
      soc: 47,
      availability: "Operative",
      connectors: [
        { id: 1, type: "CCS1", maxKw: 60, status: "Charging", outputKw: 0, sessionKwh: 0 },
        { id: 2, type: "J1772", maxKw: 7.2, status: "Available", outputKw: 0, sessionKwh: null },
      ],
      faults: [],
      resetAt: null,
      offlineUntil: null,
      sessionsToday: 3,
      baseDailySessions: 5,
      uptime30dPct: 97.8,
    },
  ),
]);

const sessionStartedAt: Record<string, number> = {};

function seededNoise(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/** Solar bell curve for New England in September: sunrise ~06:20, sunset ~19:00, peak around 12:45. */
function pvForMinuteOfDay(minute: number, capacityKw: number, seed: number): number {
  const sunrise = 6.33 * 60;
  const sunset = 19 * 60;
  if (minute < sunrise || minute > sunset) return 0;
  const phase = ((minute - sunrise) / (sunset - sunrise)) * Math.PI;
  const clear = Math.sin(phase) ** 1.4;
  const cloud = 0.82 + 0.18 * Math.sin(minute / 23 + seed) * Math.cos(minute / 7 + seed * 0.5);
  return Math.max(0, Number((capacityKw * clear * cloud).toFixed(2)));
}

function stationSeed(id: string): number {
  return id.split("").reduce((n, c) => n + c.charCodeAt(0), 0);
}

let daylightClock = true;

/** When on, the simulator reads solar at 12:30 plus the real minute hand, so the curve is visible at any hour. */
export function setDaylightClock(on: boolean) {
  daylightClock = on;
}

export function isDaylightClock() {
  return daylightClock;
}

function simMinuteOfDay(at: Date): number {
  const real = at.getHours() * 60 + at.getMinutes() + at.getSeconds() / 60;
  if (!daylightClock) return real;
  return 12 * 60 + 30 + (real % 60) - 60;
}

function computePoint(id: string, state: StationState, at: Date, socOverride?: number): TelemetryPoint {
  const seed = stationSeed(id);
  const minute = simMinuteOfDay(at);
  const pvKw = pvForMinuteOfDay(minute, state.base.pvCapacityKw, seed);

  let outputKw = 0;
  for (const c of state.connectors) {
    if (c.status === "Charging" && state.availability === "Operative") {
      const wobble = 0.9 + 0.1 * seededNoise(Math.floor(minute) + c.id + seed);
      outputKw += Number((c.maxKw * (c.type === "CCS1" ? 0.78 : 0.95) * wobble).toFixed(2));
    }
  }
  const soc = socOverride ?? state.soc;
  const surplus = pvKw - outputKw;
  let batteryKw: number;
  let gridKw = 0;
  if (surplus >= 0) {
    batteryKw = soc >= 98 ? 0 : Number(Math.min(surplus, 10).toFixed(2));
  } else {
    const draw = -surplus;
    const fromBattery = soc > 12 ? Math.min(draw, 50) : 0;
    batteryKw = Number((-fromBattery).toFixed(2));
    gridKw = Number((draw - fromBattery).toFixed(2));
  }
  return { t: at.toISOString(), pvKw, outputKw, batteryKw, batterySoc: Number(soc.toFixed(1)), gridKw };
}

let lastTick = Date.now();

function advance() {
  const now = Date.now();
  const dtHours = Math.min((now - lastTick) / 3_600_000, 0.25);
  lastTick = now;
  for (const [id, s] of Object.entries(stations)) {
    if (s.offlineUntil && now > s.offlineUntil) s.offlineUntil = null;
    const p = computePoint(id, s, new Date(now));
    const deltaSoc = (p.batteryKw * dtHours * 100) / s.base.batteryCapacityKwh;
    s.soc = Math.max(5, Math.min(100, s.soc + deltaSoc));
    for (const c of s.connectors) {
      if (c.status === "Charging") {
        const share = p.outputKw * (c.type === "CCS1" ? 0.9 : 0.1);
        c.outputKw = Number(share.toFixed(2));
        c.sessionKwh = Number(((c.sessionKwh ?? 0) + share * dtHours).toFixed(2));
      } else {
        c.outputKw = 0;
      }
    }
  }
}

const DAY_MS = 86_400_000;

function dayNumber(at: Date): number {
  return Math.floor((at.getTime() - at.getTimezoneOffset() * 60_000) / DAY_MS);
}

/**
 * One past day of sessions for one station, deterministic per station and date so the history
 * does not change between reads. Parks fill on weekends; commuter and municipal lots on weekdays.
 */
function dailyStats(s: StationState, day: number): { sessions: number; energyKwh: number; revenueUsd: number } {
  const seed = stationSeed(s.base.id);
  const dow = new Date(day * DAY_MS).getUTCDay();
  const weekend = dow === 0 || dow === 6;
  const weekendFactor = s.base.siteType === "state-park" ? (weekend ? 1.4 : 0.85) : weekend ? 0.65 : 1.1;
  const noise = seededNoise(day + seed);
  const sessions = Math.max(0, Math.round(s.baseDailySessions * weekendFactor * (0.7 + 0.6 * noise)));
  const energyKwh = Number((sessions * (19 + 9 * seededNoise(day * 3 + seed))).toFixed(1));
  const revenueUsd = Number((energyKwh * s.base.tariffUsdPerKwh).toFixed(2));
  return { sessions, energyKwh, revenueUsd };
}

function energyToday(s: StationState, outputKw: number): number {
  const seed = stationSeed(s.base.id);
  return Number((outputKw * 3.1 + s.sessionsToday * 21.4 + seededNoise(seed) * 9).toFixed(1));
}

function thirtyDay(s: StationState, today: number): { sessions: number; energyKwh: number; revenueUsd: number } {
  let sessions = 0;
  let energyKwh = 0;
  let revenueUsd = 0;
  for (let d = today - 30; d < today; d++) {
    const day = dailyStats(s, d);
    sessions += day.sessions;
    energyKwh += day.energyKwh;
    revenueUsd += day.revenueUsd;
  }
  return { sessions, energyKwh: Number(energyKwh.toFixed(1)), revenueUsd: Number(revenueUsd.toFixed(2)) };
}

export function getSnapshot(id: string): StationSnapshot | null {
  const s = stations[id];
  if (!s) return null;
  advance();
  const now = new Date();
  const p = computePoint(id, s, now);
  const seed = stationSeed(id);
  const online = !s.offlineUntil;
  const energy = energyToday(s, p.outputKw);
  const month = thirtyDay(s, dayNumber(now));
  return {
    ...s.base,
    online,
    lastHeartbeat: online
      ? new Date(now.getTime() - 4000 - seededNoise(now.getMinutes() + seed) * 20000).toISOString()
      : new Date(now.getTime() - 90_000).toISOString(),
    availability: s.availability,
    pvKw: p.pvKw,
    batterySoc: p.batterySoc,
    batteryKw: p.batteryKw,
    gridKw: p.gridKw,
    outputKw: p.outputKw,
    energyTodayKwh: energy,
    sessionsToday: s.sessionsToday,
    revenueTodayUsd: Number((energy * s.base.tariffUsdPerKwh).toFixed(2)),
    sessions30d: month.sessions,
    energy30dKwh: month.energyKwh,
    revenue30dUsd: month.revenueUsd,
    uptime30dPct: s.uptime30dPct,
    enclosureTempC: Number((31 + p.outputKw * 0.12 + seededNoise(seed + now.getHours()) * 3).toFixed(1)),
    connectors: s.connectors.map((c) => ({ ...c })),
    faults: [...s.faults],
  };
}

export function listSnapshots(): StationSnapshot[] {
  return Object.keys(stations)
    .map((id) => getSnapshot(id))
    .filter((s): s is StationSnapshot => s !== null);
}

/** Fleet totals for the operations screens: what is running, what charged today, what it earned. */
export function getFleetSummary(): FleetSummary {
  const snaps = listSnapshots();
  const sum = (f: (s: StationSnapshot) => number) => snaps.reduce((n, s) => n + f(s), 0);
  const round1 = (n: number) => Number(n.toFixed(1));
  const round2 = (n: number) => Number(n.toFixed(2));
  const byStation: FleetStationStats[] = snaps.map((s) => ({
    id: s.id,
    name: s.name,
    town: s.town,
    siteType: s.siteType,
    provenance: s.provenance,
    tariffUsdPerKwh: s.tariffUsdPerKwh,
    sessionsToday: s.sessionsToday,
    energyTodayKwh: s.energyTodayKwh,
    revenueTodayUsd: s.revenueTodayUsd,
    sessions30d: s.sessions30d,
    energy30dKwh: s.energy30dKwh,
    revenue30dUsd: s.revenue30dUsd,
    uptime30dPct: s.uptime30dPct,
  }));
  return {
    readAt: new Date().toISOString(),
    stations: snaps.length,
    online: snaps.filter((s) => s.online).length,
    chargingNow: snaps.filter((s) => s.connectors.some((c) => c.status === "Charging")).length,
    faults: sum((s) => s.faults.length),
    outputKw: round1(sum((s) => s.outputKw)),
    pvKw: round1(sum((s) => s.pvKw)),
    sessionsToday: sum((s) => s.sessionsToday),
    energyTodayKwh: round1(sum((s) => s.energyTodayKwh)),
    revenueTodayUsd: round2(sum((s) => s.revenueTodayUsd)),
    sessions30d: sum((s) => s.sessions30d),
    energy30dKwh: round1(sum((s) => s.energy30dKwh)),
    revenue30dUsd: round2(sum((s) => s.revenue30dUsd)),
    uptime30dPct: snaps.length ? round1(sum((s) => s.uptime30dPct) / snaps.length) : 0,
    byStation,
  };
}

/** Fleet-wide daily sessions, energy and revenue for the last `days` days, today included as live. */
export function getFleetHistory(days: number): FleetHistory {
  const now = new Date();
  const today = dayNumber(now);
  const series = [];
  for (let d = today - days + 1; d <= today; d++) {
    let sessions = 0;
    let energyKwh = 0;
    let revenueUsd = 0;
    for (const s of Object.values(stations)) {
      if (d === today) {
        const p = computePoint(s.base.id, s, now);
        const energy = energyToday(s, p.outputKw);
        sessions += s.sessionsToday;
        energyKwh += energy;
        revenueUsd += energy * s.base.tariffUsdPerKwh;
      } else {
        const day = dailyStats(s, d);
        sessions += day.sessions;
        energyKwh += day.energyKwh;
        revenueUsd += day.revenueUsd;
      }
    }
    series.push({
      date: new Date(d * DAY_MS).toISOString().slice(0, 10),
      sessions,
      energyKwh: Number(energyKwh.toFixed(1)),
      revenueUsd: Number(revenueUsd.toFixed(2)),
    });
  }
  return { days, series };
}

export function getTelemetry(id: string, minutes: number): TelemetryPoint[] {
  const s = stations[id];
  if (!s) return [];
  const now = Date.now();
  const points: TelemetryPoint[] = [];
  let soc = s.soc;
  const per = [] as TelemetryPoint[];
  for (let i = minutes; i >= 0; i--) {
    const at = new Date(now - i * 60_000);
    per.push(computePoint(id, s, at, soc));
  }
  // Walk SoC backwards so the history is consistent with the present value.
  for (let i = per.length - 1; i >= 0; i--) {
    per[i].batterySoc = Number(soc.toFixed(1));
    soc = Math.max(5, Math.min(100, soc - (per[i].batteryKw / 60 / s.base.batteryCapacityKwh) * 100));
  }
  points.push(...per);
  return points;
}

function runPowerCheck(_id: string, snap: StationSnapshot): PowerCheckReport {
  const checks: PowerCheckReport["checks"] = [];
  const mark = (name: string, value: string, expected: string, result: "pass" | "warn" | "fail") =>
    checks.push({ name, value, expected, result });

  mark("Heartbeat", snap.online ? "received" : "missed", "within 60 s", snap.online ? "pass" : "fail");
  mark(
    "Battery state of charge",
    `${snap.batterySoc}%`,
    "above 25% reserve",
    snap.batterySoc >= 40 ? "pass" : snap.batterySoc >= 25 ? "warn" : "fail",
  );
  const pvRatio = snap.pvCapacityKw ? snap.pvKw / snap.pvCapacityKw : 0;
  const hour = daylightClock ? 12 : new Date().getHours();
  const daylight = hour >= 7 && hour <= 18;
  mark(
    "PV production",
    `${snap.pvKw} kW of ${snap.pvCapacityKw} kW`,
    daylight ? "above 20% of capacity in daylight" : "0 kW at night",
    daylight ? (pvRatio >= 0.2 ? "pass" : "warn") : "pass",
  );
  mark("Grid import", `${snap.gridKw} kW`, "0 kW while battery above reserve", snap.gridKw > 0 ? "warn" : "pass");
  const faulted = snap.connectors.filter((c) => c.status === "Faulted").length;
  mark(
    "Connector status",
    faulted ? `${faulted} faulted` : "all reporting",
    "no faulted connectors",
    faulted ? "fail" : "pass",
  );
  mark(
    "Enclosure temperature",
    `${snap.enclosureTempC} °C`,
    "below 45 °C",
    snap.enclosureTempC < 40 ? "pass" : snap.enclosureTempC < 45 ? "warn" : "fail",
  );
  mark("Firmware", snap.firmware, "4.0.x", snap.firmware.startsWith("4.") ? "pass" : "warn");

  const fails = checks.filter((c) => c.result === "fail").length;
  const warns = checks.filter((c) => c.result === "warn").length;
  const score = Math.max(0, 100 - fails * 25 - warns * 8);
  return {
    ranAt: new Date().toISOString(),
    durationMs: 180 + Math.round(seededNoise(Date.now() % 1000) * 240),
    health: fails ? "fail" : warns ? "warn" : "pass",
    score,
    checks,
  };
}

export function runCommand(id: string, req: CommandRequest): CommandResponse | null {
  const s = stations[id];
  if (!s) return null;
  advance();
  const started = Date.now();
  const latency = 90 + Math.round(seededNoise(started % 997) * 320);
  let status: CommandResponse["status"] = "Accepted";
  let detail: string | undefined;
  let report: PowerCheckReport | undefined;

  switch (req.command) {
    case "PowerCheck": {
      const snap = getSnapshot(id);
      if (snap) report = runPowerCheck(id, snap);
      detail =
        "TriggerMessage(MeterValues) and StatusNotification read for every connector, then compared to thresholds.";
      break;
    }
    case "RemoteStartTransaction": {
      const c = s.connectors.find((x) => x.id === (req.connectorId ?? 1));
      if (!c || c.status === "Faulted" || s.availability === "Inoperative") {
        status = "Rejected";
        if (!c) detail = "Unknown connector.";
        else if (c.status === "Faulted") detail = "Connector is faulted.";
        else detail = "Station is inoperative.";
      } else if (c.status === "Charging") {
        status = "Rejected";
        detail = "A transaction is already running on this connector.";
      } else {
        c.status = "Charging";
        c.sessionKwh = 0;
        s.sessionsToday += 1;
        sessionStartedAt[`${id}:${c.id}`] = started;
        detail = `Transaction started on connector ${c.id}.`;
      }
      break;
    }
    case "RemoteStopTransaction": {
      const c = s.connectors.find((x) => x.id === (req.connectorId ?? 1));
      if (c?.status !== "Charging") {
        status = "Rejected";
        detail = "No running transaction on that connector.";
      } else {
        c.status = "Finishing";
        c.outputKw = 0;
        detail = `Transaction stopped. ${c.sessionKwh ?? 0} kWh delivered.`;
        setTimeout(() => {
          c.status = "Available";
          c.sessionKwh = null;
        }, 6000);
      }
      break;
    }
    case "ChangeAvailability": {
      const type = req.type === "Inoperative" ? "Inoperative" : "Operative";
      const charging = s.connectors.some((c) => c.status === "Charging");
      s.availability = type;
      if (type === "Inoperative" && charging) {
        status = "Scheduled";
        detail = "Will take effect when the running transaction ends.";
      } else {
        for (const c of s.connectors) {
          if (c.status !== "Faulted") c.status = type === "Inoperative" ? "Unavailable" : "Available";
        }
        detail = `Station set to ${type}.`;
      }
      break;
    }
    case "Reset": {
      const hard = req.type === "Hard";
      s.offlineUntil = started + (hard ? 45_000 : 15_000);
      s.resetAt = started;
      for (const c of s.connectors) {
        if (c.status === "Charging") {
          c.status = "Available";
          c.sessionKwh = null;
        }
      }
      if (!hard) s.faults = s.faults.filter((f) => !f.startsWith("Connector 1"));
      if (!hard) for (const c of s.connectors) if (c.status === "Faulted") c.status = "Available";
      detail = `${hard ? "Hard" : "Soft"} reset accepted. Station reboots and reconnects in about ${hard ? 45 : 15} seconds.`;
      break;
    }
    case "GetDiagnostics": {
      status = "Accepted";
      detail = `Diagnostics upload scheduled: ${id}-${new Date().toISOString().slice(0, 10)}.log to the CSMS file store.`;
      break;
    }
    case "TriggerMessage": {
      detail = `${req.requestedMessage ?? "Heartbeat"} requested from the station.`;
      break;
    }
  }

  const snapshot = getSnapshot(id) as StationSnapshot;
  return {
    command: req.command,
    stationId: id,
    status,
    latencyMs: latency,
    receivedAt: new Date(started).toISOString(),
    detail,
    report,
    snapshot,
  };
}

export const siteTypes: SiteType[] = ["commercial", "municipal", "state-park", "transit", "park-and-ride"];
