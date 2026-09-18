import { NextResponse } from "next/server";

import { stationsList } from "@/lib/desk-api/handlers";

export const dynamic = "force-dynamic";

/** GET /api/stations: live snapshot of every station the CSMS reports. */
export function GET(request: Request) {
  const r = stationsList(new URL(request.url).searchParams.get("clock"));
  return NextResponse.json(r.body, { status: r.status });
}
