"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BookCover } from "@/components/books/book-cover";
import { Badge } from "@/components/ui/badge";
import { formatWeightFromGrams } from "@/core/books/format";
import type { BookPublicationStatus, CatalogBook } from "@/core/books/private-api";
import { formatNaira } from "@/core/dashboard/format";
import { usePrivateBook } from "@/features/books/use-books";
import { cn } from "@/lib/utils";

const publicationLabels: Record<BookPublicationStatus, string> = {
  DRAFT: "Draft",
  AVAILABLE: "Available",
  NOT_AVAILABLE: "Not available",
  ARCHIVED: "Archived",
};

export function BookDetailScreen({ bookId }: { bookId: string }) {
  const book = usePrivateBook(bookId);

  return (
    <div className="px-5 pt-5 pb-8">
      <Link
        href="/admin/books"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-800 hover:text-neutral-950"
      >
        <ArrowLeft className="size-4" strokeWidth={1.75} />
        Back
      </Link>

      {book.isLoading ? <p className="mt-6 text-sm text-neutral-500">Loading book…</p> : null}
      {book.error instanceof Error ? (
        <p className="mt-6 text-sm text-danger">{book.error.message}</p>
      ) : null}
      {book.data ? <BookDetail book={book.data} /> : null}
    </div>
  );
}

function BookDetail({ book }: { book: CatalogBook }) {
  const covers = book.coverImageUrls.filter(Boolean);

  return (
    <article className="mt-4">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-950">{book.title}</h1>
          <p className="mt-1 text-sm text-neutral-500">{book.authorName}</p>
        </div>
        <BookStatus book={book} />
      </header>

      <div className="mt-5 grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <section className="rounded-2xl border border-neutral-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-neutral-950">Covers</h2>
          {covers.length === 0 ? (
            <div className="mt-3">
              <BookCover src={null} title={book.title} />
            </div>
          ) : (
            <div className="mt-3 flex flex-wrap gap-3">
              {covers.map((src) => (
                <Image
                  key={src}
                  src={src}
                  alt=""
                  width={120}
                  height={168}
                  unoptimized
                  className="h-40 w-28 rounded-md object-cover"
                />
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white px-4 py-1">
          <h2 className="sr-only">Book details</h2>
          <dl>
            <Detail label="Price" value={formatNaira(book.price)} />
            <Detail label="Stock" value={book.stockQuantity.toLocaleString("en-US")} />
            <Detail
              label="Weight"
              value={`${book.weightInGrams.toLocaleString("en-US")} g · ${formatWeightFromGrams(book.weightInGrams)}`}
            />
            <Detail label="Best seller" value={book.bestSeller ? "Yes" : "No"} />
            <Detail label="Delivery" value={book.physicalDeliveryAvailable ? "Available" : "Unavailable"} />
            <Detail label="Pickup" value={book.pickupAvailable ? "Available" : "Unavailable"} />
            <Detail label="Version" value={String(book.version)} />
            <Detail label="Created" value={formatTimestamp(book.createdAt)} />
            <Detail label="Updated" value={formatTimestamp(book.updatedAt)} />
          </dl>
        </section>
      </div>

      <section className="mt-4 rounded-2xl border border-neutral-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-neutral-950">Description</h2>
        <p className="mt-2 text-sm text-neutral-800">{book.shortDescription}</p>
        <p className="mt-3 text-sm leading-6 whitespace-pre-wrap text-neutral-600">{book.description}</p>
      </section>

      <section className="mt-4 rounded-2xl border border-neutral-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-neutral-950">Category</h2>
        <div className="mt-3 flex items-center gap-3">
          {book.category?.imageUrl ? (
            <Image
              src={book.category.imageUrl}
              alt=""
              width={40}
              height={40}
              unoptimized
              className="size-10 rounded-lg object-cover"
            />
          ) : null}
          <div>
            <p className="text-sm font-medium text-neutral-900">{book.category?.name || "—"}</p>
            <p className="text-xs text-neutral-500">{book.category?.id || "—"}</p>
          </div>
        </div>
      </section>

      <section className="mt-4 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <h2 className="px-4 pt-4 text-sm font-semibold text-neutral-950">Pickup allocations</h2>
        {book.pickupAllocations.length === 0 ? (
          <p className="px-4 py-4 text-sm text-neutral-500">No pickup allocations.</p>
        ) : (
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#f7f7f8] text-xs text-neutral-500">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Pickup location</th>
                  <th className="px-4 py-2.5 font-medium">Quantity</th>
                  <th className="px-4 py-2.5 font-medium">Enabled</th>
                </tr>
              </thead>
              <tbody>
                {book.pickupAllocations.map((allocation) => (
                  <tr key={allocation.pickupLocationId} className="border-t border-neutral-100">
                    <td className="px-4 py-3 text-neutral-800">{allocation.pickupLocationId}</td>
                    <td className="px-4 py-3 tabular-nums text-neutral-800">{allocation.quantity}</td>
                    <td className="px-4 py-3 text-neutral-800">{allocation.enabled ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="mt-4 text-xs text-neutral-400">Book ID {book.id}</p>
    </article>
  );
}

function BookStatus({ book }: { book: CatalogBook }) {
  const label = book.status
    ? publicationLabels[book.status]
    : typeof book.active === "boolean"
      ? book.active
        ? "Active"
        : "Inactive"
      : null;

  if (!label) return null;

  return (
    <Badge
      variant="secondary"
      className={cn(
        "rounded-full border-0 px-2.5 font-medium",
        label === "Available" || label === "Active"
          ? "bg-emerald-50 text-emerald-600"
          : "bg-neutral-100 text-neutral-500",
      )}
    >
      {label}
    </Badge>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-neutral-100 py-3 last:border-b-0">
      <dt className="text-sm text-neutral-500">{label}</dt>
      <dd className="text-right text-sm text-neutral-900">{value}</dd>
    </div>
  );
}

function formatTimestamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
