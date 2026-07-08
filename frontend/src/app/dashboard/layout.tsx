import { AuthGate } from "@/components/auth-gate";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

/** Support/admin dashboard shell — role-gated, no music player. */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate allow={["support", "admin"]}>
      <div className="flex h-[100dvh] overflow-hidden">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader />
          <main className="scrollbar-slim flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8">{children}</div>
          </main>
        </div>
      </div>
    </AuthGate>
  );
}
