"use client";

import { useEffect } from "react";

/**
 * Registers the PWA service worker (production only, to avoid interfering with
 * dev Fast Refresh). Renders nothing.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (
      typeof navigator !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Registration failures are non-fatal for the app.
      });
    }
  }, []);

  return null;
}
