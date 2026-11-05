"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { clearCustomerSession } from "@/app/customer/session/actions";
import { ptSerif } from "@/lib/public-font";

export function AccountMenu() {
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, right: 0 });
  const [pending, setPending] = useState(false);

  function place() {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition({ top: rect.bottom + 10, right: Math.max(12, window.innerWidth - rect.right) });
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
    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open]);

  async function logout() {
    setPending(true);
    await clearCustomerSession();
    setOpen(false);
    router.refresh();
    router.push("/");
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label="Account"
        aria-expanded={open}
        onClick={() => {
          place();
          setOpen((current) => !current);
        }}
        className="rounded-full"
      >
        <Image src="/admin-profile.png" alt="" width={32} height={32} className="size-8 rounded-full object-cover" />
      </button>
      {open
        ? createPortal(
            <div
              ref={panelRef}
              className={`${ptSerif.className} fixed z-[80] w-40 overflow-hidden rounded-xl bg-white py-1 text-[#1c1f24] shadow-[0_12px_40px_rgba(0,0,0,0.16)]`}
              style={{ top: position.top, right: position.right }}
            >
              <a href="/profile" className="block px-4 py-2.5 text-[14px] hover:bg-[#f4f5f9]">
                Profile
              </a>
              <button
                type="button"
                disabled={pending}
                onClick={logout}
                className="block w-full px-4 py-2.5 text-left text-[14px] hover:bg-[#f4f5f9] disabled:opacity-60"
              >
                {pending ? "Logging out..." : "Logout"}
              </button>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
