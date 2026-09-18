import { NextResponse } from "next/server";

import { fleetSummary } from "@/lib/desk-api/handlers";

export const dynamic = "force-dynamic";

/** GET /api/fleet/summary: fleet totals, today and last 30 days, per station. */
export function GET() {
  const r = fleetSummary();
  return NextResponse.json(r.body, { status: r.status });
}
