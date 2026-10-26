"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Bell, Loader2, Plus } from "lucide-react";
import { BooksPagination } from "@/components/books/books-pagination";
import { AddTestimonyPanel } from "@/components/testimonials/add-testimony-panel";
import { TestimonialsTable } from "@/components/testimonials/testimonials-table";
import { TestimonyAddedDialog } from "@/components/testimonials/testimony-added-dialog";
import { TestimonyDeleteDialog } from "@/components/testimonials/testimony-delete-dialog";
import { Button } from "@/components/ui/button";
import type { PrivateTestimonial } from "@/core/testimonials/private-api";
import { testimonialKeys } from "@/features/testimonials/query-keys";
import {
  useDeletePrivateTestimonial,
  usePrivateTestimonial,
  usePrivateTestimonials,
} from "@/features/testimonials/use-testimonials";

const pageSize = 7;

export function TestimonialsScreen() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [panel, setPanel] = useState<
    { mode: "create" } | { mode: "edit"; testimonial: PrivateTestimonial } | null
  >(null);
  const [editRequestId, setEditRequestId] = useState("");
  const [added, setAdded] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<PrivateTestimonial | null>(null);
  const [actionError, setActionError] = useState("");
  const testimonials = usePrivateTestimonials({ page, size: pageSize });
  const editDetail = usePrivateTestimonial(editRequestId);
  const deleteTestimonial = useDeletePrivateTestimonial();
  const rows = Array.isArray(testimonials.data?.data) ? testimonials.data.data : [];
  const totalPages = Math.max(testimonials.data?.totalPage ?? 1, 1);

  function refresh() {
    return queryClient.invalidateQueries({ queryKey: testimonialKeys.all });
  }

  function closePanel() {
    setPanel(null);
    setEditRequestId("");
  }

  useEffect(() => {
    if (!editRequestId || panel?.mode === "edit") return;

    if (editDetail.data?.id === editRequestId) {
      setPanel({ mode: "edit", testimonial: editDetail.data });
      return;
    }

    if (editDetail.error instanceof Error) {
      setActionError(editDetail.error.message);
      setEditRequestId("");
    }
  }, [editDetail.data, editDetail.error, editRequestId, panel]);

  async function confirmDelete() {
    if (!pendingDelete) return;
    setActionError("");
    try {
      await deleteTestimonial.mutateAsync(pendingDelete.id);
      if (rows.length === 1 && page > 1) setPage(page - 1);
      setPendingDelete(null);
      await refresh();
      setDeleted(true);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Request failed.");
      setPendingDelete(null);
    }
  }

  return (
    <div className="px-5 pt-5 pb-8">
      <header className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-950">Testimonials</h1>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            className="h-9 rounded-full px-3.5 text-sm"
            onClick={() => {
              setEditRequestId("");
              setPanel({ mode: "create" });
            }}
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

      {testimonials.error instanceof Error ? (
        <p className="mb-3 text-sm text-danger">{testimonials.error.message}</p>
      ) : null}
      {actionError ? <p className="mb-3 text-sm text-danger">{actionError}</p> : null}
      {testimonials.isLoading ? (
        <p className="mb-3 text-sm text-neutral-500">Loading testimonials…</p>
      ) : null}
      {editRequestId && panel?.mode !== "edit" ? (
        <div
          role="status"
          className="fixed inset-y-0 right-0 left-0 z-40 flex items-center justify-center md:left-[232px]"
        >
          <Loader2 className="size-8 animate-spin text-brand" aria-hidden />
          <span className="sr-only">Loading testimony</span>
        </div>
      ) : null}

      <TestimonialsTable
        testimonials={rows}
        onEdit={(testimonial) => {
          setActionError("");
          setPanel(null);
          setEditRequestId(testimonial.id);
        }}
        onDelete={setPendingDelete}
      />

      {testimonials.data ? (
        <div className="mt-4 flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-neutral-500">
            Page {page} of {totalPages}
          </p>
          <BooksPagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      ) : null}

      {panel?.mode === "create" || panel?.mode === "edit" ? (
        <AddTestimonyPanel
          key={panel.mode === "edit" ? panel.testimonial.id : "create"}
          mode={panel.mode}
          testimonial={panel.mode === "edit" ? panel.testimonial : undefined}
          onClose={closePanel}
          onSaved={() => {
            const created = panel.mode === "create";
            closePanel();
            if (created) setAdded(true);
            void refresh();
          }}
        />
      ) : null}
      {pendingDelete ? (
        <TestimonyDeleteDialog
          name={pendingDelete.name}
          pending={deleteTestimonial.isPending}
          onClose={() => {
            if (!deleteTestimonial.isPending) setPendingDelete(null);
          }}
          onConfirm={() => void confirmDelete()}
        />
      ) : null}
      {added ? <TestimonyAddedDialog onDone={() => setAdded(false)} /> : null}
      {deleted ? (
        <TestimonyAddedDialog
          title="Testimony Deleted Successfully"
          description="You have successfully deleted a testimony."
          onDone={() => setDeleted(false)}
        />
      ) : null}
    </div>
  );
}
