"use client";

import { useEffect, useState } from "react";

/**
 * Returns `true` only after the component has mounted on the client.
 *
 * Persisted Zustand stores (session, db, player) hydrate from `localStorage`
 * during the first client render, which can differ from the server render. Gate
 * any session-dependent UI (redirects, "logged in" chrome) on this so the first
 * paint matches the server and avoids hydration warnings.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
