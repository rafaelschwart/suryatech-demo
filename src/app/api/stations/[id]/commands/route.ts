import { NextResponse } from "next/server";

import { stationCommand } from "@/lib/desk-api/handlers";

export const dynamic = "force-dynamic";

/**
 * POST /api/stations/:id/commands
 * Body: { command, connectorId?, type?, requestedMessage? }
 * Mirrors the OCPP call a CSMS would send to the charge point. Every call is logged with who sent it.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const r = stationCommand(id, body);
  return NextResponse.json(r.body, { status: r.status });
}
