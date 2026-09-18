export type ConnectorStatus = "Available" | "Preparing" | "Charging" | "Finishing" | "Faulted" | "Unavailable";

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
