import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/** Compact metric card used on profiles and dashboards. */
export function StatTile({
  label,
  value,
  icon: Icon,
  className,
}: {
  label: string;
  value: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border bg-card p-4", className)}>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {Icon ? <Icon className="size-4" /> : null}
        {label}
      </div>
      <p className="tabular mt-1 font-heading text-xl font-bold">{value}</p>
    </div>
  );
}
