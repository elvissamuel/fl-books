import { Bell, LogOut } from "lucide-react";
import { logoutAdmin } from "@/app/admin/(protected)/logout-action";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { Button } from "@/components/ui/button";

export function DashboardScreen() {
  return (
    <div className="px-5 pt-5 pb-8">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-950">Dashboard</h1>
        <div className="flex items-center gap-3">
          <form action={logoutAdmin}>
            <Button
              type="submit"
              variant="outline"
              className="h-9 rounded-full border-neutral-200 bg-white px-3.5 text-sm font-medium text-neutral-700 shadow-none hover:bg-neutral-50"
            >
              <LogOut className="size-4" strokeWidth={1.75} />
              Log out
            </Button>
          </form>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-9 rounded-full border-neutral-200 bg-white text-neutral-600 shadow-none"
            aria-label="Notifications"
          >
            <Bell className="size-4" strokeWidth={1.75} />
          </Button>
        </div>
      </header>
      <DashboardOverview />
    </div>
  );
}
