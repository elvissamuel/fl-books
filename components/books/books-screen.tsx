"use client";

import { useState } from "react";
import { Bell, Plus, Search } from "lucide-react";
import { AddBookPanel } from "@/components/books/add-book-panel";
import { BookUploadedDialog } from "@/components/books/book-uploaded-dialog";
import { BooksPagination } from "@/components/books/books-pagination";
import { BooksTable } from "@/components/books/books-table";
import { Button } from "@/components/ui/button";
import type { BookListFilter } from "@/core/books/types";
import { useBooks } from "@/features/books/use-books";
import { defaultBookListParams } from "@/infrastructure/books/books-api";
import { cn } from "@/lib/utils";

const filters: { id: BookListFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "stock", label: "Stock" },
  { id: "price", label: "Price" },
  { id: "weight", label: "Weight" },
  { id: "active", label: "Active" },
  { id: "inactive", label: "Inactive" },
];

export function BooksScreen() {
  const [search, setSearch] = useState(defaultBookListParams.search);
  const [filter, setFilter] = useState<BookListFilter>(defaultBookListParams.filter);
  const [page, setPage] = useState(defaultBookListParams.page);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [addingBook, setAddingBook] = useState(false);
  const [published, setPublished] = useState(false);
  const { data } = useBooks({
    search,
    filter,
    page,
    pageSize: defaultBookListParams.pageSize,
  });

  function updateSearch(value: string) {
    setSearch(value);
    setPage(value.trim() === "" && filter === "all" ? defaultBookListParams.page : 1);
    setSelectedIds([]);
  }

  function updateFilter(next: BookListFilter) {
    setFilter(next);
    setPage(next === "all" && search.trim() === "" ? defaultBookListParams.page : 1);
    setSelectedIds([]);
  }

  return (
    <div className="px-5 pt-5 pb-8">
      <header className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-950">
          Book management
        </h1>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            className="h-9 rounded-full px-3.5 text-sm"
            onClick={() => setAddingBook(true)}
          >
            <Plus className="size-4" />
            Add new book
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
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter books">
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
          <BooksTable
            books={data.items}
            selectedIds={selectedIds}
            onSelectedIdsChange={setSelectedIds}
          />
          <div className="mt-4 flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-neutral-500">
              Page {data.page} of {data.totalPages}
            </p>
            <BooksPagination
              page={data.page}
              totalPages={data.totalPages}
              onPageChange={(nextPage) => {
                setPage(nextPage);
                setSelectedIds([]);
              }}
            />
          </div>
        </>
      ) : null}
      {addingBook ? (
        <AddBookPanel
          onClose={() => setAddingBook(false)}
          onPublished={() => {
            setAddingBook(false);
            setPublished(true);
          }}
        />
      ) : null}
      {published ? <BookUploadedDialog onDone={() => setPublished(false)} /> : null}
    </div>
  );
}
