import { NextResponse } from "next/server";

import { stationOne } from "@/lib/desk-api/handlers";

export const dynamic = "force-dynamic";

/** GET /api/stations/:id: one station, live. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const r = stationOne(id);
  return NextResponse.json(r.body, { status: r.status });
}
