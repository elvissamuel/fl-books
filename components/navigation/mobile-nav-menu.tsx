"use client";

import { useEffect, useRef, useState, type TransitionEvent } from "react";
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
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [present, setPresent] = useState(false);
  const [shown, setShown] = useState(false);
  const cartLabel = count > 99 ? "99+" : String(count);

  useEffect(() => {
    if (open) {
      setPresent(true);
      return;
    }
    setShown(false);
  }, [open]);

  useEffect(() => {
    if (!present || !open) return;
    const frame = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(frame);
  }, [present, open]);

  useEffect(() => {
    if (open || !present) return;
    const timer = window.setTimeout(() => setPresent(false), 320);
    return () => window.clearTimeout(timer);
  }, [open, present]);

  useEffect(() => {
    if (!present) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    function onResize() {
      if (window.innerWidth >= 768) setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [present]);

  function closeAfterSlide(event: TransitionEvent<HTMLDivElement>) {
    if (event.target !== panelRef.current || event.propertyName !== "transform" || open) return;
    setPresent(false);
  }

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-nav-menu"
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "inline-flex size-9 items-center justify-center md:hidden",
          tone === "light" ? "text-white" : "text-[#1c1f24]",
        )}
      >
        {open ? <X className="size-5" strokeWidth={1.75} /> : <Menu className="size-5" strokeWidth={1.75} />}
      </button>
      {present
        ? createPortal(
            <div className={ptSerif.className}>
              <button
                type="button"
                aria-label="Close menu"
                tabIndex={-1}
                onClick={() => setOpen(false)}
                className={cn(
                  "fixed inset-0 z-[80] bg-black/50 transition-opacity duration-300 ease-out motion-reduce:transition-none",
                  shown ? "opacity-100" : "opacity-0",
                )}
              />
              <div
                ref={panelRef}
                id="mobile-nav-menu"
                role="dialog"
                aria-modal="true"
                aria-label="Menu"
                onTransitionEnd={closeAfterSlide}
                className={cn(
                  "fixed inset-y-0 right-0 z-[81] flex h-dvh w-[min(86vw,360px)] flex-col bg-white text-[#1c1f24] shadow-[-16px_0_40px_rgba(0,0,0,0.18)] transition-transform duration-300 ease-out motion-reduce:transition-none",
                  shown ? "translate-x-0" : "translate-x-full",
                )}
              >
                <div className="flex items-center justify-end px-4 pt-5">
                  <button
                    type="button"
                    aria-label="Close menu"
                    onClick={() => setOpen(false)}
                    className="inline-flex size-9 items-center justify-center text-[#1c1f24]"
                  >
                    <X className="size-5" strokeWidth={1.75} />
                  </button>
                </div>
                <nav className="flex flex-1 flex-col px-3 pt-2">
                  {links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "rounded-lg px-3 py-3.5 text-[16px] hover:bg-[#f4f5f9]",
                        link.label === active ? "font-bold text-brand" : "text-[#3a3f46]",
                      )}
                    >
                      {link.label}
                    </a>
                  ))}
                  <div className="my-2 border-t border-[#eceff3]" />
                  <a
                    href="/cart"
                    onClick={() => setOpen(false)}
                    aria-label={`Cart, ${count} items`}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-3.5 text-[16px] text-[#3a3f46] hover:bg-[#f4f5f9]"
                  >
                    <span className="relative">
                      <ShoppingCart className="size-[18px]" strokeWidth={1.75} />
                      <span className="absolute -top-2 -right-2 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#f08c2e] px-1 text-[9px] font-semibold text-white">
                        {cartLabel}
                      </span>
                    </span>
                    Cart
                  </a>
                </nav>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
