import type { SiteType, StationSnapshot } from "@/app/(main)/dashboard/stations/_components/types";

export type StationStatusKey = "charging" | "healthy" | "fault" | "inoperative" | "offline";

export interface StationStatus {
  key: StationStatusKey;
  label: string;
  /** Marker ring and dot color. Kept as hex so the Leaflet marker HTML can use it directly. */
  color: string;
  badgeClass: string;
}

const STATUS: Record<StationStatusKey, Omit<StationStatus, "key">> = {
  charging: { label: "Charging", color: "#0284c7", badgeClass: "bg-sky-500/10 text-sky-700 dark:text-sky-300" },
  healthy: {
    label: "Available",
    color: "#059669",
    badgeClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  fault: { label: "Fault", color: "#dc2626", badgeClass: "bg-destructive/10 text-destructive" },
  inoperative: {
    label: "Out of service",
    color: "#d97706",
    badgeClass: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
  offline: { label: "Offline", color: "#64748b", badgeClass: "bg-muted text-muted-foreground" },
};

/** One status per station, in priority order: offline beats fault beats out-of-service beats charging. */
export function stationStatus(s: StationSnapshot): StationStatus {
  let key: StationStatusKey = "healthy";
  if (!s.online) key = "offline";
  else if (s.faults.length || s.connectors.some((c) => c.status === "Faulted")) key = "fault";
  else if (s.availability === "Inoperative") key = "inoperative";
  else if (s.connectors.some((c) => c.status === "Charging")) key = "charging";
  return { key, ...STATUS[key] };
}

export const siteTypeLabel: Record<SiteType, string> = {
  commercial: "Commercial site",
  municipal: "Municipal lot",
  "state-park": "State park (DCR)",
  transit: "Transit lot (MBTA)",
  "park-and-ride": "Park-and-ride (MassDOT)",
};

const usdFormat = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const usdCentsFormat = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function usd(value: number, cents = false): string {
  return cents ? usdCentsFormat.format(value) : usdFormat.format(value);
}

export function kwh(value: number): string {
  return `${value.toLocaleString("en-US", { maximumFractionDigits: value >= 100 ? 0 : 1 })} kWh`;
}
