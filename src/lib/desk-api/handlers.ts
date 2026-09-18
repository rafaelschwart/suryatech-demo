import type { CommandRequest } from "@/app/(main)/dashboard/stations/_components/types";
import { opportunities, watcherQueries } from "@/data/opportunities";
import {
  getFleetHistory,
  getFleetSummary,
  getSnapshot,
  getTelemetry,
  isDaylightClock,
  listSnapshots,
  runCommand,
  setDaylightClock,
} from "@/server/stations/simulator";

/**
 * The desk API, as pure functions. The Next.js route handlers under src/app/api wrap these for a
 * server deployment; the in-browser adapter in ./local.ts wraps the same functions for the static
 * demo on GitHub Pages. One implementation, two transports, identical payloads.
 */
export interface ApiResult {
  status: number;
  body: unknown;
}

const ALLOWED_COMMANDS = new Set([
  "PowerCheck",
  "RemoteStartTransaction",
  "RemoteStopTransaction",
  "ChangeAvailability",
  "Reset",
  "GetDiagnostics",
  "TriggerMessage",
]);

/** GET /api/stations?clock=daylight|live */
export function stationsList(clock: string | null): ApiResult {
  if (clock === "daylight") setDaylightClock(true);
  if (clock === "live") setDaylightClock(false);
  return {
    status: 200,
    body: {
      readAt: new Date().toISOString(),
      clock: isDaylightClock() ? "daylight" : "live",
      stations: listSnapshots(),
    },
  };
}

/** GET /api/stations/:id */
export function stationOne(id: string): ApiResult {
  const snapshot = getSnapshot(id);
  if (!snapshot) return { status: 404, body: { error: `Unknown station ${id}` } };
  return { status: 200, body: { readAt: new Date().toISOString(), station: snapshot } };
}

/** GET /api/stations/:id/telemetry?minutes=60 */
export function stationTelemetry(id: string, minutesRaw: string | null): ApiResult {
  if (!getSnapshot(id)) return { status: 404, body: { error: `Unknown station ${id}` } };
  const minutes = Math.min(Math.max(Number(minutesRaw ?? 60), 5), 720);
  return { status: 200, body: { stationId: id, minutes, points: getTelemetry(id, minutes) } };
}

/** GET /api/fleet/summary */
export function fleetSummary(): ApiResult {
  return { status: 200, body: getFleetSummary() };
}

/** GET /api/fleet/history?days=30 */
export function fleetHistory(daysRaw: string | null): ApiResult {
  const days = Math.min(Math.max(Math.round(Number(daysRaw ?? 30)) || 30, 7), 90);
  return { status: 200, body: getFleetHistory(days) };
}

/** POST /api/stations/:id/commands */
export function stationCommand(id: string, body: unknown): ApiResult {
  const req = body as CommandRequest | null;
  if (!req || typeof req !== "object" || !ALLOWED_COMMANDS.has(req.command)) {
    return { status: 400, body: { error: "Unknown or missing command." } };
  }
  const result = runCommand(id, req);
  if (!result) return { status: 404, body: { error: `Unknown station ${id}` } };
  return { status: 200, body: result };
}

/**
 * POST /api/watcher/run. In production this job runs on a schedule, submits the COMMBUYS public bid
 * search for each query variant (no account, no credentials), diffs the result against known bid
 * numbers, and re-reads every open bid page for new amendments. Here it returns the last verified
 * result set so the screen can show the flow end to end.
 */
export function watcherRun(body: unknown): ApiResult {
  const { simulateNew } = (body ?? {}) as { simulateNew?: boolean };
  const known = opportunities.map((o) => o.bidNumber);
  const found = [...known];
  const newBids: { bidNumber: string; buyer: string; title: string; closes: string }[] = [];

  if (simulateNew) {
    newBids.push({
      bidNumber: "BD-27-1020-DCRCU-DC250-SIMULATED",
      buyer: "Department of Conservation and Recreation",
      title: "VEH122 DCR fleet EV charging station, simulated posting for the demo",
      closes: "2026-10-30",
    });
  }

  return {
    status: 200,
    body: {
      ranAt: new Date().toISOString(),
      source: "COMMBUYS public bid search, Bid Solicitations",
      credentialsUsed: false,
      queries: watcherQueries,
      known: known.length,
      found: found.length + newBids.length,
      newBids,
      amendmentsChecked: opportunities.filter((o) => o.status === "open" || o.status === "opened").length,
    },
  };
}
