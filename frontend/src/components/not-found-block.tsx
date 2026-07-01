import Link from "next/link";
import { SearchX } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";

/** Friendly "missing record" block for client detail pages (album, artist…). */
export function NotFoundBlock({
  title = "یافت نشد",
  description = "موردی که دنبالش بودید وجود ندارد یا حذف شده است.",
  backHref = "/home",
}: {
  title?: string;
  description?: string;
  backHref?: string;
}) {
  return (
    <EmptyState
      icon={SearchX}
      title={title}
      description={description}
      action={
        <Button variant="outline" render={<Link href={backHref} />}>
          بازگشت
        </Button>
      }
    />
  );
}
