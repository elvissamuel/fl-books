"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Bell, Plus, Search } from "lucide-react";
import { AdminAccountDialog } from "@/components/administration/add-admin-dialog";
import { AdminStatusDialog } from "@/components/administration/admin-status-dialog";
import { AdministrationTable } from "@/components/administration/administration-table";
import { BooksPagination } from "@/components/books/books-pagination";
import { Button } from "@/components/ui/button";
import type { AdminAccount } from "@/core/auth/admin-api";
import type { AdminListFilter } from "@/core/administration/types";
import {
  useActivateAdminAccount,
  useAdminAccounts,
  useDeactivateAdminAccount,
  useDeleteAdminAccount,
} from "@/features/auth/use-admin-auth";
import { cn } from "@/lib/utils";

const pageSize = 10;

const filters: { id: AdminListFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "inactive", label: "Inactive" },
];

export function AdministrationScreen() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<AdminListFilter>("all");
  const [page, setPage] = useState(1);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusChange, setStatusChange] = useState<{
    admin: AdminAccount;
    action: "activate" | "deactivate";
  } | null>(null);
  const [actionError, setActionError] = useState("");
  const admins = useAdminAccounts({
    page,
    size: pageSize,
    search,
    active: filter === "all" ? undefined : filter === "active",
  });
  const activateAdmin = useActivateAdminAccount();
  const deactivateAdmin = useDeactivateAdminAccount();
  const deleteAdmin = useDeleteAdminAccount();

  async function refresh() {
    await queryClient.invalidateQueries({ queryKey: ["admins"] });
  }

  function runAction(admin: AdminAccount, task: (adminId: string) => Promise<unknown>) {
    setActionError("");
    task(admin.adminId)
      .then(() => refresh())
      .catch((error: unknown) => {
        setActionError(error instanceof Error ? error.message : "Request failed.");
      });
  }

  const pageData = admins.data;
  const rows = Array.isArray(pageData?.data) ? pageData.data : [];

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
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
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
                onClick={() => {
                  setFilter(option.id);
                  setPage(1);
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

      {admins.error instanceof Error ? (
        <p className="mb-3 text-sm text-danger">{admins.error.message}</p>
      ) : null}
      {actionError ? <p className="mb-3 text-sm text-danger">{actionError}</p> : null}
      {admins.isLoading ? <p className="mb-3 text-sm text-neutral-500">Loading admins…</p> : null}

      <AdministrationTable
        admins={rows}
        onEdit={(admin) => setEditingId(admin.adminId)}
        onActivate={(admin) => setStatusChange({ admin, action: "activate" })}
        onDeactivate={(admin) => setStatusChange({ admin, action: "deactivate" })}
        onDelete={(admin) => {
          const name = `${admin.firstName} ${admin.lastName}`.trim();
          if (!window.confirm(`Delete ${name}?`)) return;
          runAction(admin, deleteAdmin.mutateAsync);
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

      {adding ? (
        <AdminAccountDialog
          mode="create"
          onClose={() => setAdding(false)}
          onSaved={() => {
            setAdding(false);
            void refresh();
          }}
        />
      ) : null}
      {statusChange ? (
        <AdminStatusDialog
          name={`${statusChange.admin.firstName} ${statusChange.admin.lastName}`.trim()}
          action={statusChange.action}
          pending={activateAdmin.isPending || deactivateAdmin.isPending}
          onClose={() => setStatusChange(null)}
          onConfirm={() => {
            const { admin, action } = statusChange;
            const task =
              action === "activate" ? activateAdmin.mutateAsync : deactivateAdmin.mutateAsync;
            setActionError("");
            task(admin.adminId)
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
      {editingId ? (
        <AdminAccountDialog
          mode="edit"
          adminId={editingId}
          onClose={() => setEditingId(null)}
          onSaved={() => {
            setEditingId(null);
            void refresh();
            void queryClient.invalidateQueries({ queryKey: ["admin-account", editingId] });
          }}
        />
      ) : null}
    </div>
  );
}
