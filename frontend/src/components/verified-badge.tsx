import { BadgeCheck } from "lucide-react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/** The "verified artist" mark shown next to approved artists' names. */
export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <span className={cn("inline-flex text-primary", className)} aria-label="هنرمند تایید شده" />
        }
      >
        <BadgeCheck className="size-4" />
      </TooltipTrigger>
      <TooltipContent>هنرمند تایید شده</TooltipContent>
    </Tooltip>
  );
}
