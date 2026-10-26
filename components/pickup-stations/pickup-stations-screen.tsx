"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Bell, Loader2, Plus, Search } from "lucide-react";
import { BooksPagination } from "@/components/books/books-pagination";
import { AddDeliveryOutletDialog } from "@/components/pickup-stations/add-delivery-outlet-dialog";
import { DeliveryOutletsGrid } from "@/components/pickup-stations/delivery-outlets-grid";
import { LocationAddedDialog } from "@/components/pickup-stations/location-added-dialog";
import { LocationStatusDialog } from "@/components/pickup-stations/location-status-dialog";
import { LocationViewDialog } from "@/components/pickup-stations/location-view-dialog";
import { OutletDeleteDialog } from "@/components/pickup-stations/outlet-delete-dialog";
import { PickupLocationDialog } from "@/components/pickup-stations/pickup-location-dialog";
import { PickupStationsTable } from "@/components/pickup-stations/pickup-stations-table";
import { Button } from "@/components/ui/button";
import type {
  DeliveryOutletStatus,
  PrivateDeliveryOutlet,
} from "@/core/pickup-stations/delivery-outlet-api";
import type { PickupLocation, PickupLocationStatus } from "@/core/pickup-stations/private-api";
import type { PickupStationFilter, PickupStationTab } from "@/core/pickup-stations/types";
import { pickupStationKeys } from "@/features/pickup-stations/query-keys";
import {
  useDeletePrivateDeliveryOutlet,
  useDeletePrivatePickupLocation,
  useDeliveryOutletStatistics,
  usePickupLocationStatistics,
  usePrivateDeliveryOutlet,
  usePrivateDeliveryOutlets,
  usePrivatePickupLocation,
  usePrivatePickupLocations,
  useUpdatePrivateDeliveryOutletStatus,
  useUpdatePrivatePickupLocationStatus,
} from "@/features/pickup-stations/use-pickup-stations";
import { cn } from "@/lib/utils";

const pickupPageSize = 10;
const outletPageSize = 6;

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

type StatusChange = {
  kind: "pickup" | "outlet";
  id: string;
  name: string;
  status: PickupLocationStatus;
};

function apiStatus(filter: PickupStationFilter): PickupLocationStatus | undefined {
  if (filter === "active") return "ACTIVE";
  if (filter === "inactive") return "INACTIVE";
  return undefined;
}

export function PickupStationsScreen() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<PickupStationFilter>("all");
  const [tab, setTab] = useState<PickupStationTab>("pickup");
  const [page, setPage] = useState(1);
  const [addingLocation, setAddingLocation] = useState(false);
  const [addingOutlet, setAddingOutlet] = useState(false);
  const [editOutletRequestId, setEditOutletRequestId] = useState("");
  const [editingOutlet, setEditingOutlet] = useState<PrivateDeliveryOutlet | null>(null);
  const [editLocationRequestId, setEditLocationRequestId] = useState("");
  const [editingLocation, setEditingLocation] = useState<PickupLocation | null>(null);
  const [viewingLocationId, setViewingLocationId] = useState<string | null>(null);
  const [addedKind, setAddedKind] = useState<"pickup" | "outlet" | null>(null);
  const [statusChange, setStatusChange] = useState<StatusChange | null>(null);
  const [pendingOutletDelete, setPendingOutletDelete] = useState<PrivateDeliveryOutlet | null>(null);
  const [actionError, setActionError] = useState("");
  const status = apiStatus(filter);
  const pickup = tab === "pickup";
  const editLocation = usePrivatePickupLocation(editLocationRequestId);
  const editOutlet = usePrivateDeliveryOutlet(editOutletRequestId);
  const stations = usePrivatePickupLocations(
    { page, size: pickupPageSize, searchParams: search, status },
    pickup,
  );
  const outlets = usePrivateDeliveryOutlets(
    { page, size: outletPageSize, searchParams: search, status },
    !pickup,
  );
  const pickupStats = usePickupLocationStatistics(pickup);
  const outletStats = useDeliveryOutletStatistics(!pickup);
  const updatePickupStatus = useUpdatePrivatePickupLocationStatus();
  const updateOutletStatus = useUpdatePrivateDeliveryOutletStatus();
  const deletePickup = useDeletePrivatePickupLocation();
  const deleteOutlet = useDeletePrivateDeliveryOutlet();
  const activeQuery = pickup ? stations : outlets;
  const stats = pickup ? pickupStats.data : outletStats.data;
  const summary = stats
    ? {
        total: "totalLocations" in stats ? stats.totalLocations : stats.totalOutlets,
        active: "activeLocations" in stats ? stats.activeLocations : stats.activeOutlets,
        inactive: "inactiveLocations" in stats ? stats.inactiveLocations : stats.inactiveOutlets,
      }
    : undefined;
  const stationRows = Array.isArray(stations.data?.data) ? stations.data.data : [];
  const outletRows = Array.isArray(outlets.data?.data) ? outlets.data.data : [];
  const totalPages = Math.max(activeQuery.data?.totalPage ?? 1, 1);

  async function refresh() {
    await queryClient.invalidateQueries({ queryKey: pickupStationKeys.all });
  }

  function resetPage() {
    setPage(1);
  }

  function closeLocationDialog() {
    setAddingLocation(false);
    setEditingLocation(null);
    setEditLocationRequestId("");
  }

  useEffect(() => {
    if (!editLocationRequestId || editingLocation) return;

    if (editLocation.data?.id === editLocationRequestId) {
      setEditingLocation(editLocation.data);
      return;
    }

    if (editLocation.error instanceof Error) {
      setActionError(editLocation.error.message);
      setEditLocationRequestId("");
    }
  }, [editLocation.data, editLocation.error, editLocationRequestId, editingLocation]);

  useEffect(() => {
    if (!editOutletRequestId || editingOutlet) return;

    if (editOutlet.data?.id === editOutletRequestId) {
      setEditingOutlet(editOutlet.data);
      return;
    }

    if (editOutlet.error instanceof Error) {
      setActionError(editOutlet.error.message);
      setEditOutletRequestId("");
    }
  }, [editOutlet.data, editOutlet.error, editOutletRequestId, editingOutlet]);

  function removePickup(id: string, name: string) {
    if (!window.confirm(`Delete ${name}?`)) return;
    setActionError("");
    deletePickup.mutateAsync(id).then(() => refresh()).catch((error: unknown) => {
      setActionError(error instanceof Error ? error.message : "Request failed.");
    });
  }

  async function confirmOutletDelete() {
    if (!pendingOutletDelete) return;
    setActionError("");
    try {
      await deleteOutlet.mutateAsync(pendingOutletDelete.id);
      if (outletRows.length === 1 && page > 1) setPage(page - 1);
      setPendingOutletDelete(null);
      await refresh();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Request failed.");
      setPendingOutletDelete(null);
    }
  }

  return (
    <div className="px-5 pt-5 pb-8">
      <header className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-950">Pickup Location</h1>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            className="h-9 rounded-full px-3.5 text-sm"
            onClick={() => {
              if (pickup) setAddingLocation(true);
              else setAddingOutlet(true);
            }}
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
              onClick={() => {
                setTab(option.id);
                resetPage();
              }}
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
          <div key={card.key} className="rounded-xl border border-neutral-200 bg-white px-4 py-3.5">
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
            onChange={(event) => {
              setSearch(event.target.value);
              resetPage();
            }}
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
                onClick={() => {
                  setFilter(option.id);
                  resetPage();
                }}
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

      {activeQuery.error instanceof Error ? (
        <p className="mb-3 text-sm text-danger">{activeQuery.error.message}</p>
      ) : null}
      {actionError ? <p className="mb-3 text-sm text-danger">{actionError}</p> : null}
      {activeQuery.isLoading ? (
        <p className="mb-3 text-sm text-neutral-500">Loading locations…</p>
      ) : null}
      {editLocationRequestId && !editingLocation ? (
        <div
          role="status"
          className="fixed inset-y-0 right-0 left-0 z-40 flex items-center justify-center md:left-[232px]"
        >
          <Loader2 className="size-8 animate-spin text-brand" aria-hidden />
          <span className="sr-only">Loading location</span>
        </div>
      ) : null}
      {editOutletRequestId && !editingOutlet ? (
        <div
          role="status"
          className="fixed inset-y-0 right-0 left-0 z-40 flex items-center justify-center md:left-[232px]"
        >
          <Loader2 className="size-8 animate-spin text-brand" aria-hidden />
          <span className="sr-only">Loading outlet</span>
        </div>
      ) : null}

      {pickup ? (
        <PickupStationsTable
          stations={stationRows}
          onView={(station) => setViewingLocationId(station.id)}
          onEdit={(station) => {
            setActionError("");
            setAddingLocation(false);
            setEditingLocation(null);
            setEditLocationRequestId(station.id);
          }}
          onActivate={(station) =>
            setStatusChange({
              kind: "pickup",
              id: station.id,
              name: station.locationName,
              status: "ACTIVE",
            })
          }
          onDeactivate={(station) =>
            setStatusChange({
              kind: "pickup",
              id: station.id,
              name: station.locationName,
              status: "INACTIVE",
            })
          }
          onDelete={(station) => removePickup(station.id, station.locationName)}
        />
      ) : (
        <DeliveryOutletsGrid
          outlets={outletRows}
          onEdit={(outlet) => {
            setActionError("");
            setAddingOutlet(false);
            setEditingOutlet(null);
            setEditOutletRequestId(outlet.id);
          }}
          onActivate={(outlet) =>
            setStatusChange({
              kind: "outlet",
              id: outlet.id,
              name: outlet.outletName,
              status: "ACTIVE",
            })
          }
          onDeactivate={(outlet) =>
            setStatusChange({
              kind: "outlet",
              id: outlet.id,
              name: outlet.outletName,
              status: "INACTIVE",
            })
          }
          onDelete={setPendingOutletDelete}
        />
      )}

      {activeQuery.data ? (
        <div className="mt-4 flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-neutral-500">
            Page {page} of {totalPages}
          </p>
          <BooksPagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      ) : null}

      {addingOutlet || editingOutlet ? (
        <AddDeliveryOutletDialog
          key={editingOutlet?.id ?? "create"}
          outlet={editingOutlet ?? undefined}
          onClose={() => {
            setAddingOutlet(false);
            setEditingOutlet(null);
            setEditOutletRequestId("");
          }}
          onSaved={() => {
            const created = !editingOutlet;
            setAddingOutlet(false);
            setEditingOutlet(null);
            setEditOutletRequestId("");
            if (created) setAddedKind("outlet");
            void refresh();
          }}
        />
      ) : null}
      {viewingLocationId ? (
        <LocationViewDialog
          locationId={viewingLocationId}
          onClose={() => setViewingLocationId(null)}
        />
      ) : null}
      {addingLocation || editingLocation ? (
        <PickupLocationDialog
          key={editingLocation?.id ?? "create"}
          location={editingLocation ?? undefined}
          onClose={closeLocationDialog}
          onSaved={() => {
            const created = !editingLocation;
            closeLocationDialog();
            if (created) setAddedKind("pickup");
            void refresh();
          }}
        />
      ) : null}
      {addedKind ? (
        <LocationAddedDialog kind={addedKind} onDone={() => setAddedKind(null)} />
      ) : null}
      {pendingOutletDelete ? (
        <OutletDeleteDialog
          name={pendingOutletDelete.outletName}
          pending={deleteOutlet.isPending}
          onClose={() => {
            if (!deleteOutlet.isPending) setPendingOutletDelete(null);
          }}
          onConfirm={() => void confirmOutletDelete()}
        />
      ) : null}
      {statusChange ? (
        <LocationStatusDialog
          name={statusChange.name}
          action={statusChange.status === "ACTIVE" ? "activate" : "deactivate"}
          pending={updatePickupStatus.isPending || updateOutletStatus.isPending}
          onClose={() => setStatusChange(null)}
          onConfirm={() => {
            const change = statusChange;
            setActionError("");
            const task =
              change.kind === "pickup"
                ? updatePickupStatus.mutateAsync({
                    locationId: change.id,
                    status: change.status,
                  })
                : updateOutletStatus.mutateAsync({
                    outletId: change.id,
                    status: change.status as DeliveryOutletStatus,
                  });
            task
              .then(() => {
                setStatusChange(null);
                return refresh();
              })
              .catch((error: unknown) => {
                setStatusChange(null);
                setActionError(error instanceof Error ? error.message : "Request failed.");
              });
          }}
        />
      ) : null}
    </div>
  );
}
