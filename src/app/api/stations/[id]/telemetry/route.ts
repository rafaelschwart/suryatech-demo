import { NextResponse } from "next/server";

import { stationTelemetry } from "@/lib/desk-api/handlers";

export const dynamic = "force-dynamic";

/** GET /api/stations/:id/telemetry?minutes=60: MeterValues history at one-minute resolution. */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const r = stationTelemetry(id, new URL(request.url).searchParams.get("minutes"));
  return NextResponse.json(r.body, { status: r.status });
}
