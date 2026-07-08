import Link from "next/link";

import { cn } from "@/lib/utils";

/** A section title with an optional description and "see all" link. */
export function SectionHeader({
  title,
  description,
  seeAllHref,
  className,
}: {
  title: string;
  description?: string;
  seeAllHref?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-3 flex items-end justify-between gap-4", className)}>
      <div className="min-w-0">
        <h2 className="font-heading text-lg font-bold">{title}</h2>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {seeAllHref ? (
        <Link
          href={seeAllHref}
          className="shrink-0 text-sm text-muted-foreground hover:text-foreground hover:underline"
        >
          مشاهده همه
        </Link>
      ) : null}
    </div>
  );
}
