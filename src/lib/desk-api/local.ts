import { type ApiResult, stationCommand, stationOne, stationsList, stationTelemetry, watcherRun } from "./handlers";

/**
 * In-browser transport for the desk API. Used only in the static build, where there is no server to
 * answer /api/*. The paths, methods, status codes and payloads are the same ones the route handlers
 * return, so the API console on the Stations screen shows exactly what a real deployment would send.
 * A small artificial round trip keeps the latency column honest about being a network call.
 */
const MIN_LATENCY_MS = 28;
const MAX_LATENCY_MS = 76;

function parseBody(body: BodyInit | null | undefined): unknown {
  if (typeof body !== "string" || body.length === 0) return undefined;
  try {
    return JSON.parse(body);
  } catch {
    return null;
  }
}

function methodNotAllowed(): ApiResult {
  return { status: 405, body: { error: "Method not allowed" } };
}

function route(method: string, url: URL, body: unknown): ApiResult {
  const path = url.pathname.replace(/\/+$/, "");

  if (path === "/api/watcher/run") {
    return method === "POST" ? watcherRun(body) : methodNotAllowed();
  }
  if (path === "/api/stations") {
    return method === "GET" ? stationsList(url.searchParams.get("clock")) : methodNotAllowed();
  }

  const station = /^\/api\/stations\/([^/]+)(?:\/(telemetry|commands))?$/.exec(path);
  if (station) {
    const id = decodeURIComponent(station[1]);
    const sub = station[2];
    if (!sub && method === "GET") return stationOne(id);
    if (sub === "telemetry" && method === "GET") return stationTelemetry(id, url.searchParams.get("minutes"));
    if (sub === "commands" && method === "POST") return stationCommand(id, body);
    return methodNotAllowed();
  }

  return { status: 404, body: { error: `No such endpoint ${path}` } };
}

export async function handleLocally(input: string, init?: RequestInit): Promise<Response> {
  const method = (init?.method ?? "GET").toUpperCase();
  const url = new URL(input, "https://desk.local");
  const result = route(method, url, parseBody(init?.body));

  const wait = MIN_LATENCY_MS + Math.random() * (MAX_LATENCY_MS - MIN_LATENCY_MS);
  await new Promise((resolve) => setTimeout(resolve, wait));

  return new Response(JSON.stringify(result.body), {
    status: result.status,
    headers: { "content-type": "application/json", "x-served-by": "in-browser simulator" },
  });
}
