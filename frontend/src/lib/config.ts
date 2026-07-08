/**
 * Subscription tiers, limits and benefits — the single source of truth.
 *
 * The brief (Table 1) defines what each tier may do. Keeping it all here means a
 * change to the tier rules (a new limit, a new perk) is a one-file edit, and the
 * UI/logic everywhere reads from these constants instead of hard-coding numbers.
 */

import type { SubscriptionTier } from "@/lib/types";

export const UNLIMITED = Infinity;

export interface TierBenefits {
  id: SubscriptionTier;
  label: string;
  /** Daily stream cap; `UNLIMITED` for paid tiers. */
  dailyStreamLimit: number;
  /** Maximum number of playlists the user may own. */
  playlistLimit: number;
  /** Can upload/replace a profile photo. */
  canUploadAvatar: boolean;
  /** Can download tracks for offline play (Phase 2 behaviour). */
  canDownload: boolean;
  /** Sees new releases before they are public. */
  earlyAccess: boolean;
  /** Can see per-song listener/stream analytics. */
  canViewStats: boolean;
}

export const TIERS: Record<SubscriptionTier, TierBenefits> = {
  basic: {
    id: "basic",
    label: "پایه (رایگان)",
    dailyStreamLimit: 60,
    playlistLimit: 6,
    canUploadAvatar: false,
    canDownload: false,
    earlyAccess: false,
    canViewStats: false,
  },
  silver: {
    id: "silver",
    label: "نقره‌ای",
    dailyStreamLimit: UNLIMITED,
    playlistLimit: 100,
    canUploadAvatar: true,
    canDownload: true,
    earlyAccess: false,
    canViewStats: false,
  },
  gold: {
    id: "gold",
    label: "طلایی",
    dailyStreamLimit: UNLIMITED,
    playlistLimit: UNLIMITED,
    canUploadAvatar: true,
    canDownload: true,
    earlyAccess: true,
    canViewStats: true,
  },
};

export const TIER_ORDER: SubscriptionTier[] = ["basic", "silver", "gold"];

/** Subscription billing periods (in months) offered at checkout (Phase 2). */
export const BILLING_PERIODS = [1, 3, 6, 12] as const;

/** Genres used across the seed catalog and the artist studio form. */
export const GENRES = [
  "پاپ",
  "راک",
  "سنتی",
  "الکترونیک",
  "هیپ‌هاپ",
  "کلاسیک",
  "جز",
  "فولک",
] as const;

export const ROLE_LABELS: Record<string, string> = {
  listener: "شنونده",
  artist: "هنرمند",
  support: "پشتیبان",
  admin: "مدیر سامانه",
};

export const APP_NAME = "نوا";
