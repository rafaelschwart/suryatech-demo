import { NextResponse } from "next/server";

import { watcherRun } from "@/lib/desk-api/handlers";

/** POST /api/watcher/run: replays the last verified COMMBUYS search; { simulateNew: true } adds one posting. */
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const r = watcherRun(body);
  return NextResponse.json(r.body, { status: r.status });
}
