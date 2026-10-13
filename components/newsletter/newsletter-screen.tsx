"use client";

import { useState } from "react";
import { Bell, Plus } from "lucide-react";
import { BooksPagination } from "@/components/books/books-pagination";
import { NewsletterTable } from "@/components/newsletter/newsletter-table";
import { Button } from "@/components/ui/button";
import { useNewsletterSubscribers } from "@/features/newsletter/use-newsletter";
import { defaultNewsletterListParams } from "@/infrastructure/newsletter/newsletter-api";

export function NewsletterScreen() {
  const [page, setPage] = useState(defaultNewsletterListParams.page);
  const { data } = useNewsletterSubscribers({
    page,
    pageSize: defaultNewsletterListParams.pageSize,
  });

  return (
    <div className="px-5 pt-5 pb-8">
      <header className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-950">Newsletter</h1>
        <div className="flex items-center gap-3">
          <Button type="button" className="h-9 rounded-full px-3.5 text-sm">
            <Plus className="size-4" />
            Export
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

      {data ? (
        <>
          <NewsletterTable subscribers={data.items} />
          <div className="mt-4 flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-neutral-500">
              Page {data.page} of {data.totalPages}
            </p>
            <BooksPagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
          </div>
        </>
      ) : null}
    </div>
  );
}
