"use client";

import { useState } from "react";
import { Bell, Plus, Search } from "lucide-react";
import { BooksPagination } from "@/components/books/books-pagination";
import { AddDeliveryOutletDialog } from "@/components/pickup-stations/add-delivery-outlet-dialog";
import { LocationAddedDialog } from "@/components/pickup-stations/location-added-dialog";
import { DeliveryOutletsGrid } from "@/components/pickup-stations/delivery-outlets-grid";
import { PickupStationsTable } from "@/components/pickup-stations/pickup-stations-table";
import { Button } from "@/components/ui/button";
import type { PickupStationFilter, PickupStationTab } from "@/core/pickup-stations/types";
import {
  useDeliveryOutlets,
  usePickupStations,
} from "@/features/pickup-stations/use-pickup-stations";
import {
  defaultDeliveryOutletListParams,
  defaultPickupStationListParams,
} from "@/infrastructure/pickup-stations/pickup-stations-api";
import { cn } from "@/lib/utils";

const tabs: { id: PickupStationTab; label: string }[] = [
  { id: "pickup", label: "Pickup Location" },
  { id: "delivery", label: "Delivery Outlet" },
];

const filters: { id: PickupStationFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "inactive", label: "Inactive" },
];

const summaryCards = [
  { key: "total", label: "Total location" },
  { key: "active", label: "Active location" },
  { key: "inactive", label: "Inactive Location" },
] as const;

export function PickupStationsScreen() {
  const [search, setSearch] = useState(defaultPickupStationListParams.search);
  const [filter, setFilter] = useState<PickupStationFilter>(defaultPickupStationListParams.filter);
  const [tab, setTab] = useState<PickupStationTab>(defaultPickupStationListParams.tab);
  const [page, setPage] = useState(defaultPickupStationListParams.page);
  const [addingOutlet, setAddingOutlet] = useState(false);
  const [outletAdded, setOutletAdded] = useState(false);
  const stations = usePickupStations(
    {
      search,
      filter,
      tab: "pickup",
      page,
      pageSize: defaultPickupStationListParams.pageSize,
    },
    tab === "pickup",
  );
  const outlets = useDeliveryOutlets(
    {
      search,
      filter,
      page,
      pageSize: defaultDeliveryOutletListParams.pageSize,
    },
    tab === "delivery",
  );
  const summary = tab === "delivery" ? outlets.data?.summary : stations.data?.summary;
  const list = tab === "delivery" ? outlets.data : stations.data;

  function restorePage(nextSearch: string, nextFilter: PickupStationFilter) {
    setPage(nextSearch.trim() === "" && nextFilter === "all" ? defaultPickupStationListParams.page : 1);
  }

  function updateSearch(value: string) {
    setSearch(value);
    restorePage(value, filter);
  }

  function updateFilter(next: PickupStationFilter) {
    setFilter(next);
    restorePage(search, next);
  }

  function updateTab(next: PickupStationTab) {
    setTab(next);
    restorePage(search, filter);
  }

  return (
    <div className="px-5 pt-5 pb-8">
      <header className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-950">Pickup Location</h1>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            className="h-9 rounded-full px-3.5 text-sm"
            onClick={() => setAddingOutlet(true)}
          >
            <Plus className="size-4" />
            Add new location
          </Button>
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

      <div className="mb-4 flex items-center gap-2" role="tablist" aria-label="Location type">
        {tabs.map((option) => {
          const selected = option.id === tab;
          return (
            <button
              key={option.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => updateTab(option.id)}
              className={cn(
                "h-8 rounded-lg border px-3 text-xs font-medium",
                selected
                  ? "border-[#d7f0e2] bg-[#eef8f2] text-[#3caf6e]"
                  : "border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        {summaryCards.map((card) => (
          <div
            key={card.key}
            className="rounded-xl border border-neutral-200 bg-white px-4 py-3.5"
          >
            <p className="text-xs text-neutral-400">{card.label}</p>
            <p className="mt-2 text-[28px] leading-none font-semibold tracking-tight text-neutral-950">
              {summary?.[card.key] ?? 0}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative block w-full max-w-[280px]">
          <span className="sr-only">Search books</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
          <input
            value={search}
            onChange={(event) => updateSearch(event.target.value)}
            placeholder="Search books"
            className="h-10 w-full rounded-full border border-neutral-200 bg-white pr-4 pl-9 text-sm text-neutral-800 outline-none placeholder:text-neutral-400 focus:border-brand focus:ring-2 focus:ring-brand/15"
          />
        </label>
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter locations">
          {filters.map((option) => {
            const selected = option.id === filter;
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={selected}
                onClick={() => updateFilter(option.id)}
                className={cn(
                  "h-8 rounded-full border px-3 text-xs font-medium",
                  selected
                    ? "border-[#d7f0e2] bg-[#eef8f2] text-[#3caf6e]"
                    : "border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50",
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {list ? (
        <>
          {tab === "delivery" && outlets.data ? (
            <DeliveryOutletsGrid outlets={outlets.data.items} />
          ) : null}
          {tab === "pickup" && stations.data ? (
            <PickupStationsTable stations={stations.data.items} />
          ) : null}
          <div className="mt-4 flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-neutral-500">
              Page {list.page} of {list.totalPages}
            </p>
            <BooksPagination page={list.page} totalPages={list.totalPages} onPageChange={setPage} />
          </div>
        </>
      ) : null}
      {addingOutlet ? (
        <AddDeliveryOutletDialog
          onClose={() => setAddingOutlet(false)}
          onSaved={() => {
            setAddingOutlet(false);
            setOutletAdded(true);
          }}
        />
      ) : null}
      {outletAdded ? <LocationAddedDialog onDone={() => setOutletAdded(false)} /> : null}
    </div>
  );
}
