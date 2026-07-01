import { AuthGate } from "@/components/auth-gate";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/sidebar";
import { PlayerBar } from "@/components/player/player-bar";
import { PlayerTransport } from "@/components/player/player-transport";

/**
 * Shell for the listener/artist app: sidebar + header + scrollable content, with
 * the global player pinned to the bottom of the flex column. Staff (support /
 * admin) are redirected to `/dashboard` by the guard.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate allow={["listener", "artist"]}>
      <div className="flex h-[100dvh] flex-col overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
          <AppSidebar />
          <div className="flex flex-1 flex-col overflow-hidden">
            <AppHeader />
            <main className="scrollbar-slim flex-1 overflow-y-auto">
              <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8">{children}</div>
            </main>
          </div>
        </div>
        <PlayerBar />
        <PlayerTransport />
      </div>
    </AuthGate>
  );
}
