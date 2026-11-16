import { NotificationBell } from "@/components/notifications/notification-bell";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";

export function DashboardScreen() {
  return (
    <div className="px-5 pt-5 pb-8">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-950">Dashboard</h1>
        <NotificationBell />
      </header>
      <DashboardOverview />
    </div>
  );
}
