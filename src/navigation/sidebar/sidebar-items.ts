import {
  BookOpen,
  CalendarClock,
  CircleDollarSign,
  FileCheck2,
  Files,
  LayoutDashboard,
  type LucideIcon,
  MapPin,
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

/**
 * Two halves of the business. Project operations: where the stations are and what they do.
 * Package preparation: what VEH122 asks for and what is due. The overview shows both.
 */
export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    items: [{ id: "overview", title: "Overview", url: "/dashboard/overview", icon: LayoutDashboard }],
  },
  {
    id: 2,
    label: "Project operations",
    items: [
      { id: "operations", title: "Locations map", url: "/dashboard/operations", icon: MapPin, badge: "phase 2" },
      { id: "stations", title: "Power and performance", url: "/dashboard/stations", icon: Zap, badge: "phase 2" },
      {
        id: "revenue",
        title: "Sessions and revenue",
        url: "/dashboard/revenue",
        icon: CircleDollarSign,
        badge: "phase 2",
      },
    ],
  },
  {
    id: 3,
    label: "Package preparation",
    items: [
      { id: "deadlines", title: "Deadline board", url: "/dashboard/deadlines", icon: CalendarClock },
      { id: "opportunities", title: "Opportunities", url: "/dashboard/opportunities", icon: Radar },
      { id: "assembler", title: "Response assembler", url: "/dashboard/assembler", icon: FileCheck2 },
      { id: "library", title: "Answer library", url: "/dashboard/library", icon: BookOpen },
      { id: "evidence", title: "Evidence register", url: "/dashboard/evidence", icon: ShieldCheck },
      { id: "export", title: "Export pack", url: "/dashboard/export", icon: PackageCheck },
      { id: "documents", title: "Documents", url: "/dashboard/documents", icon: Files },
    ],
  },
];
