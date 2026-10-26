"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  bookDraftFromCatalog,
  createBookRequestFromDraft,
  emptyBookDraft,
  updateBookRequestFromDraft,
} from "@/core/books/book-draft";
import type { BookDraft, PickupAllocation } from "@/core/books/types";
import { useCreatePrivateBook, usePrivateBook, useUpdatePrivateBook } from "@/features/books/use-books";
import { useUploadPrivateFile, useUploadPrivateFiles } from "@/features/files/use-files";
import { cn } from "@/lib/utils";

const controlClass =
  "w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-brand focus:ring-2 focus:ring-brand/15";

export function AddBookPanel({
  mode,
  bookId = "",
  onClose,
  onSaved,
}: {
  mode: "create" | "edit";
  bookId?: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLElement>(null);
  const [draft, setDraft] = useState<BookDraft>(emptyBookDraft);
  const [formError, setFormError] = useState("");
  const loadedBook = usePrivateBook(mode === "edit" ? bookId : "");
  const createBook = useCreatePrivateBook();
  const updateBook = useUpdatePrivateBook();
  const [uploadingCovers, setUploadingCovers] = useState(false);
  const frontCoverUrl = useRef("");
  const saving = createBook.isPending || updateBook.isPending;
  const pending = saving || uploadingCovers;

  useEffect(() => {
    panelRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!loadedBook.data) return;
    const nextDraft = bookDraftFromCatalog(loadedBook.data);
    frontCoverUrl.current = hostedCoverUrls(nextDraft.coverImageUrls)[0] ?? "";
    setDraft(nextDraft);
  }, [loadedBook.data]);

  function updateDraft<K extends keyof BookDraft>(field: K, value: BookDraft[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function updateAllocation(index: number, patch: Partial<PickupAllocation>) {
    setDraft((current) => ({
      ...current,
      allocations: current.allocations.map((station, stationIndex) =>
        stationIndex === index ? { ...station, ...patch } : station,
      ),
    }));
  }

  function publishBook() {
    setFormError("");
    if (mode === "create") {
      const result = createBookRequestFromDraft(draft);
      if (!result.ok) {
        setFormError(result.message);
        return;
      }
      createBook.mutate(result.request, {
        onSuccess: onSaved,
        onError: (error) => setFormError(error.message),
      });
      return;
    }

    const result = updateBookRequestFromDraft(draft);
    if (!result.ok) {
      setFormError(result.message);
      return;
    }
    updateBook.mutate(
      { bookId, request: result.request },
      {
        onSuccess: onSaved,
        onError: (error) => setFormError(error.message),
      },
    );
  }

  return (
    <div className="fixed inset-y-0 right-0 left-0 z-40 md:left-[232px]">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/[0.04] motion-safe:animate-[book-scrim-in_480ms_ease-out_both]"
        aria-label="Close add book"
        onClick={onClose}
      />
      <section
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="absolute inset-3 flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_16px_50px_rgba(17,24,22,0.14)] outline-none motion-safe:animate-[book-panel-in_520ms_cubic-bezier(0.16,1,0.3,1)_both] min-[1200px]:left-[248px]"
      >
        <div className="flex items-center justify-between px-6 pt-4 pb-1">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-800 hover:text-neutral-950"
          >
            <ArrowLeft className="size-4" strokeWidth={1.75} />
            Back
          </button>
          <Button
            type="submit"
            form="add-book-form"
            disabled={pending || (mode === "edit" && loadedBook.isLoading)}
            className="h-8 rounded-full px-3.5 text-[13px]"
          >
            {uploadingCovers ? "Uploading…" : saving ? "Saving…" : mode === "create" ? "Publish book" : "Save changes"}
          </Button>
        </div>

        <form
          id="add-book-form"
          className="min-h-0 flex-1 overflow-y-auto px-6 pt-4 pb-8"
          onSubmit={(event) => {
            event.preventDefault();
            publishBook();
          }}
        >
          <h2 id={titleId} className="text-lg font-semibold tracking-tight text-neutral-950">
            {mode === "create" ? "Add new Book" : "Edit book"}
          </h2>
          {mode === "edit" && loadedBook.isLoading ? (
            <p className="mt-3 text-sm text-neutral-500">Loading book…</p>
          ) : null}
          {loadedBook.error instanceof Error ? (
            <p className="mt-3 text-sm text-danger">{loadedBook.error.message}</p>
          ) : null}
          {formError ? <p className="mt-3 text-sm text-danger">{formError}</p> : null}

          <div className="mt-4 flex flex-col gap-3.5">
            <Field id="book-title" label="Book Title">
              <input
                id="book-title"
                value={draft.title}
                onChange={(event) => updateDraft("title", event.target.value)}
                className={cn(controlClass, "h-10")}
              />
            </Field>

            <div className="grid gap-3.5 sm:grid-cols-2">
              <Field id="author-name" label="Author Name">
                <input
                  id="author-name"
                  value={draft.authorName}
                  onChange={(event) => updateDraft("authorName", event.target.value)}
                  className={cn(controlClass, "h-10")}
                />
              </Field>
              <Field id="category-id" label="Category ID">
                <input
                  id="category-id"
                  value={draft.categoryId}
                  onChange={(event) => updateDraft("categoryId", event.target.value)}
                  placeholder="Category ID"
                  className={cn(controlClass, "h-10")}
                />
              </Field>
              <Field id="stock-quantity" label="Stock quantity">
                <input
                  id="stock-quantity"
                  inputMode="numeric"
                  value={draft.stockQuantity}
                  onChange={(event) => updateDraft("stockQuantity", event.target.value)}
                  className={cn(controlClass, "h-10")}
                />
              </Field>
            </div>

            <Field id="short-summary" label="Short Summary">
              <input
                id="short-summary"
                value={draft.shortSummary}
                onChange={(event) => updateDraft("shortSummary", event.target.value)}
                className={cn(controlClass, "h-10")}
              />
            </Field>

            <Field id="full-description" label="Full description">
              <textarea
                id="full-description"
                value={draft.description}
                onChange={(event) => updateDraft("description", event.target.value)}
                rows={5}
                className={cn(controlClass, "min-h-[118px] resize-none py-2.5 leading-relaxed")}
              />
            </Field>
          </div>

          <section className="mt-6">
            <h3 className="text-[15px] font-semibold text-neutral-950">Logistics & Inventory</h3>
            <p className="mt-0.5 text-[13px] text-neutral-400">
              Toggle for courier deliveries, pickup and weight properties.
            </p>
            <div className="mt-3 grid gap-3.5 sm:grid-cols-[minmax(0,1.45fr)_minmax(0,0.85fr)]">
              <Field id="book-weight" label="Book weight">
                <div className="relative">
                  <input
                    id="book-weight"
                    inputMode="decimal"
                    value={draft.weightKg}
                    onChange={(event) => updateDraft("weightKg", event.target.value)}
                    className={cn(controlClass, "h-10 pr-12")}
                  />
                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-neutral-400">
                    (kg)
                  </span>
                </div>
              </Field>
              <Field id="book-price" label="Price">
                <input
                  id="book-price"
                  value={draft.price}
                  onChange={(event) => updateDraft("price", event.target.value)}
                  className={cn(controlClass, "h-10")}
                />
              </Field>
            </div>
          </section>

          <section className="mt-6">
            <h3 className="text-[15px] font-semibold text-neutral-950">Book Covers</h3>
            <p className="mt-0.5 text-[13px] text-neutral-400">
              Upload the front cover of the book and optional gallery shots
            </p>
            <BookCovers
              coverImageUrls={draft.coverImageUrls}
              onChange={(value) => updateDraft("coverImageUrls", value)}
              onCoverUploaded={(fileUrl) =>
                setDraft((current) => {
                  const urls = hostedCoverUrls(current.coverImageUrls).filter(
                    (url) => url !== frontCoverUrl.current,
                  );
                  frontCoverUrl.current = fileUrl;
                  return { ...current, coverImageUrls: [fileUrl, ...urls].join(", ") };
                })
              }
              onGalleryUploaded={(fileUrls) =>
                setDraft((current) => ({
                  ...current,
                  coverImageUrls: [...hostedCoverUrls(current.coverImageUrls), ...fileUrls].join(
                    ", ",
                  ),
                }))
              }
              onUploadingChange={setUploadingCovers}
            />
          </section>

          <section className="mt-6">
            <h3 className="text-[15px] font-semibold text-neutral-950">Shipping and distribution</h3>
            <p className="mt-0.5 text-[13px] text-neutral-400">
              Toggle for courier deliveries, pickup and weight properties.
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <ToggleRow
                title="In store pickup"
                description="Allow local physical Collection"
                checked={draft.inStorePickup}
                onCheckedChange={(checked) => updateDraft("inStorePickup", checked)}
              />
              <ToggleRow
                title="Enable Delivery Dispatch"
                description="Enable shipping option for checkout option"
                checked={draft.deliveryDispatch}
                onCheckedChange={(checked) => updateDraft("deliveryDispatch", checked)}
              />
              {mode === "create" ? (
                <ToggleRow
                  title="Bulk purchase"
                  description="Allow this book to be bought in bulk"
                  checked={draft.bulkPurchaseAvailable}
                  onCheckedChange={(checked) => updateDraft("bulkPurchaseAvailable", checked)}
                />
              ) : null}
            </div>
          </section>

          <section className="mt-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-[15px] font-semibold text-neutral-950">
                  Overall Inventory Limit & Location Allocations
                </h3>
                <p className="mt-0.5 text-[13px] text-neutral-400">
                  Total copies across all pickup locations cannot exceed the overall inventory limit.
                </p>
              </div>
              <QuantityField
                label="Overall inventory limit"
                value={draft.inventoryLimit}
                onChange={(value) => updateDraft("inventoryLimit", value)}
                className="w-[108px]"
              />
            </div>
            <div className="mt-3 flex flex-col gap-3">
              {draft.allocations.map((station, index) => (
                <div
                  key={`${station.id}-${index}`}
                  className="flex items-center justify-between gap-4 rounded-xl border border-neutral-200 px-4 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <input
                      aria-label={`Pickup location ${index + 1}`}
                      value={station.id}
                      placeholder="Pickup location ID"
                      onChange={(event) => updateAllocation(index, { id: event.target.value })}
                      className={cn(controlClass, "h-10")}
                    />
                    {station.address ? (
                      <p className="mt-1 text-[13px] text-neutral-400">{station.address}</p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 items-center gap-4">
                    <QuantityField
                      label={`Allocation ${index + 1} quantity`}
                      value={station.quantity}
                      onChange={(value) => updateAllocation(index, { quantity: value })}
                      className="w-[88px]"
                    />
                    <Toggle
                      label={`Allocation ${index + 1}`}
                      checked={station.enabled}
                      onCheckedChange={(enabled) => updateAllocation(index, { enabled })}
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    allocations: [
                      ...current.allocations,
                      { id: "", name: "", address: "", quantity: "0", enabled: true },
                    ],
                  }))
                }
                className="self-start text-sm font-medium text-brand"
              >
                Add allocation
              </button>
            </div>
          </section>
        </form>
      </section>
    </div>
  );
}

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] text-neutral-500">
        {label}
      </label>
      {children}
    </div>
  );
}

function hostedCoverUrls(value: string) {
  return value
    .split(/[\s,]+/)
    .map((url) => url.trim())
    .filter((url) => url.startsWith("http://") || url.startsWith("https://"));
}

function BookCovers({
  coverImageUrls,
  onChange,
  onCoverUploaded,
  onGalleryUploaded,
  onUploadingChange,
}: {
  coverImageUrls: string;
  onChange: (value: string) => void;
  onCoverUploaded: (fileUrl: string) => void;
  onGalleryUploaded: (fileUrls: string[]) => void;
  onUploadingChange: (uploading: boolean) => void;
}) {
  const uploadFile = useUploadPrivateFile();
  const uploadFiles = useUploadPrivateFiles();
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState("");
  const coverPreviewRef = useRef<string | null>(null);
  const galleryPreviewRef = useRef<string[]>([]);
  const hostedUrls = hostedCoverUrls(coverImageUrls);
  const previewUrl = coverPreview ?? hostedUrls[0] ?? null;
  const uploading = uploadFile.isPending || uploadFiles.isPending;

  useEffect(() => {
    onUploadingChange(uploading);
  }, [onUploadingChange, uploading]);

  useEffect(() => {
    return () => {
      if (coverPreviewRef.current) URL.revokeObjectURL(coverPreviewRef.current);
      for (const preview of galleryPreviewRef.current) URL.revokeObjectURL(preview);
    };
  }, []);

  function replaceCoverPreview(next: string | null) {
    if (coverPreviewRef.current) URL.revokeObjectURL(coverPreviewRef.current);
    coverPreviewRef.current = next;
    setCoverPreview(next);
  }

  function replaceGalleryPreviews(next: string[]) {
    for (const preview of galleryPreviewRef.current) URL.revokeObjectURL(preview);
    galleryPreviewRef.current = next;
    setGalleryPreviews(next);
  }

  async function uploadCover(file: File) {
    replaceCoverPreview(URL.createObjectURL(file));
    setUploadError("");
    try {
      const uploaded = await uploadFile.mutateAsync({
        category: "BOOK_THUMBNAIL",
        file,
      });
      if (!uploaded.fileUrl) throw new Error("Cover upload did not return a file URL.");
      onCoverUploaded(uploaded.fileUrl);
      replaceCoverPreview(null);
    } catch (error) {
      replaceCoverPreview(null);
      setUploadError(error instanceof Error ? error.message : "Cover upload failed.");
    }
  }

  async function uploadGallery(files: File[]) {
    replaceGalleryPreviews(files.map((file) => URL.createObjectURL(file)));
    setUploadError("");
    try {
      const uploaded = await uploadFiles.mutateAsync({
        category: "BOOK_THUMBNAIL",
        files,
      });
      const fileUrls = (Array.isArray(uploaded) ? uploaded : [])
        .map((item) => item.fileUrl)
        .filter(Boolean);
      if (fileUrls.length === 0) throw new Error("Gallery upload did not return a file URL.");
      onGalleryUploaded(fileUrls);
      replaceGalleryPreviews([]);
    } catch (error) {
      replaceGalleryPreviews([]);
      setUploadError(error instanceof Error ? error.message : "Gallery upload failed.");
    }
  }

  return (
    <div className="mt-3 rounded-2xl border border-neutral-200 px-4 py-4">
      <label className="mb-3 block text-[13px] text-neutral-500" htmlFor="cover-image-urls">
        Cover image URLs
      </label>
      <input
        id="cover-image-urls"
        value={coverImageUrls}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Upload a cover, or paste a hosted URL"
        className={cn(controlClass, "mb-4 h-10")}
      />
      {uploadError ? <p className="mb-3 text-sm text-danger">{uploadError}</p> : null}
      <div className="flex flex-wrap items-center gap-8">
        <label className="flex h-[104px] w-[112px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-neutral-200 text-neutral-400 hover:bg-neutral-50">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt=""
              width={48}
              height={64}
              unoptimized
              className="h-16 w-12 rounded-[3px] object-cover"
            />
          ) : (
            <>
              <Plus className="size-4" strokeWidth={1.75} />
              <span className="text-xs text-neutral-500">
                {uploadFile.isPending ? "Uploading…" : "Add cover photo"}
              </span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={uploadFile.isPending}
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (file) void uploadCover(file);
            }}
          />
        </label>

        <div>
          <p className="mb-2 text-[13px] text-neutral-500">Additional book Gallery</p>
          <div className="flex items-center gap-3">
            <label className="flex h-14 w-10 cursor-pointer items-center justify-center rounded-lg border border-neutral-200 text-neutral-400 hover:bg-neutral-50">
              <Plus className="size-4" strokeWidth={1.75} />
              <span className="sr-only">
                {uploadFiles.isPending ? "Uploading gallery" : "Add gallery photo"}
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                disabled={uploadFiles.isPending}
                onChange={(event) => {
                  const files = Array.from(event.target.files ?? []);
                  event.target.value = "";
                  if (files.length > 0) void uploadGallery(files);
                }}
              />
            </label>
            {hostedUrls.slice(1).map((src) => (
              <Image
                key={src}
                src={src}
                alt=""
                width={40}
                height={56}
                unoptimized
                className="h-14 w-10 rounded-[3px] object-cover"
              />
            ))}
            {galleryPreviews.map((src) => (
              <Image
                key={src}
                src={src}
                alt=""
                width={40}
                height={56}
                unoptimized
                className="h-14 w-10 rounded-[3px] object-cover"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({
  title,
  description,
  checked,
  onCheckedChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-neutral-200 px-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-neutral-900">{title}</p>
        <p className="text-[13px] leading-snug text-neutral-400">{description}</p>
      </div>
      <Toggle label={title} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

function QuantityField({
  label,
  value,
  onChange,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  function step(delta: number) {
    const next = Math.max(0, Number(value || 0) + delta);
    onChange(String(next));
  }

  return (
    <div
      className={cn(
        "flex h-10 shrink-0 items-center rounded-lg border border-neutral-200 bg-white pr-1 pl-3",
        className,
      )}
    >
      <input
        aria-label={label}
        inputMode="numeric"
        value={value}
        onChange={(event) => onChange(event.target.value.replace(/[^\d]/g, ""))}
        className="w-full bg-transparent text-sm text-neutral-900 outline-none"
      />
      <div className="flex flex-col text-neutral-400">
        <button
          type="button"
          aria-label={`Increase ${label}`}
          onClick={() => step(1)}
          className="flex h-4 items-center justify-center"
        >
          <ChevronUp className="size-3.5" strokeWidth={2} />
        </button>
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onClick={() => step(-1)}
          className="flex h-4 items-center justify-center"
        >
          <ChevronDown className="size-3.5" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onCheckedChange,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-[26px] w-[46px] shrink-0 items-center rounded-full p-[3px] transition-colors",
        checked ? "bg-brand" : "bg-neutral-300",
      )}
    >
      <span
        className={cn(
          "pointer-events-none block size-5 rounded-full bg-white shadow-sm transition-transform",
          checked ? "translate-x-5" : "translate-x-0",
        )}
      />
    </button>
  );
}
