"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, Trash2, X } from "lucide-react";
import { cartCover, naira } from "@/components/cart/money";
import { useCart } from "@/components/cart/cart-provider";
import { listPublicBooks } from "@/infrastructure/books/public-books-actions";

export function CartPreview({ onClose }: { onClose: () => void }) {
  const { cart, removeItem } = useCart();
  const [blurbs, setBlurbs] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const items = cart?.items ?? [];
  const countLabel = String(items.length).padStart(2, "0");

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

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

  async function remove(cartItemId: string) {
    setMessage("");
    const result = await removeItem(cartItemId);
    if (!result.ok) setMessage(result.message);
  }

  return (
    <div className="w-[min(380px,calc(100vw-1.5rem))] overflow-hidden rounded-[22px] bg-white shadow-[0_18px_50px_rgba(17,24,22,0.18)]">
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <h2 className="text-[16px] font-semibold text-[#1c1f24]">Shopping Cart ({countLabel})</h2>
        <button
          type="button"
          aria-label="Close cart"
          onClick={onClose}
          className="inline-flex size-8 items-center justify-center rounded-full text-[#1c1f24] hover:bg-[#f4f5f9]"
        >
          <X className="size-4" strokeWidth={1.75} />
        </button>
      </div>
      <div className="max-h-[320px] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const cover = cartCover(item.coverImageUrls);
          return (
            <div key={item.cartItemId} className="flex gap-3 border-t border-[#f0f1f4] px-5 py-3">
              <div className="relative h-[68px] w-[52px] shrink-0 overflow-hidden rounded-md bg-[#f4f6f8]">
                {cover ? <Image src={cover} alt="" fill sizes="52px" className="object-contain" /> : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="line-clamp-1 text-[14px] font-semibold text-[#1c1f24]">{item.title}</p>
                  <button
                    type="button"
                    aria-label={`Remove ${item.title}`}
                    onClick={() => remove(item.cartItemId)}
                    className="shrink-0 text-[#b0b6bf] hover:text-[#e11d48]"
                  >
                    <Trash2 className="size-4" strokeWidth={1.75} />
                  </button>
                </div>
                {blurbs[item.bookId] ? (
                  <p className="mt-0.5 line-clamp-1 text-[12px] text-[#9aa1ab]">{blurbs[item.bookId]}</p>
                ) : null}
                <p className="mt-1 text-[13px] text-[#6d7480]">
                  {item.quantity} x {naira(item.unitPrice)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="border-t border-[#f0f1f4] px-5 pt-3 pb-4">
        <div className="flex items-center justify-between text-[14px]">
          <p className="text-[#8d939c]">Sub-Total:</p>
          <p className="font-semibold text-[#1c1f24]">{naira(cart?.subtotal ?? 0)}</p>
        </div>
        {message ? <p className="mt-2 text-[12px] text-danger">{message}</p> : null}
        <a
          href="/checkout"
          onClick={onClose}
          className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#f47832] text-[14px] font-medium text-white hover:bg-[#e56d28]"
        >
          Check Out
          <ArrowRight className="size-4" />
        </a>
        <a
          href="/cart"
          onClick={onClose}
          className="mt-2 inline-flex h-10 w-full items-center justify-center text-[14px] font-medium text-[#1c1f24] hover:text-brand"
        >
          View Cart
        </a>
      </div>
    </div>
  );
}
