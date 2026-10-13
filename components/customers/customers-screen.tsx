"use client";

import { useState } from "react";
import { Bell, Search } from "lucide-react";
import { BooksPagination } from "@/components/books/books-pagination";
import { CustomerViewPanel } from "@/components/customers/customer-view-panel";
import { CustomersTable } from "@/components/customers/customers-table";
import { Button } from "@/components/ui/button";
import type { CustomerListFilter } from "@/core/customers/types";
import { useCustomers } from "@/features/customers/use-customers";
import { defaultCustomerListParams } from "@/infrastructure/customers/customers-api";
import { cn } from "@/lib/utils";

const filters: { id: CustomerListFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "inactive", label: "Inactive" },
];

export function CustomersScreen() {
  const [search, setSearch] = useState(defaultCustomerListParams.search);
  const [filter, setFilter] = useState<CustomerListFilter>(defaultCustomerListParams.filter);
  const [page, setPage] = useState(defaultCustomerListParams.page);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const { data } = useCustomers({
    search,
    filter,
    page,
    pageSize: defaultCustomerListParams.pageSize,
  });

  function updateSearch(value: string) {
    setSearch(value);
    setPage(value.trim() === "" && filter === "all" ? defaultCustomerListParams.page : 1);
  }

  function updateFilter(next: CustomerListFilter) {
    setFilter(next);
    setPage(next === "all" && search.trim() === "" ? defaultCustomerListParams.page : 1);
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

      {data ? (
        <>
          <CustomersTable
            customers={data.items}
            onView={(customer) => setViewingId(customer.id)}
          />
          <div className="mt-4 flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-neutral-500">
              Page {data.page} of {data.totalPages}
            </p>
            <BooksPagination
              page={data.page}
              totalPages={data.totalPages}
              onPageChange={setPage}
            />
          </div>
        </>
      ) : null}
      {viewingId ? (
        <CustomerViewPanel customerId={viewingId} onClose={() => setViewingId(null)} />
      ) : null}
    </div>
  );
}
