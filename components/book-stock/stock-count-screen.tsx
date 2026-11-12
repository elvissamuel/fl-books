"use client";

import { useState } from "react";
import { Bell, Search } from "lucide-react";
import { BooksPagination } from "@/components/books/books-pagination";
import { AddStockPanel, StockDetailPanel } from "@/components/book-stock/stock-panels";
import { StockCountTable, StockCountTableSkeleton } from "@/components/book-stock/stock-count-table";
import { Button } from "@/components/ui/button";
import type { BookStockCount } from "@/core/books/stock-api";
import { usePrivateBookStock } from "@/features/book-stock/use-book-stock";

const pageSize = 10;

export function StockCountScreen() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [adding, setAdding] = useState<BookStockCount | null>(null);
  const [viewing, setViewing] = useState<BookStockCount | null>(null);
  const stock = usePrivateBookStock({
    page,
    size: pageSize,
    search: search.trim() || undefined,
  });
  const pageData = stock.data;
  const rows = Array.isArray(pageData?.data) ? pageData.data : [];

  function updateSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  return (
    <div className="px-5 pt-5 pb-8">
      <header className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-950">Stock Count</h1>
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

      <label className="relative mb-4 block w-full max-w-[280px]">
        <span className="sr-only">Search books</span>
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
        <input
          value={search}
          onChange={(event) => updateSearch(event.target.value)}
          placeholder="Search books"
          className="h-10 w-full rounded-full border border-neutral-200 bg-white pr-4 pl-9 text-sm text-neutral-800 outline-none placeholder:text-neutral-400 focus:border-brand focus:ring-2 focus:ring-brand/15"
        />
      </label>

      {stock.error instanceof Error ? <p className="mb-3 text-sm text-danger">{stock.error.message}</p> : null}

      {stock.isLoading ? (
        <StockCountTableSkeleton rows={pageSize} />
      ) : (
        <>
          <StockCountTable
            books={rows}
            onAdd={(book) => {
              setViewing(null);
              setAdding(book);
            }}
            onView={(book) => {
              setAdding(null);
              setViewing(book);
            }}
          />
          {pageData ? (
            <div className="mt-4 flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-neutral-500">
                Page {page} of {Math.max(pageData.totalPage, 1)}
              </p>
              <BooksPagination page={page} totalPages={Math.max(pageData.totalPage, 1)} onPageChange={setPage} />
            </div>
          ) : null}
        </>
      )}

      {adding ? <AddStockPanel book={adding} onClose={() => setAdding(null)} /> : null}
      {viewing ? <StockDetailPanel book={viewing} onClose={() => setViewing(null)} /> : null}
    </div>
  );
}
