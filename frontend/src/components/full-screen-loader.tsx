import { Loader2 } from "lucide-react";

import { BrandMark } from "@/components/brand";

/** Centered loading splash, shown while stores hydrate or a redirect resolves. */
export function FullScreenLoader() {
  return (
    <div className="flex h-[100dvh] flex-col items-center justify-center gap-4">
      <BrandMark className="size-12 rounded-2xl" />
      <Loader2 className="size-5 animate-spin text-muted-foreground" />
    </div>
  );
}
