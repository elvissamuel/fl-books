"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { cartCover, naira } from "@/components/cart/money";
import { useCart } from "@/components/cart/cart-provider";
import { listPublicBooks } from "@/infrastructure/books/public-books-actions";

export function CartScreen() {
  const router = useRouter();
  const { cart, ready, removeItem, updateQuantity } = useCart();
  const [blurbs, setBlurbs] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState("");
  const items = cart?.items ?? [];

  useEffect(() => {
    let cancelled = false;
    listPublicBooks({ page: 1, size: 100 }).then((result) => {
      if (cancelled || !result.ok || !Array.isArray(result.data.data)) return;
      const next: Record<string, string> = {};
      for (const book of result.data.data) next[book.id] = book.shortDescription;
      setBlurbs(next);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function goBack() {
    if (window.history.length > 1) router.back();
    else router.push("/books");
  }

  async function remove(cartItemId: string) {
    setBusyId(cartItemId);
    setMessage("");
    const result = await removeItem(cartItemId);
    setBusyId("");
    if (!result.ok) setMessage(result.message);
  }

  async function changeQuantity(cartItemId: string, quantity: number) {
    if (quantity < 1) return;
    setBusyId(cartItemId);
    setMessage("");
    const result = await updateQuantity(cartItemId, quantity);
    setBusyId("");
    if (!result.ok) setMessage(result.message);
  }

  if (!ready) {
    return <p className="px-6 py-16 text-sm text-[#8d939c] sm:px-10 lg:px-14">Loading cart...</p>;
  }

  return (
    <div className="mx-auto w-full max-w-[1180px] px-6 py-8 sm:px-4">
      <button
        type="button"
        onClick={goBack}
        className="inline-flex items-center gap-2 text-[26px] font-bold text-[#1c1f24]"
      >
        <ChevronLeft className="size-6" strokeWidth={1.75} />
        Cart ({items.length})
      </button>

      {items.length === 0 ? (
        <div className="flex min-h-[280px] flex-col py-10">
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <span className="inline-flex size-24 items-center justify-center rounded-full bg-[#fff1ea] text-[#f47832]">
              <ShoppingCart className="size-9" strokeWidth={1.75} />
            </span>
            <h2 className="mt-6 text-[18px] font-semibold text-[#1c1f24]">Your Cart is Empty</h2>
            <p className="mt-2 text-[14px] text-[#8d939c]">Add books to your cart to get started</p>
          </div>
          <button type="button" aria-label="Back" onClick={goBack} className="mb-6 text-[#1c1f24]">
            <ChevronLeft className="size-5" />
          </button>
        </div>
      ) : (
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
          <div className="rounded-[20px] border border-[#eceef3] bg-white">
            {items.map((item) => {
              const cover = cartCover(item.coverImageUrls);
              const busy = busyId === item.cartItemId;
              return (
                <article
                  key={item.cartItemId}
                  className="flex gap-4 border-b border-[#f0f1f4] px-3 py-3 last:border-b-0 sm:gap-5 sm:px-4 sm:py-4"
                >
                  <div className="relative size-[120px] shrink-0 overflow-hidden rounded-xl bg-[#f4f6f8] sm:size-[140px]">
                    {cover ? (
                      <Image
                        src={cover}
                        alt=""
                        fill
                        sizes="140px"
                        className="object-cover object-center"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h2 className="text-[20px] leading-snug font-bold text-[#1c1f24] sm:text-[22px]">
                          {item.title}
                        </h2>
                        {blurbs[item.bookId] ? (
                          <p className="mt-2 line-clamp-2 text-[16px] leading-7 text-[#9aa1ab]">{blurbs[item.bookId]}</p>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${item.title}`}
                        disabled={busy}
                        onClick={() => remove(item.cartItemId)}
                        className="shrink-0 text-[#c5cad1] hover:text-[#e11d48] disabled:opacity-40"
                      >
                        <Trash2 className="size-5" strokeWidth={1.75} />
                      </button>
                    </div>
                    <div className="mt-6 flex items-center justify-between gap-3">
                      <p className="text-[18px] font-bold text-brand sm:text-[20px]">{naira(item.unitPrice)}</p>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          disabled={busy || item.quantity <= 1}
                          onClick={() => changeQuantity(item.cartItemId, item.quantity - 1)}
                          className="inline-flex size-10 items-center justify-center rounded-lg bg-[#fde8dc] text-[#c46a45] disabled:opacity-40"
                        >
                          <Minus className="size-4" />
                        </button>
                        <span className="w-7 text-center text-[16px] font-semibold text-[#1c1f24]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          disabled={busy}
                          onClick={() => changeQuantity(item.cartItemId, item.quantity + 1)}
                          className="inline-flex size-10 items-center justify-center rounded-lg bg-[#f47832] text-white disabled:opacity-40"
                        >
                          <Plus className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="rounded-[20px] border border-[#eceef3] bg-white p-3 sm:p-4 lg:sticky lg:top-6">
            <h2 className="border-b border-[#f0f1f4] pb-3 text-[22px] font-bold text-[#1c1f24] sm:text-[24px]">
              Order Summary
            </h2>
            <dl className="mt-3 space-y-3 text-[16px] sm:text-[17px]">
              <div className="flex items-center justify-between">
                <dt className="text-[#8d939c]">Subtotal</dt>
                <dd className="font-medium text-[#1c1f24]">{naira(cart?.subtotal ?? 0)}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-[#f0f1f4] pt-4">
                <dt className="font-bold text-[#1c1f24]">Total</dt>
                <dd className="font-bold text-[#1c1f24]">{naira(cart?.subtotal ?? 0)}</dd>
              </div>
            </dl>
            {message ? <p className="mt-4 text-[14px] text-danger">{message}</p> : null}
            <a
              href="/checkout"
              className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-lg bg-[#f47832] text-[16px] font-medium text-white hover:bg-[#e56d28]"
            >
              Proceed to Checkout
            </a>
          </aside>
        </div>
      )}
    </div>
  );
}
