"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Bell, Search } from "lucide-react";
import { BooksPagination } from "@/components/books/books-pagination";
import { CustomerStatusDialog } from "@/components/customers/customer-status-dialog";
import { CustomerViewPanel } from "@/components/customers/customer-view-panel";
import { CustomersTable } from "@/components/customers/customers-table";
import { Button } from "@/components/ui/button";
import type { AdminCustomer } from "@/core/customers/admin-api";
import type { CustomerListFilter } from "@/core/customers/types";
import { customersKeys } from "@/features/customers/query-keys";
import {
  useActivateAdminCustomer,
  useDeactivateAdminCustomer,
  useFilteredAdminCustomers,
} from "@/features/customers/use-admin-customers";
import { cn } from "@/lib/utils";

const pageSize = 10;

const filters: { id: CustomerListFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "inactive", label: "Inactive" },
];

type StatusChange = {
  customer: AdminCustomer;
  action: "activate" | "deactivate";
};

function customerName(customer: AdminCustomer) {
  const name = [customer.firstName, customer.lastName].filter(Boolean).join(" ").trim();
  return name || customer.emailAddress;
}

export function CustomersScreen() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<CustomerListFilter>("all");
  const [page, setPage] = useState(1);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [statusChange, setStatusChange] = useState<StatusChange | null>(null);
  const [actionError, setActionError] = useState("");
  const activateCustomer = useActivateAdminCustomer();
  const deactivateCustomer = useDeactivateAdminCustomer();
  const customers = useFilteredAdminCustomers({
    page,
    size: pageSize,
    filter: {
      searchParam: search.trim() || undefined,
      active: filter === "all" ? undefined : filter === "active",
    },
  });
  const rows = Array.isArray(customers.data?.data) ? customers.data.data : [];
  const totalElements = customers.data?.totalElements ?? 0;
  const totalPages = Math.max(customers.data?.totalPage ?? 1, 1);
  const showPagination = totalElements >= 10;

  function updateSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function updateFilter(next: CustomerListFilter) {
    setFilter(next);
    setPage(1);
  }

  return (
    <div className="px-5 pt-5 pb-8">
      <header className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-950">Customer</h1>
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
          <span className="sr-only">Search books</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
          <input
            value={search}
            onChange={(event) => updateSearch(event.target.value)}
            placeholder="Search books"
            className="h-10 w-full rounded-full border border-neutral-200 bg-white pr-4 pl-9 text-sm text-neutral-800 outline-none placeholder:text-neutral-400 focus:border-brand focus:ring-2 focus:ring-brand/15"
          />
        </label>
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter customers">
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
        </div>
      </div>

      {customers.error instanceof Error ? (
        <p className="mb-3 text-sm text-danger">{customers.error.message}</p>
      ) : null}
      {actionError ? <p className="mb-3 text-sm text-danger">{actionError}</p> : null}
      {customers.isLoading ? <p className="mb-3 text-sm text-neutral-500">Loading customers…</p> : null}

      <CustomersTable
        customers={rows}
        onView={(customer) => setViewingId(customer.customerId)}
        onActivate={(customer) => setStatusChange({ customer, action: "activate" })}
        onDeactivate={(customer) => setStatusChange({ customer, action: "deactivate" })}
      />
      {showPagination ? (
        <div className="mt-4 flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-neutral-500">
            Page {page} of {totalPages}
          </p>
          <BooksPagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      ) : null}
      {viewingId ? (
        <CustomerViewPanel customerId={viewingId} onClose={() => setViewingId(null)} />
      ) : null}
      {statusChange ? (
        <CustomerStatusDialog
          name={customerName(statusChange.customer)}
          action={statusChange.action}
          pending={activateCustomer.isPending || deactivateCustomer.isPending}
          onClose={() => setStatusChange(null)}
          onConfirm={() => {
            const change = statusChange;
            setActionError("");
            const task =
              change.action === "activate"
                ? activateCustomer.mutateAsync(change.customer.customerId)
                : deactivateCustomer.mutateAsync(change.customer.customerId);
            task
              .then(() => {
                setStatusChange(null);
                return queryClient.invalidateQueries({ queryKey: customersKeys.all });
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
