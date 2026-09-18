export type ConnectorStatus = "Available" | "Preparing" | "Charging" | "Finishing" | "Faulted" | "Unavailable";

export type SiteType = "commercial" | "municipal" | "state-park" | "transit" | "park-and-ride";

export interface Connector {
  id: number;
  type: "CCS1" | "J1772";
  maxKw: number;
  status: ConnectorStatus;
  outputKw: number;
  sessionKwh: number | null;
}

export interface StationSnapshot {
  id: string;
  name: string;
  site: string;
  town: string;
  siteType: SiteType;
  buyerHint: string;
  lat: number;
  lng: number;
  provenance: "public" | "sample";
  model: string;
  firmware: string;
  ocppVersion: "1.6J" | "2.0.1";
  online: boolean;
  lastHeartbeat: string;
  availability: "Operative" | "Inoperative";
  pvKw: number;
  pvCapacityKw: number;
  batterySoc: number;
  batteryKw: number;
  batteryCapacityKwh: number;
  gridKw: number;
  outputKw: number;
  energyTodayKwh: number;
  sessionsToday: number;
  tariffUsdPerKwh: number;
  revenueTodayUsd: number;
  sessions30d: number;
  energy30dKwh: number;
  revenue30dUsd: number;
  uptime30dPct: number;
  enclosureTempC: number;
  connectors: Connector[];
  faults: string[];
}

export interface TelemetryPoint {
  t: string;
  pvKw: number;
  outputKw: number;
  batteryKw: number;
  batterySoc: number;
  gridKw: number;
}

export interface FleetDay {
  date: string;
  sessions: number;
  energyKwh: number;
  revenueUsd: number;
}

export interface FleetStationStats {
  id: string;
  name: string;
  town: string;
  siteType: SiteType;
  provenance: "public" | "sample";
  tariffUsdPerKwh: number;
  sessionsToday: number;
  energyTodayKwh: number;
  revenueTodayUsd: number;
  sessions30d: number;
  energy30dKwh: number;
  revenue30dUsd: number;
  uptime30dPct: number;
}

export interface FleetSummary {
  readAt: string;
  stations: number;
  online: number;
  chargingNow: number;
  faults: number;
  outputKw: number;
  pvKw: number;
  sessionsToday: number;
  energyTodayKwh: number;
  revenueTodayUsd: number;
  sessions30d: number;
  energy30dKwh: number;
  revenue30dUsd: number;
  uptime30dPct: number;
  byStation: FleetStationStats[];
}

export interface FleetHistory {
  days: number;
  series: FleetDay[];
}

export type CommandName =
  | "PowerCheck"
  | "RemoteStartTransaction"
  | "RemoteStopTransaction"
  | "ChangeAvailability"
  | "Reset"
  | "GetDiagnostics"
  | "TriggerMessage";

export interface CommandRequest {
  command: CommandName;
  connectorId?: number;
  type?: "Operative" | "Inoperative" | "Soft" | "Hard";
  requestedMessage?: "Heartbeat" | "StatusNotification" | "MeterValues";
}

export interface PowerCheckReport {
  ranAt: string;
  durationMs: number;
  health: "pass" | "warn" | "fail";
  score: number;
  checks: { name: string; value: string; expected: string; result: "pass" | "warn" | "fail" }[];
}

export interface CommandResponse {
  command: CommandName;
  stationId: string;
  status: "Accepted" | "Rejected" | "Scheduled";
  latencyMs: number;
  receivedAt: string;
  detail?: string;
  report?: PowerCheckReport;
  snapshot: StationSnapshot;
}
