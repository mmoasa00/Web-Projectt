import { cn } from "@/lib/utils";

/** Responsive card grid used by the home, library, artist and playlist pages. */
export function MediaGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
        className,
      )}
    >
      {children}
    </div>
  );
}
