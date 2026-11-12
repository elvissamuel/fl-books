"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Bell, Plus, Search } from "lucide-react";
import { AddBookPanel } from "@/components/books/add-book-panel";
import { BookUploadedDialog } from "@/components/books/book-uploaded-dialog";
import { BooksPagination } from "@/components/books/books-pagination";
import { BooksTable, BooksTableSkeleton } from "@/components/books/books-table";
import { CategoriesTable, CategoriesTableSkeleton } from "@/components/books/categories-table";
import { CategoryAddedDialog } from "@/components/books/category-added-dialog";
import { CategoryDialog } from "@/components/books/category-dialog";
import { Button } from "@/components/ui/button";
import type { BookCategory } from "@/core/book-categories/category";
import type { BookListQuery } from "@/core/books/private-api";
import type { BookListFilter } from "@/core/books/types";
import {
  useCreatePrivateBookCategory,
  useDeletePrivateBookCategory,
  usePrivateBookCategories,
  useUpdatePrivateBookCategory,
} from "@/features/book-categories/use-private-book-categories";
import { booksKeys } from "@/features/books/query-keys";
import { useDeletePrivateBook, usePrivateBooks } from "@/features/books/use-books";
import { cn } from "@/lib/utils";

const pageSize = 10;

const tabs = [
  { id: "books", label: "Books" },
  { id: "categories", label: "Categories" },
] as const;

type BooksTab = (typeof tabs)[number]["id"];

const filters: { id: BookListFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "stock", label: "Stock" },
  { id: "price", label: "Price" },
  { id: "weight", label: "Weight" },
  { id: "active", label: "Active" },
  { id: "inactive", label: "Inactive" },
];

function bookQuery(page: number, search: string, filter: BookListFilter): BookListQuery {
  const query: BookListQuery = { page, size: pageSize, search };
  if (filter === "active") query.active = true;
  if (filter === "inactive") query.active = false;
  if (filter === "stock") {
    query.sortBy = "stockQuantity";
    query.direction = "DESC";
  }
  if (filter === "price") {
    query.sortBy = "price";
    query.direction = "DESC";
  }
  if (filter === "weight") {
    query.sortBy = "weightInGrams";
    query.direction = "DESC";
  }
  return query;
}

export function BooksScreen() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<BooksTab>("books");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<BookListFilter>("all");
  const [page, setPage] = useState(1);
  const [categoryPage, setCategoryPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [panel, setPanel] = useState<null | { mode: "create" } | { mode: "edit"; bookId: string }>(
    null,
  );
  const [categoryPanel, setCategoryPanel] = useState<
    null | { mode: "create" } | { mode: "edit"; category: BookCategory }
  >(null);
  const [published, setPublished] = useState(false);
  const [categoryAdded, setCategoryAdded] = useState(false);
  const [actionError, setActionError] = useState("");
  const books = usePrivateBooks(bookQuery(page, search, filter));
  const categories = usePrivateBookCategories(
    { page: categoryPage, size: pageSize, search },
    tab === "categories",
  );
  const deleteBook = useDeletePrivateBook();
  const createCategory = useCreatePrivateBookCategory();
  const updateCategory = useUpdatePrivateBookCategory();
  const deleteCategory = useDeletePrivateBookCategory();
  const pageData = books.data;
  const rows = Array.isArray(pageData?.data) ? pageData.data : [];
  const categoryPageData = categories.data;
  const categoryRows = Array.isArray(categoryPageData?.data) ? categoryPageData.data : [];
  const categoryPending = createCategory.isPending || updateCategory.isPending;

  async function refresh() {
    await queryClient.invalidateQueries({ queryKey: booksKeys.all });
  }

  function updateSearch(value: string) {
    setSearch(value);
    setPage(1);
    setCategoryPage(1);
    setSelectedIds([]);
  }

  function updateFilter(next: BookListFilter) {
    setFilter(next);
    setPage(1);
    setSelectedIds([]);
  }

  return (
    <div className="px-5 pt-5 pb-8">
      <header className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-950">Book management</h1>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-9 rounded-full border-brand bg-white px-3.5 text-sm text-brand hover:bg-brand/5"
            onClick={() => setCategoryPanel({ mode: "create" })}
          >
            <Plus className="size-4" />
            Add Category
          </Button>
          <Button
            type="button"
            className="h-9 rounded-full px-3.5 text-sm"
            onClick={() => setPanel({ mode: "create" })}
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

      <div className="mb-4 flex items-center gap-2" role="tablist" aria-label="Book management">
        {tabs.map((item) => {
          const selected = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setTab(item.id)}
              className={cn(
                "h-8 rounded-full border bg-white px-3 text-xs font-medium",
                selected
                  ? "border-brand text-brand"
                  : "border-neutral-200 text-neutral-500 hover:bg-neutral-50",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative block w-full max-w-[280px]">
          <span className="sr-only">{tab === "categories" ? "Search Category" : "Search books"}</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
          <input
            value={search}
            onChange={(event) => updateSearch(event.target.value)}
            placeholder={tab === "categories" ? "Search Category" : "Search books"}
            className="h-10 w-full rounded-full border border-neutral-200 bg-white pr-4 pl-9 text-sm text-neutral-800 outline-none placeholder:text-neutral-400 focus:border-brand focus:ring-2 focus:ring-brand/15"
          />
        </label>
        {tab === "books" ? (
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
        ) : null}
      </div>

      {tab === "books" && books.error instanceof Error ? (
        <p className="mb-3 text-sm text-danger">{books.error.message}</p>
      ) : null}
      {tab === "categories" && categories.error instanceof Error ? (
        <p className="mb-3 text-sm text-danger">{categories.error.message}</p>
      ) : null}
      {actionError ? <p className="mb-3 text-sm text-danger">{actionError}</p> : null}
      {tab === "books" ? (
        books.isLoading ? (
          <BooksTableSkeleton />
        ) : (
          <BooksTable
            books={rows}
            selectedIds={selectedIds}
            onSelectedIdsChange={setSelectedIds}
            onEdit={(book) => setPanel({ mode: "edit", bookId: book.id })}
            onDelete={(book) => {
              if (!window.confirm(`Delete ${book.title}?`)) return;
              setActionError("");
              deleteBook
                .mutateAsync(book.id)
                .then(() => refresh())
                .catch((error: unknown) => {
                  setActionError(error instanceof Error ? error.message : "Request failed.");
                });
            }}
          />
        )
      ) : categories.isLoading ? (
        <CategoriesTableSkeleton />
      ) : (
        <CategoriesTable
          categories={categoryRows}
          onEdit={(category) => setCategoryPanel({ mode: "edit", category })}
          onDelete={(category) => {
            if (!window.confirm(`Delete ${category.name}?`)) return;
            setActionError("");
            deleteCategory.mutate(category.id, {
              onError: (error: unknown) => {
                setActionError(error instanceof Error ? error.message : "Request failed.");
              },
            });
          }}
        />
      )}

      {tab === "books" && pageData ? (
        <div className="mt-4 flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-neutral-500">
            Page {page} of {Math.max(pageData.totalPage, 1)}
          </p>
          <BooksPagination
            page={page}
            totalPages={Math.max(pageData.totalPage, 1)}
            onPageChange={(nextPage) => {
              setPage(nextPage);
              setSelectedIds([]);
            }}
          />
        </div>
      ) : null}
      {tab === "categories" && categoryPageData ? (
        <div className="mt-4 flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-neutral-500">
            Page {categoryPage} of {Math.max(categoryPageData.totalPage, 1)}
          </p>
          <BooksPagination
            page={categoryPage}
            totalPages={Math.max(categoryPageData.totalPage, 1)}
            onPageChange={setCategoryPage}
          />
        </div>
      ) : null}

      {panel ? (
        <AddBookPanel
          mode={panel.mode}
          bookId={panel.mode === "edit" ? panel.bookId : undefined}
          onClose={() => setPanel(null)}
          onSaved={() => {
            const created = panel.mode === "create";
            setPanel(null);
            if (created) setPublished(true);
            void refresh();
          }}
        />
      ) : null}
      {published ? <BookUploadedDialog onDone={() => setPublished(false)} /> : null}
      {categoryAdded ? <CategoryAddedDialog onDone={() => setCategoryAdded(false)} /> : null}
      {categoryPanel ? (
        <CategoryDialog
          category={categoryPanel.mode === "edit" ? categoryPanel.category : undefined}
          pending={categoryPending}
          onClose={() => {
            if (!categoryPending) setCategoryPanel(null);
          }}
          onSave={async (input) => {
            const created = categoryPanel.mode === "create";
            if (created) {
              await createCategory.mutateAsync(input);
            } else {
              await updateCategory.mutateAsync({
                categoryId: categoryPanel.category.id,
                request: input,
              });
            }
            setCategoryPanel(null);
            if (created) setCategoryAdded(true);
          }}
        />
      ) : null}
    </div>
  );
}
