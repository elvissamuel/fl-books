"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Search } from "lucide-react";
import type { BookCategory } from "@/core/book-categories/category";

export function BooksFinder({
  search,
  categoryId,
  categories,
}: {
  search: string;
  categoryId: string;
  categories: BookCategory[];
}) {
  const router = useRouter();
  const [term, setTerm] = useState(search);

  useEffect(() => {
    setTerm(search);
  }, [search]);

  useEffect(() => {
    const query = term.trim();
    if (query === search.trim()) return;

    const timer = window.setTimeout(() => {
      openCatalog(query, categoryId);
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [term, search, categoryId]);

  function openCatalog(nextSearch: string, nextCategoryId: string) {
    const params = new URLSearchParams();
    const query = nextSearch.trim();
    if (query) params.set("search", query);
    if (nextCategoryId) params.set("categoryId", nextCategoryId);
    const href = params.size > 0 ? `/books?${params.toString()}` : "/books";
    router.push(href);
  }

  return (
    <form
      className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        openCatalog(String(data.get("search") ?? ""), categoryId);
      }}
    >
      <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-[#1c1f24]">Find what you need</h2>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative block">
          <span className="sr-only">Search books</span>
          <input
            id="book-search"
            name="search"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Search here..."
            className="h-11 w-full rounded-full border border-[#e6e8ee] bg-[#f7f8fb] px-4 text-[13.5px] text-[#1c1f24] outline-none placeholder:text-[#b0b6bf] focus:border-brand focus:bg-white sm:w-[280px]"
          />
        </label>
        <button
          type="submit"
          aria-label="Search"
          className="inline-flex size-11 items-center justify-center self-start rounded-full bg-brand text-white hover:bg-brand-hover"
        >
          <Search className="size-4" strokeWidth={2} />
        </button>
        <div className="relative">
          <label className="sr-only" htmlFor="book-category">
            Categories
          </label>
          <select
            id="book-category"
            value={categoryId}
            onChange={(event) => openCatalog(term, event.target.value)}
            className="h-11 w-full appearance-none rounded-full border border-[#e6e8ee] bg-white pr-9 pl-4 text-[13.5px] text-[#6d7480] outline-none focus:border-brand sm:w-[150px]"
          >
            <option value="">Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#8d939c]" />
        </div>
      </div>
    </form>
  );
}
