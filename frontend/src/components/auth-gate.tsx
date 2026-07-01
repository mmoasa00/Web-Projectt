"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { FullScreenLoader } from "@/components/full-screen-loader";
import { useMounted } from "@/lib/hooks/use-mounted";
import { useCurrentUser } from "@/lib/stores/session-store";
import type { Role } from "@/lib/types";

/** Where a role lands when it isn't allowed on the current route. */
function fallbackFor(role: Role): string {
  return role === "support" || role === "admin" ? "/dashboard" : "/home";
}

/**
 * Client-side route guard for the mock.
 *
 * Redirects signed-out visitors to `/login` and users whose role isn't in
 * `allow` to their home surface. Rendering is gated on {@link useMounted} so the
 * first paint matches the server (the session only exists after hydration).
 */
export function AuthGate({
  children,
  allow,
}: {
  children: React.ReactNode;
  allow?: Role[];
}) {
  const mounted = useMounted();
  const user = useCurrentUser();
  const router = useRouter();

  const allowed = !allow || (user ? allow.includes(user.role) : false);

  useEffect(() => {
    if (!mounted) return;
    if (!user) {
      router.replace("/login");
    } else if (!allowed) {
      router.replace(fallbackFor(user.role));
    }
  }, [mounted, user, allowed, router]);

  if (!mounted || !user || !allowed) {
    return <FullScreenLoader />;
  }
  return <>{children}</>;
}
