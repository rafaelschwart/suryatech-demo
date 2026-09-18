import {
  BookOpen,
  CalendarClock,
  FileCheck2,
  Files,
  Gauge,
  type LucideIcon,
  PackageCheck,
  Radar,
  ShieldCheck,
  Zap,
} from "lucide-react";

export type NavBadge = "new" | "soon" | "phase 2";

export interface NavSubItem {
  id: string;
  title: string;
  url: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

interface NavItemBase {
  id: string;
  title: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

export interface NavMainLinkItem extends NavItemBase {
  url: string;
  subItems?: never;
}

export interface NavMainParentItem extends NavItemBase {
  subItems: NavSubItem[];
}

export type NavMainItem = NavMainLinkItem | NavMainParentItem;

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Response desk",
    items: [
      { id: "overview", title: "Deadline board", url: "/dashboard/overview", icon: CalendarClock },
      { id: "opportunities", title: "Opportunities", url: "/dashboard/opportunities", icon: Radar },
      { id: "assembler", title: "Response assembler", url: "/dashboard/assembler", icon: FileCheck2 },
      { id: "library", title: "Answer library", url: "/dashboard/library", icon: BookOpen },
      { id: "evidence", title: "Evidence register", url: "/dashboard/evidence", icon: ShieldCheck },
      { id: "export", title: "Export pack", url: "/dashboard/export", icon: PackageCheck },
      { id: "documents", title: "Documents", url: "/dashboard/documents", icon: Files },
    ],
  },
  {
    id: 2,
    label: "Stations",
    items: [
      { id: "stations", title: "Power and performance", url: "/dashboard/stations", icon: Zap, badge: "phase 2" },
      { id: "fleet", title: "Fleet overview", url: "/dashboard/stations#fleet", icon: Gauge, badge: "phase 2" },
    ],
  },
];
