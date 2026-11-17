"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, ShoppingCart, X } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { ptSerif } from "@/lib/public-font";
import { cn } from "@/lib/utils";

const links = [
  { label: "Home", href: "/" },
  { label: "Books", href: "/books" },
  { label: "About Author", href: "/about" },
  { label: "Contact Us", href: "/contact" },
] as const;

export function MobileNavMenu({
  tone = "dark",
  active = "Home",
}: {
  tone?: "light" | "dark";
  active?: string;
}) {
  const { count } = useCart();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const cartLabel = count > 99 ? "99+" : String(count);
  const [position, setPosition] = useState({ top: 0, right: 0 });

  function place() {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition({ top: rect.bottom + 10, right: Math.max(16, window.innerWidth - rect.right) });
  }

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    function onResize() {
      if (window.innerWidth >= 768) {
        setOpen(false);
        return;
      }
      place();
    }
    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", place, true);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-nav-menu"
        onClick={() => {
          place();
          setOpen((current) => !current);
        }}
        className={cn(
          "inline-flex size-9 items-center justify-center md:hidden",
          tone === "light" ? "text-white" : "text-[#1c1f24]",
        )}
      >
        {open ? <X className="size-5" strokeWidth={1.75} /> : <Menu className="size-5" strokeWidth={1.75} />}
      </button>
      {open
        ? createPortal(
            <div
              ref={panelRef}
              id="mobile-nav-menu"
              className={`${ptSerif.className} fixed z-[80] w-52 overflow-hidden rounded-xl bg-white py-1.5 text-[#1c1f24] shadow-[0_16px_40px_rgba(0,0,0,0.18)]`}
              style={{ top: position.top, right: position.right }}
            >
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block px-4 py-2.5 text-[14.5px] hover:bg-[#f4f5f9]",
                    link.label === active ? "font-bold text-brand" : "text-[#3a3f46]",
                  )}
                >
                  {link.label}
                </a>
              ))}
              <div className="my-1.5 border-t border-[#eceff3]" />
              <a
                href="/cart"
                onClick={() => setOpen(false)}
                aria-label={`Cart, ${count} items`}
                className="flex items-center gap-2.5 px-4 py-2.5 text-[14.5px] text-[#3a3f46] hover:bg-[#f4f5f9]"
              >
                <span className="relative">
                  <ShoppingCart className="size-[18px]" strokeWidth={1.75} />
                  <span className="absolute -top-2 -right-2 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#f08c2e] px-1 text-[9px] font-semibold text-white">
                    {cartLabel}
                  </span>
                </span>
                Cart
              </a>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
