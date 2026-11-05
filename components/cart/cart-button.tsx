"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { CartPreview } from "@/components/cart/cart-preview";
import { useCart } from "@/components/cart/cart-provider";
import { cn } from "@/lib/utils";

export function CartButton({ className }: { className?: string }) {
  const router = useRouter();
  const { count, ready } = useCart();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, right: 0 });
  const label = count > 99 ? "99+" : String(count);

  function place() {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition({ top: rect.bottom + 12, right: Math.max(12, window.innerWidth - rect.right) });
  }

  function onClick() {
    if (!ready) return;
    if (count === 0) {
      router.push("/cart");
      return;
    }
    place();
    setOpen((current) => !current);
  }

  useEffect(() => {
    if (open && count === 0) setOpen(false);
  }, [open, count]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
    }
    function onLayout() {
      place();
    }
    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("resize", onLayout);
    window.addEventListener("scroll", onLayout, true);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("resize", onLayout);
      window.removeEventListener("scroll", onLayout, true);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label={`Cart, ${count} items`}
        aria-expanded={open}
        onClick={onClick}
        className={cn("relative", className)}
      >
        <ShoppingCart className="size-[18px]" strokeWidth={1.75} />
        <span className="absolute -top-2 -right-2 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#f08c2e] px-1 text-[9px] font-semibold text-white">
          {label}
        </span>
      </button>
      {open
        ? createPortal(
            <div ref={panelRef} className="fixed z-50" style={{ top: position.top, right: position.right }}>
              <CartPreview onClose={() => setOpen(false)} />
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
