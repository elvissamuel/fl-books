"use client";

import { useState } from "react";
import { Bell, Plus, Search } from "lucide-react";
import { AddAdminDialog } from "@/components/administration/add-admin-dialog";
import { AdministrationTable } from "@/components/administration/administration-table";
import { Button } from "@/components/ui/button";
import type { AdminListFilter } from "@/core/administration/types";
import { useStaffAdmins } from "@/features/administration/use-administration";
import { defaultAdminListParams } from "@/infrastructure/administration/administration-api";
import { cn } from "@/lib/utils";

const filters: { id: AdminListFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "inactive", label: "Inactive" },
];

export function AdministrationScreen() {
  const [search, setSearch] = useState(defaultAdminListParams.search);
  const [filter, setFilter] = useState<AdminListFilter>(defaultAdminListParams.filter);
  const [adding, setAdding] = useState(false);
  const { data } = useStaffAdmins({ search, filter });

  return (
    <div className="px-5 pt-5 pb-8">
      <header className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-950">Administration</h1>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            className="h-9 rounded-full px-3.5 text-sm"
            onClick={() => setAdding(true)}
          >
            <Plus className="size-4" />
            Add new admin
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

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative block w-full max-w-[240px]">
          <span className="sr-only">Search books</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search books"
            className="h-10 w-full rounded-lg border border-neutral-200/70 bg-[#f7f7f8] pr-3 pl-9 text-sm text-neutral-800 outline-none placeholder:text-neutral-400 focus:border-brand focus:ring-2 focus:ring-brand/15"
          />
        </label>
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter admins">
          {filters.map((option) => {
            const selected = option.id === filter;
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setFilter(option.id)}
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

      {data ? <AdministrationTable admins={data.items} /> : null}
      {adding ? (
        <AddAdminDialog onClose={() => setAdding(false)} onSaved={() => setAdding(false)} />
      ) : null}
    </div>
  );
}
