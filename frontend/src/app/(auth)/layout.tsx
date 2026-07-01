"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { homeRouteForRole } from "@/lib/navigation";
import { useMounted } from "@/lib/hooks/use-mounted";
import { useCurrentUser } from "@/lib/stores/session-store";

/**
 * Centered shell for the auth screens. Already-signed-in visitors are bounced to
 * their home surface so they don't see the login form.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const mounted = useMounted();
  const user = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (mounted && user) router.replace(homeRouteForRole(user.role));
  }, [mounted, user, router]);

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-4 py-10">
      {/* Soft brand-colored backdrop. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 start-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 end-0 size-[28rem] rounded-full bg-gold/10 blur-3xl"
      />
      <div className="relative w-full max-w-md">{children}</div>
    </div>
  );
}
