"use client";

/**
 * Authentication session (mocked).
 *
 * Phase 1 has no real auth: "logging in" just resolves an account by email from
 * the mock database and remembers its id. Passwords are accepted but ignored.
 * Only the `currentUserId` is persisted; the user object itself always comes
 * from {@link useDb} so profile edits stay reflected everywhere.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { useDb } from "@/lib/stores/db-store";
import type { User } from "@/lib/types";

interface SessionState {
  currentUserId: string | null;
  /** Resolve an account by email and start a session. Returns null if unknown. */
  login: (email: string) => User | null;
  /** Begin a session for a freshly created account (after registration). */
  setCurrentUser: (userId: string) => void;
  logout: () => void;
}

export const useSession = create<SessionState>()(
  persist(
    (set) => ({
      currentUserId: null,

      login: (email) => {
        const user = useDb
          .getState()
          .users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
        if (!user) return null;
        set({ currentUserId: user.id });
        return user;
      },

      setCurrentUser: (userId) => set({ currentUserId: userId }),

      logout: () => set({ currentUserId: null }),
    }),
    { name: "nava-session" },
  ),
);

/**
 * The logged-in user, reactive to both the session and any edits to the account
 * in the database. Returns null when signed out.
 */
export function useCurrentUser(): User | null {
  const currentUserId = useSession((s) => s.currentUserId);
  return useDb((s) =>
    currentUserId ? (s.users.find((u) => u.id === currentUserId) ?? null) : null,
  );
}
