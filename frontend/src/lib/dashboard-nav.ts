import { CreditCard, LayoutDashboard, Ticket, UserCheck, Wallet } from "lucide-react";

import type { NavItem } from "@/lib/navigation";
import type { Role } from "@/lib/types";

/**
 * Sections of the support/admin dashboard. Support sees tickets + approvals;
 * the admin additionally sees auditing and subscription/pricing controls.
 */
export const DASHBOARD_NAV: NavItem[] = [
  { href: "/dashboard", label: "نمای کلی", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/tickets", label: "تیکت‌ها", icon: Ticket },
  { href: "/dashboard/approvals", label: "احراز هویت هنرمندان", icon: UserCheck },
  { href: "/dashboard/auditing", label: "حسابرسی", icon: Wallet, roles: ["admin"] },
  {
    href: "/dashboard/subscriptions",
    label: "اشتراک‌ها و قیمت‌ها",
    icon: CreditCard,
    roles: ["admin"],
  },
];

export function dashboardNavForRole(role: Role): NavItem[] {
  return DASHBOARD_NAV.filter((item) => !item.roles || item.roles.includes(role));
}
