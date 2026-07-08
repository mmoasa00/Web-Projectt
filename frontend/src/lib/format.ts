/**
 * Locale-aware formatting helpers.
 *
 * The whole UI is Persian, so numbers, dates and durations are rendered with
 * Persian digits via the built-in `Intl` APIs (no extra dependency, and the
 * Persian/Jalali calendar comes for free with `fa-IR-u-ca-persian`).
 */

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/** Convert the Latin digits inside any string to Persian digits. */
export function toFaDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)]);
}

/** Group a number with Persian digits and thousands separators (۱٬۲۳۴). */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("fa-IR").format(value);
}

/**
 * Compact, human-friendly counts for stats (e.g. ۱٫۲ میلیون شنونده).
 * Falls back to the grouped form for small numbers.
 */
export function formatCompact(value: number): string {
  if (value < 1000) return formatNumber(value);
  return new Intl.NumberFormat("fa-IR", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/** Format a price in Toman, e.g. `۱۲۵٬۰۰۰ تومان`. */
export function formatToman(value: number): string {
  return `${formatNumber(value)} تومان`;
}

/** Seconds → `m:ss` with Persian digits (used by the player and song rows). */
export function formatDuration(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return toFaDigits(`${minutes}:${seconds.toString().padStart(2, "0")}`);
}

/** A full Persian (Jalali) date, e.g. `۱۴ خرداد ۱۴۰۵`. */
export function formatDate(value: string | number | Date): string {
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

/** Short Persian date for tables, e.g. `۱۴۰۵/۰۳/۱۴`. */
export function formatShortDate(value: string | number | Date): string {
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

/** Just the year, e.g. for "released in ۱۴۰۴". */
export function formatYear(value: string | number | Date): string {
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
  }).format(new Date(value));
}

/** Coarse "x ago" label for notifications and tickets. */
export function formatRelative(value: string | number | Date): string {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.round(diffMs / 60000);
  const rtf = new Intl.RelativeTimeFormat("fa-IR", { numeric: "auto" });

  if (minutes < 1) return "همین حالا";
  if (minutes < 60) return rtf.format(-minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (hours < 24) return rtf.format(-hours, "hour");
  const days = Math.round(hours / 24);
  if (days < 30) return rtf.format(-days, "day");
  return formatDate(date);
}
