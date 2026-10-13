import { Bell } from "lucide-react";
import { FulfillmentCard } from "@/components/dashboard/fulfillment-card";
import { RecentOrdersCard } from "@/components/dashboard/recent-orders-card";
import { RevenueTrendCard } from "@/components/dashboard/revenue-trend-card";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { TopCountriesCard } from "@/components/dashboard/top-countries-card";
import { Button } from "@/components/ui/button";

export function DashboardScreen() {
  return (
    <div className="px-5 pt-5 pb-8">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-950">Dashboard</h1>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-9 rounded-full border-neutral-200 bg-white text-neutral-600 shadow-none"
          aria-label="Notifications"
        >
          <Bell className="size-4" strokeWidth={1.75} />
        </Button>
      </header>
      <div className="flex flex-col gap-4">
        <StatsGrid />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.86fr)]">
          <RevenueTrendCard />
          <div className="flex flex-col gap-4">
            <FulfillmentCard />
            <TopCountriesCard />
          </div>
        </div>
        <RecentOrdersCard />
      </div>
    </div>
  );
}
