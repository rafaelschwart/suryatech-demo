import { NextResponse } from "next/server";

import { fleetHistory } from "@/lib/desk-api/handlers";

export const dynamic = "force-dynamic";

/** GET /api/fleet/history?days=30: daily sessions, energy and revenue across the fleet. */
export function GET(request: Request) {
  const r = fleetHistory(new URL(request.url).searchParams.get("days"));
  return NextResponse.json(r.body, { status: r.status });
}
