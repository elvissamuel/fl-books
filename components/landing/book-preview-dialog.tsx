"use client";

import { useEffect, useId, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Minus, Plus, ShoppingCart, Store, Truck, X } from "lucide-react";
import { CartAuthMessage } from "@/components/cart/cart-auth-message";
import { useCart } from "@/components/cart/cart-provider";
import { StarRating } from "@/components/landing/catalog-shared";
import type { PublicBook } from "@/core/books/public-api";
import { getPublicBook } from "@/infrastructure/books/public-books-actions";
import { cn } from "@/lib/utils";

type Fulfillment = "delivery" | "pickup";

function naira(value: number) {
  const digits = Math.round(value).toString();
  return `N${digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

function coversOf(book: PublicBook) {
  return book.coverImageUrls.filter((url) => url.startsWith("https://"));
}

function weightLabel(grams: number) {
  if (grams >= 1000) {
    const kilos = grams / 1000;
    const text = Number.isInteger(kilos) ? String(kilos) : kilos.toFixed(1);
    return `${text} kg`;
  }
  return `${Math.round(grams)} g`;
}

export function BookPreviewDialog({ bookId, onClose }: { bookId: string; onClose: () => void }) {
  const titleId = useId();
  const [book, setBook] = useState<PublicBook | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [fulfillment, setFulfillment] = useState<Fulfillment>("delivery");
  const [adding, setAdding] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const [cartError, setCartError] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    setBook(null);
    setCartMessage("");
    setCartError(false);

    getPublicBook(bookId).then((result) => {
      if (cancelled) return;
      if (!result.ok) {
        setError(result.message);
        setLoading(false);
        return;
      }
      setBook(result.data);
      setImageIndex(0);
      setQuantity(1);
      setFulfillment(result.data.physicalDeliveryAvailable ? "delivery" : "pickup");
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [bookId]);

  const covers = book ? coversOf(book) : [];
  const cover = covers[imageIndex] ?? covers[0] ?? "";
  const stock = book?.stockQuantity ?? 0;
  const pickupCount = book?.pickupAllocations.filter((allocation) => allocation.enabled).length ?? 0;
  const description = book?.description.trim() || book?.shortDescription || "";

  async function addToCart() {
    if (!book || stock <= 0) return;
    setAdding(true);
    setCartMessage("");
    const result = await addItem(book.id, quantity);
    setAdding(false);
    setCartError(!result.ok);
    setCartMessage(result.ok ? "Added to cart" : result.message);
  }

  function showImage(next: number) {
    if (covers.length === 0) return;
    const wrapped = (next + covers.length) % covers.length;
    setImageIndex(wrapped);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/45"
        aria-label="Close book preview"
        onClick={onClose}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[92vh] w-full max-w-[920px] flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_24px_70px_rgba(17,24,22,0.28)]"
      >
        <header className="flex items-center justify-between px-6 pt-5 pb-3 sm:px-7">
          <h2 id={titleId} className="text-[22px] font-semibold text-[#1c1f24]">
            Book Preview
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="inline-flex size-9 items-center justify-center rounded-full text-[#1c1f24] hover:bg-[#f4f5f9]"
          >
            <X className="size-5" strokeWidth={1.75} />
          </button>
        </header>

        <div className="overflow-y-auto px-6 pb-6 sm:px-7">
          {loading ? <p className="py-16 text-center text-sm text-[#8d939c]">Loading book...</p> : null}
          {error ? <p className="py-16 text-center text-sm text-danger">{error}</p> : null}
          {book ? (
            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
              <div>
                <div className="relative flex h-[340px] items-center justify-center rounded-[22px] bg-[#f3f5f8]">
                  {cover ? (
                    <div className="relative h-[280px] w-[196px]">
                      <Image
                        src={cover}
                        alt={book.title}
                        fill
                        sizes="220px"
                        className="object-contain drop-shadow-[0_16px_24px_rgba(20,24,40,0.18)]"
                      />
                    </div>
                  ) : (
                    <p className="text-sm text-[#8d939c]">No cover image</p>
                  )}
                  {covers.length > 1 ? (
                    <>
                      <button
                        type="button"
                        aria-label="Previous image"
                        onClick={() => showImage(imageIndex - 1)}
                        className="absolute top-1/2 left-3 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#6d7480] shadow-[0_6px_16px_rgba(20,24,40,0.12)]"
                      >
                        <ChevronLeft className="size-4" />
                      </button>
                      <button
                        type="button"
                        aria-label="Next image"
                        onClick={() => showImage(imageIndex + 1)}
                        className="absolute top-1/2 right-3 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#6d7480] shadow-[0_6px_16px_rgba(20,24,40,0.12)]"
                      >
                        <ChevronRight className="size-4" />
                      </button>
                    </>
                  ) : null}
                </div>
                {covers.length > 0 ? (
                  <div className="mt-3 flex gap-3 overflow-x-auto">
                    {covers.map((src, index) => (
                      <button
                        key={src}
                        type="button"
                        aria-label={`Show image ${index + 1}`}
                        onClick={() => setImageIndex(index)}
                        className={cn(
                          "relative h-[84px] w-[64px] shrink-0 overflow-hidden rounded-lg bg-[#f3f5f8]",
                          index === imageIndex ? "ring-2 ring-[#f47832]" : "ring-1 ring-[#e6e8ee]",
                        )}
                      >
                        <Image src={src} alt="" fill sizes="64px" className="object-contain" />
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="min-w-0 pt-1">
                <StarRating />
                <h3 className="mt-3 text-[28px] leading-tight font-semibold text-[#1c1f24]">{book.title}</h3>
                {book.bestSeller ? (
                  <p className="mt-2 text-[13px] font-semibold text-[#f47832]">Best seller</p>
                ) : null}
                <p className="mt-3 text-[14px] leading-6 text-[#6d7480]">{description}</p>
                <p className="mt-4 text-[22px] font-semibold text-brand">{naira(book.price)}</p>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      disabled={quantity <= 1}
                      onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                      className="inline-flex size-10 items-center justify-center rounded-xl bg-[#fde8dc] text-[#c46a45] disabled:opacity-40"
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="w-6 text-center text-[15px] font-semibold text-[#1c1f24]">{quantity}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      disabled={stock > 0 && quantity >= stock}
                      onClick={() => setQuantity((current) => current + 1)}
                      className="inline-flex size-10 items-center justify-center rounded-xl bg-[#f47832] text-white disabled:opacity-40"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    disabled={stock <= 0 || adding}
                    onClick={addToCart}
                    className="inline-flex h-10 min-w-[180px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#f47832] px-5 text-[14px] font-medium text-white hover:bg-[#e56d28] disabled:opacity-50"
                  >
                    <ShoppingCart className="size-4" strokeWidth={1.75} />
                    {stock <= 0 ? "Out of stock" : adding ? "Adding..." : "Add to Cart"}
                  </button>
                </div>
                {cartMessage ? (
                  <CartAuthMessage
                    message={cartMessage}
                    className={`mt-2 text-[13px] ${cartError ? "text-danger" : "text-brand"}`}
                  />
                ) : null}

                {book.physicalDeliveryAvailable || book.pickupAvailable ? (
                  <p className="mt-5 text-[14px] font-semibold text-[#1c1f24]">Delivery & Pickup</p>
                ) : null}
                <div className="mt-2.5 grid grid-cols-2 gap-3">
                  {book.physicalDeliveryAvailable ? (
                    <button
                      type="button"
                      aria-pressed={fulfillment === "delivery"}
                      onClick={() => setFulfillment("delivery")}
                      className={cn(
                        "flex items-center gap-2.5 rounded-2xl px-3 py-3 text-left text-[13.5px] font-medium text-[#1c1f24]",
                        fulfillment === "delivery"
                          ? "border border-[#f47832] bg-white"
                          : "border border-transparent bg-[#f6f7f9]",
                      )}
                    >
                      <span className="inline-flex size-8 items-center justify-center rounded-full bg-[#fff1ea] text-[#f47832]">
                        <Truck className="size-4" />
                      </span>
                      Delivery
                    </button>
                  ) : null}
                  {book.pickupAvailable ? (
                    <button
                      type="button"
                      aria-pressed={fulfillment === "pickup"}
                      onClick={() => setFulfillment("pickup")}
                      className={cn(
                        "flex items-center gap-2.5 rounded-2xl px-3 py-3 text-left text-[13.5px] font-medium text-[#1c1f24]",
                        fulfillment === "pickup"
                          ? "border border-[#f47832] bg-white"
                          : "border border-transparent bg-[#f6f7f9]",
                      )}
                    >
                      <span className="inline-flex size-8 items-center justify-center rounded-full bg-[#fff1ea] text-[#f47832]">
                        <Store className="size-4" />
                      </span>
                      Pick Up
                    </button>
                  ) : null}
                </div>
                {fulfillment === "pickup" && pickupCount > 0 ? (
                  <p className="mt-2 text-[12.5px] text-[#8d939c]">
                    Ready at {pickupCount} pickup {pickupCount === 1 ? "location" : "locations"}
                  </p>
                ) : null}

                <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-[#eef0f4] pt-4 text-[13px]">
                  <div>
                    <dt className="text-[#8d939c]">Author</dt>
                    <dd className="mt-0.5 font-semibold text-[#1c1f24]">{book.authorName}</dd>
                  </div>
                  <div>
                    <dt className="text-[#8d939c]">Category</dt>
                    <dd className="mt-0.5 font-semibold text-[#1c1f24]">{book.category?.name || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-[#8d939c]">Weight</dt>
                    <dd className="mt-0.5 font-semibold text-[#1c1f24]">{weightLabel(book.weightInGrams)}</dd>
                  </div>
                  <div>
                    <dt className="text-[#8d939c]">In stock</dt>
                    <dd className="mt-0.5 font-semibold text-[#1c1f24]">
                      {stock > 0 ? `${stock} ${stock === 1 ? "copy" : "copies"}` : "Out of stock"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
