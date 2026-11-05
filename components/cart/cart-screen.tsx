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
    <div className="mx-auto w-full max-w-[1180px] px-6 py-8 sm:px-10 lg:px-14">
      <button
        type="button"
        onClick={goBack}
        className="inline-flex items-center gap-2 text-[22px] font-semibold text-[#1c1f24]"
      >
        <ChevronLeft className="size-5" strokeWidth={1.75} />
        Cart ({items.length})
      </button>

      {items.length === 0 ? (
        <div className="flex min-h-[520px] flex-col">
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
        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-[18px] border border-[#eceef3] bg-white">
            {items.map((item) => {
              const cover = cartCover(item.coverImageUrls);
              const busy = busyId === item.cartItemId;
              return (
                <article
                  key={item.cartItemId}
                  className="flex gap-4 border-b border-[#f0f1f4] px-4 py-5 last:border-b-0 sm:px-5"
                >
                  <div className="relative h-[96px] w-[74px] shrink-0 overflow-hidden rounded-lg bg-[#f4f6f8]">
                    {cover ? <Image src={cover} alt="" fill sizes="74px" className="object-contain" /> : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="text-[16px] font-semibold text-[#1c1f24]">{item.title}</h2>
                        {blurbs[item.bookId] ? (
                          <p className="mt-1 line-clamp-1 text-[13px] text-[#9aa1ab]">{blurbs[item.bookId]}</p>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${item.title}`}
                        disabled={busy}
                        onClick={() => remove(item.cartItemId)}
                        className="shrink-0 text-[#c5cad1] hover:text-[#e11d48] disabled:opacity-40"
                      >
                        <Trash2 className="size-[18px]" strokeWidth={1.75} />
                      </button>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <p className="text-[15px] font-semibold text-brand">{naira(item.unitPrice)}</p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          disabled={busy || item.quantity <= 1}
                          onClick={() => changeQuantity(item.cartItemId, item.quantity - 1)}
                          className="inline-flex size-8 items-center justify-center rounded-lg bg-[#fde8dc] text-[#c46a45] disabled:opacity-40"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-5 text-center text-[14px] font-semibold text-[#1c1f24]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          disabled={busy}
                          onClick={() => changeQuantity(item.cartItemId, item.quantity + 1)}
                          className="inline-flex size-8 items-center justify-center rounded-lg bg-[#f47832] text-white disabled:opacity-40"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="rounded-[18px] border border-[#eceef3] bg-white p-5 lg:sticky lg:top-6">
            <h2 className="border-b border-[#f0f1f4] pb-3 text-[16px] font-semibold text-[#1c1f24]">
              Order Summary
            </h2>
            <dl className="mt-4 space-y-3 text-[14px]">
              <div className="flex items-center justify-between">
                <dt className="text-[#8d939c]">Subtotal</dt>
                <dd className="font-medium text-[#1c1f24]">{naira(cart?.subtotal ?? 0)}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-[#f0f1f4] pt-3">
                <dt className="font-semibold text-[#1c1f24]">Total</dt>
                <dd className="font-semibold text-[#1c1f24]">{naira(cart?.subtotal ?? 0)}</dd>
              </div>
            </dl>
            {message ? <p className="mt-3 text-[12px] text-danger">{message}</p> : null}
            <a
              href="/checkout"
              className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#f47832] text-[14px] font-medium text-white hover:bg-[#e56d28]"
            >
              Proceed to Checkout
            </a>
          </aside>
        </div>
      )}
    </div>
  );
}
