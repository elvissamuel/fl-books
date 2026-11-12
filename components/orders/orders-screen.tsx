"use client";

import { useState } from "react";
import { Bell, ChevronDown, Search } from "lucide-react";
import { BooksPagination } from "@/components/books/books-pagination";
import { OrderEditPanel } from "@/components/orders/order-edit-panel";
import { OrderViewPanel } from "@/components/orders/order-view-panel";
import { OrdersTable, OrdersTableSkeleton } from "@/components/orders/orders-table";
import { Button } from "@/components/ui/button";
import {
  fulfilmentStatuses,
  type FulfilmentStatus,
  type OrderFilterRequest,
} from "@/core/orders/private-api";
import { usePrivateOrders } from "@/features/orders/use-orders";
import { cn } from "@/lib/utils";

const pageSize = 10;

type LogisticsFilter = "all" | "pickup" | "delivery";

const filters: { id: LogisticsFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pickup", label: "Pickup" },
  { id: "delivery", label: "Delivery" },
];

const fulfilmentStatusLabels: Record<FulfilmentStatus, string> = {
  ORDER_PLACED: "Order Placed",
  PACKAGING: "Packaging",
  SHIPPED: "Shipped",
  IN_TRANSIT: "In Transit",
  READY_FOR_PICKUP: "Ready for Pickup",
  READY_FOR_DELIVERY: "Ready for Delivery",
  DELIVERED: "Delivered",
};

function orderQuery(
  page: number,
  search: string,
  filter: LogisticsFilter,
  fulfilmentStatus: FulfilmentStatus | "",
): OrderFilterRequest {
  const query: OrderFilterRequest = {
    page,
    size: pageSize,
    search: search.trim() || undefined,
  };
  if (filter === "pickup") query.logisticsType = "PICK_UP";
  else if (filter === "delivery") query.logisticsType = "DELIVERY";
  if (fulfilmentStatus) query.fulfilmentStatus = fulfilmentStatus;
  return query;
}

export function OrdersScreen() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<LogisticsFilter>("all");
  const [fulfilmentStatus, setFulfilmentStatus] = useState<FulfilmentStatus | "">("");
  const [page, setPage] = useState(1);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const orders = usePrivateOrders(orderQuery(page, search, filter, fulfilmentStatus));
  const pageData = orders.data;
  const rows = Array.isArray(pageData?.data) ? pageData.data : [];

  function updateSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function updateFilter(next: LogisticsFilter) {
    setFilter(next);
    setPage(1);
  }

  function updateFulfilmentStatus(next: string) {
    const status = fulfilmentStatuses.includes(next as FulfilmentStatus)
      ? (next as FulfilmentStatus)
      : "";
    setFulfilmentStatus(status);
    setPage(1);
  }

  return (
    <div className="px-5 pt-5 pb-8">
      <header className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-950">Orders</h1>
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

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative block w-full max-w-[280px]">
          <span className="sr-only">Search orders</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
          <input
            value={search}
            onChange={(event) => updateSearch(event.target.value)}
            placeholder="Search orders"
            className="h-10 w-full rounded-full border border-neutral-200 bg-white pr-4 pl-9 text-sm text-neutral-800 outline-none placeholder:text-neutral-400 focus:border-brand focus:ring-2 focus:ring-brand/15"
          />
        </label>
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter orders">
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
                    ? "border-brand bg-white text-brand"
                    : "border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50",
                )}
              >
                {option.label}
              </button>
            );
          })}
          <label className="relative">
            <span className="sr-only">Fulfilment status</span>
            <select
              value={fulfilmentStatus}
              onChange={(event) => updateFulfilmentStatus(event.target.value)}
              className="h-8 appearance-none rounded-full border border-neutral-200 bg-white pr-8 pl-3 text-xs font-medium text-neutral-700 outline-none"
            >
              <option value="">All statuses</option>
              {fulfilmentStatuses.map((status) => (
                <option key={status} value={status}>
                  {fulfilmentStatusLabels[status]}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-neutral-400" />
          </label>
        </div>
      </div>

      {orders.error instanceof Error ? (
        <p className="mb-3 text-sm text-danger">{orders.error.message}</p>
      ) : null}

      {orders.isLoading ? (
        <OrdersTableSkeleton rows={pageSize} />
      ) : (
        <>
          <OrdersTable
            orders={rows}
            onView={(order) => {
              setEditingId(null);
              setViewingId(order.id);
            }}
            onEdit={(order) => {
              setViewingId(null);
              setEditingId(order.id);
            }}
          />
          {pageData ? (
            <div className="mt-4 flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-neutral-500">
                Page {page} of {Math.max(pageData.totalPage, 1)}
              </p>
              <BooksPagination
                page={page}
                totalPages={Math.max(pageData.totalPage, 1)}
                onPageChange={setPage}
              />
            </div>
          ) : null}
        </>
      )}
      {viewingId ? (
        <OrderViewPanel orderId={viewingId} onClose={() => setViewingId(null)} />
      ) : null}
      {editingId ? (
        <OrderEditPanel orderId={editingId} onClose={() => setEditingId(null)} />
      ) : null}
    </div>
  );
}
