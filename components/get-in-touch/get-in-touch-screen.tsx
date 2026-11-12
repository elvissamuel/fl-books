"use client";

import { useState } from "react";
import { Bell, Search } from "lucide-react";
import { BooksPagination } from "@/components/books/books-pagination";
import { GetInTouchTable, GetInTouchTableSkeleton } from "@/components/get-in-touch/get-in-touch-table";
import { Button } from "@/components/ui/button";
import { usePrivateGetInTouch } from "@/features/get-in-touch/use-get-in-touch";

const pageSize = 10;

export function GetInTouchScreen({ embedded = false }: { embedded?: boolean }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const messages = usePrivateGetInTouch({
    page,
    size: pageSize,
    search: search.trim() || undefined,
  });
  const pageData = messages.data;
  const rows = Array.isArray(pageData?.data) ? pageData.data : [];

  function updateSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  return (
    <div className={embedded ? undefined : "px-5 pt-5 pb-8"}>
      {embedded ? null : (
        <header className="mb-4 flex items-center justify-between gap-4">
          <h1 className="text-xl font-semibold tracking-tight text-neutral-950">Get in Touch</h1>
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
      )}

      <label className="relative mb-4 block w-full max-w-[280px]">
        <span className="sr-only">Search messages</span>
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
        <input
          value={search}
          onChange={(event) => updateSearch(event.target.value)}
          placeholder="Search messages"
          className="h-10 w-full rounded-full border border-neutral-200 bg-white pr-4 pl-9 text-sm text-neutral-800 outline-none placeholder:text-neutral-400 focus:border-brand focus:ring-2 focus:ring-brand/15"
        />
      </label>

      {messages.error instanceof Error ? (
        <p className="mb-3 text-sm text-danger">{messages.error.message}</p>
      ) : null}

      {messages.isLoading ? (
        <GetInTouchTableSkeleton rows={pageSize} />
      ) : (
        <>
          <GetInTouchTable messages={rows} />
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
