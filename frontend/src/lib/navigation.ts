import {
  Bell,
  Home,
  Library,
  ListMusic,
  Mic2,
  Settings,
  User,
  type LucideIcon,
} from "lucide-react";

import type { Role } from "@/lib/types";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** When set, only these roles see the item. */
  roles?: Role[];
  /** Highlight only on an exact path match (e.g. a dashboard "overview" root). */
  exact?: boolean;
}

/** Primary navigation for the listener/artist app (the sidebar). */
export const MAIN_NAV: NavItem[] = [
  { href: "/home", label: "خانه", icon: Home },
  { href: "/library", label: "آلبوم‌ها و تک‌آهنگ‌ها", icon: Library },
  { href: "/playlists", label: "پلی‌لیست‌ها", icon: ListMusic },
  { href: "/studio", label: "مدیریت آثار", icon: Mic2, roles: ["artist"] },
  { href: "/profile", label: "نمایه من", icon: User },
  { href: "/notifications", label: "اعلانات", icon: Bell },
  { href: "/settings", label: "تنظیمات", icon: Settings },
];

export function navItemsForRole(role: Role): NavItem[] {
  return MAIN_NAV.filter((item) => !item.roles || item.roles.includes(role));
}

/** The landing route for a role after login (staff go to the dashboard). */
export function homeRouteForRole(role: Role): string {
  return role === "support" || role === "admin" ? "/dashboard" : "/home";
}
