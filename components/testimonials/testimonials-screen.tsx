"use client";

import { useState } from "react";
import { Bell, Plus } from "lucide-react";
import { BooksPagination } from "@/components/books/books-pagination";
import { AddTestimonyPanel } from "@/components/testimonials/add-testimony-panel";
import { TestimonialsTable } from "@/components/testimonials/testimonials-table";
import { TestimonyAddedDialog } from "@/components/testimonials/testimony-added-dialog";
import { Button } from "@/components/ui/button";
import { useTestimonials } from "@/features/testimonials/use-testimonials";
import { defaultTestimonialListParams } from "@/infrastructure/testimonials/testimonials-api";

export function TestimonialsScreen() {
  const [page, setPage] = useState(defaultTestimonialListParams.page);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const { data } = useTestimonials({
    page,
    pageSize: defaultTestimonialListParams.pageSize,
  });

  return (
    <div className="px-5 pt-5 pb-8">
      <header className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-950">Testimonials</h1>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            className="h-9 rounded-full px-3.5 text-sm"
            onClick={() => setAdding(true)}
          >
            <Plus className="size-4" />
            Add Testimony
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
          <TestimonialsTable testimonials={data.items} />
          <div className="mt-4 flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-neutral-500">
              Page {data.page} of {data.totalPages}
            </p>
            <BooksPagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
          </div>
        </>
      ) : null}

      {adding ? (
        <AddTestimonyPanel
          onClose={() => setAdding(false)}
          onSaved={() => {
            setAdding(false);
            setAdded(true);
          }}
        />
      ) : null}
      {added ? <TestimonyAddedDialog onDone={() => setAdded(false)} /> : null}
    </div>
  );
}
