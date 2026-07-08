import type { PayoutStatus, TicketStatus } from "@/lib/types";

/** Persian labels + a {@link StatusPill} tone for each status enum. */
export const TICKET_STATUS: Record<
  TicketStatus,
  { label: string; tone: "primary" | "blue" | "muted" }
> = {
  open: { label: "باز", tone: "primary" },
  answered: { label: "پاسخ داده شده", tone: "blue" },
  closed: { label: "بسته شده", tone: "muted" },
};

export const PAYOUT_STATUS: Record<
  PayoutStatus,
  { label: string; tone: "amber" | "green" }
> = {
  pending: { label: "در انتظار پرداخت", tone: "amber" },
  settled: { label: "تسویه شده", tone: "green" },
};
