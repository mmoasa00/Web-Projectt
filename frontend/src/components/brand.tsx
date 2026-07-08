import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/config";

/** The Nava logo mark (matches `public/icon.svg`). */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
        <rect x="3" y="9.5" width="2.4" height="5" rx="1.2" />
        <rect x="8" y="6" width="2.4" height="12" rx="1.2" />
        <rect x="13" y="7.5" width="2.4" height="9" rx="1.2" />
        <rect x="18" y="10" width="2.4" height="4" rx="1.2" />
      </svg>
    </span>
  );
}

/** Logo mark + wordmark. */
export function Brand({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <BrandMark />
      <span className="font-heading text-lg font-bold tracking-tight">{APP_NAME}</span>
    </span>
  );
}
