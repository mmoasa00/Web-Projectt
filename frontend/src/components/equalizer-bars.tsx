import { cn } from "@/lib/utils";

/**
 * Animated "now playing" indicator — a few bars bouncing to fake a spectrum.
 * Pauses (bars rest at mid-height) when `playing` is false.
 */
export function EqualizerBars({
  playing = true,
  className,
}: {
  playing?: boolean;
  className?: string;
}) {
  const delays = ["0ms", "150ms", "300ms", "450ms"];
  return (
    <span className={cn("flex h-4 items-end gap-0.5", className)} aria-hidden>
      {delays.map((delay, i) => (
        <span
          key={i}
          className={cn(
            "w-0.5 origin-bottom rounded-full bg-primary",
            playing ? "animate-equalize" : "h-1.5",
          )}
          style={playing ? { height: "100%", animationDelay: delay } : undefined}
        />
      ))}
    </span>
  );
}
