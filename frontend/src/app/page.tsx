"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { FullScreenLoader } from "@/components/full-screen-loader";
import { useMounted } from "@/lib/hooks/use-mounted";
import { useCurrentUser } from "@/lib/stores/session-store";

/** Entry point: route to the right surface based on the current session. */
export default function RootPage() {
  const mounted = useMounted();
  const user = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!mounted) return;
    if (!user) {
      router.replace("/login");
    } else if (user.role === "support" || user.role === "admin") {
      router.replace("/dashboard");
    } else {
      router.replace("/home");
    }
  }, [mounted, user, router]);

  return <FullScreenLoader />;
}
