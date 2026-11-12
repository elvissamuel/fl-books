"use client";

import { useState } from "react";
import { Bell, Plus, Search } from "lucide-react";
import { BooksPagination } from "@/components/books/books-pagination";
import { NewsletterTable, NewsletterTableSkeleton } from "@/components/newsletter/newsletter-table";
import { Button } from "@/components/ui/button";
import { usePrivateNewsletter } from "@/features/newsletter/use-newsletter";
import { exportPrivateNewsletter } from "@/infrastructure/newsletter/newsletter-actions";

const pageSize = 10;

export function NewsletterScreen({ embedded = false }: { embedded?: boolean }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");
  const subscribers = usePrivateNewsletter({
    page,
    size: pageSize,
    search: search.trim() || undefined,
  });
  const pageData = subscribers.data;
  const rows = Array.isArray(pageData?.data) ? pageData.data : [];

  function updateSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  async function exportSubscribers() {
    setExporting(true);
    setExportError("");
    const result = await exportPrivateNewsletter();
    setExporting(false);
    if (!result.ok) {
      if (result.sessionExpired) {
        window.location.assign("/admin/login");
        return;
      }
      setExportError(result.message);
    }
  }

  return (
    <div className={embedded ? undefined : "px-5 pt-5 pb-8"}>
      <header className={embedded ? "mb-4 flex justify-end" : "mb-4 flex items-center justify-between gap-4"}>
        {embedded ? null : (
          <h1 className="text-xl font-semibold tracking-tight text-neutral-950">Newsletter</h1>
        )}
        <div className="flex items-center gap-3">
          <Button
            type="button"
            className="h-9 rounded-full px-3.5 text-sm"
            disabled={exporting}
            onClick={exportSubscribers}
          >
            <Plus className="size-4" />
            {exporting ? "Exporting…" : "Export"}
          </Button>
          {embedded ? null : (
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-9 rounded-full border-neutral-200 bg-white text-neutral-600 shadow-none"
              aria-label="Notifications"
            >
              <Bell className="size-4" strokeWidth={1.75} />
            </Button>
          )}
        </div>
      </header>

      <label className="relative mb-4 block w-full max-w-[280px]">
        <span className="sr-only">Search subscribers</span>
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
        <input
          value={search}
          onChange={(event) => updateSearch(event.target.value)}
          placeholder="Search subscribers"
          className="h-10 w-full rounded-full border border-neutral-200 bg-white pr-4 pl-9 text-sm text-neutral-800 outline-none placeholder:text-neutral-400 focus:border-brand focus:ring-2 focus:ring-brand/15"
        />
      </label>

      {exportError ? <p className="mb-3 text-sm text-danger">{exportError}</p> : null}
      {subscribers.error instanceof Error ? (
        <p className="mb-3 text-sm text-danger">{subscribers.error.message}</p>
      ) : null}

      {subscribers.isLoading ? (
        <NewsletterTableSkeleton rows={pageSize} />
      ) : (
        <>
          <NewsletterTable subscribers={rows} />
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
    </div>
  );
}
