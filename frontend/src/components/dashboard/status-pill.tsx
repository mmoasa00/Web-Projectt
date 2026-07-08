import { cn } from "@/lib/utils";

const TONES = {
  amber: "bg-gold/15 text-gold",
  blue: "bg-chart-3/15 text-chart-3",
  green: "bg-success/15 text-success",
  muted: "bg-muted text-muted-foreground",
  primary: "bg-primary/15 text-primary",
} as const;

/** Small colored status label for tables (ticket / payout state, etc.). */
export function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: keyof typeof TONES;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        TONES[tone],
      )}
    >
      {label}
    </span>
  );
}
