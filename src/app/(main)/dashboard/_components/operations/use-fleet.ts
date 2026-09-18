"use client";

import { useCallback, useEffect, useState } from "react";

import type { StationSnapshot } from "@/app/(main)/dashboard/stations/_components/types";
import { deskFetch } from "@/lib/desk-api/client";

/**
 * Polls GET /api/stations and keeps the latest fleet snapshot. Shared by the overview, the map and
 * the revenue screen so every operations view reads the same numbers at the same moment.
 */
export function useFleet(pollMs = 3000) {
  const [stations, setStations] = useState<StationSnapshot[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [readAt, setReadAt] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await deskFetch("/api/stations", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { readAt: string; stations: StationSnapshot[] };
      setStations(data.stations);
      setReadAt(data.readAt);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "network");
    }
  }, []);

  useEffect(() => {
    void refresh();
    const t = window.setInterval(() => void refresh(), pollMs);
    return () => window.clearInterval(t);
  }, [refresh, pollMs]);

  const replace = useCallback((snapshot: StationSnapshot) => {
    setStations((prev) => prev?.map((s) => (s.id === snapshot.id ? snapshot : s)) ?? prev);
  }, []);

  return { stations, error, readAt, refresh, replace };
}
