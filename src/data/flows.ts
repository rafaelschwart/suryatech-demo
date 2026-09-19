import {
  Box,
  CalendarClock,
  CircleDollarSign,
  FileCheck2,
  ListChecks,
  type LucideIcon,
  MapPin,
  PackageCheck,
  Radar,
  ShieldCheck,
  SlidersHorizontal,
  Upload,
  Wrench,
} from "lucide-react";

export type FlowId = "ops" | "prep";

export interface FlowStep {
  id: string;
  label: string;
  hint: string;
  href: string;
  icon: LucideIcon;
}

export interface Flow {
  id: FlowId;
  title: string;
  steps: FlowStep[];
}

/**
 * The two processes the desk runs. Every screen sits on one step of one flow and says so under its
 * title; the overview shows both flows with live counts on each step.
 */
export const FLOWS: Record<FlowId, Flow> = {
  ops: {
    id: "ops",
    title: "Project operations",
    steps: [
      { id: "locate", label: "Locate", hint: "Every station on the map", href: "/dashboard/operations", icon: MapPin },
      {
        id: "inspect",
        label: "Inspect",
        hint: "Station performance and equipment",
        href: "/dashboard/operations?view=performance#station-details",
        icon: Box,
      },
      {
        id: "control",
        label: "Control",
        hint: "Power checks and remote commands",
        href: "/dashboard/operations?view=controls#station-details",
        icon: SlidersHorizontal,
      },
      {
        id: "bill",
        label: "Bill",
        hint: "Cars charged and revenue",
        href: "/dashboard/revenue",
        icon: CircleDollarSign,
      },
      {
        id: "maintain",
        label: "Maintain",
        hint: "Faults to work orders",
        href: "/dashboard/work-orders",
        icon: Wrench,
      },
    ],
  },
  prep: {
    id: "prep",
    title: "Package preparation",
    steps: [
      { id: "watch", label: "Watch", hint: "COMMBUYS, every morning", href: "/dashboard/opportunities", icon: Radar },
      { id: "triage", label: "Triage", hint: "Chase, consider or pass", href: "/dashboard/board", icon: ListChecks },
      {
        id: "assemble",
        label: "Assemble",
        hint: "The buyer's format, filled",
        href: "/dashboard/assembler",
        icon: FileCheck2,
      },
      {
        id: "prove",
        label: "Prove",
        hint: "MBE, SDP, MassCEC evidence",
        href: "/dashboard/evidence",
        icon: ShieldCheck,
      },
      {
        id: "export",
        label: "Export",
        hint: "The pack, named their way",
        href: "/dashboard/export",
        icon: PackageCheck,
      },
      {
        id: "submit",
        label: "Submit",
        hint: "A person uploads to COMMBUYS",
        href: "/dashboard/documents",
        icon: Upload,
      },
      {
        id: "report",
        label: "Report",
        hint: "SDP quarterly, MBE renewal",
        href: "/dashboard/deadlines",
        icon: CalendarClock,
      },
    ],
  },
};
