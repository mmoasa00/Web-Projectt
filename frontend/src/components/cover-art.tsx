import { cn } from "@/lib/utils";
import { coverGradient, coverInitial } from "@/lib/cover";

/**
 * Square generative cover for albums, songs and playlists. Renders a seeded
 * gradient with a faint initial of the title so items stay visually distinct.
 */
export function CoverArt({
  seed,
  label,
  className,
  rounded = "rounded-xl",
}: {
  seed: string;
  label?: string;
  className?: string;
  rounded?: string;
}) {
  return (
    <div
      style={coverGradient(seed)}
      className={cn(
        "relative flex aspect-square items-center justify-center overflow-hidden shadow-sm",
        rounded,
        className,
      )}
      aria-hidden
    >
      {label ? (
        <span className="select-none font-heading text-4xl font-bold text-white/25">
          {coverInitial(label)}
        </span>
      ) : null}
      {/* Subtle sheen so flat gradients feel a little more like artwork. */}
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/15 via-transparent to-white/10" />
    </div>
  );
}
