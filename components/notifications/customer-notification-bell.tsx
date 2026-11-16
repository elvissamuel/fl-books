"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Bell } from "lucide-react";
import { CustomerNotificationDialog } from "@/components/notifications/customer-notification-dialog";
import { formatNotificationTime } from "@/components/notifications/format";
import type { Notification } from "@/core/notifications/private-api";
import {
  getCustomerNotificationUnreadCount,
  listCustomerNotifications,
} from "@/infrastructure/notifications/notification-actions";
import { ptSerif } from "@/lib/public-font";
import { cn } from "@/lib/utils";

export function CustomerNotificationBell({ tone = "dark" }: { tone?: "light" | "dark" }) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ top: 0, right: 0 });
  const [count, setCount] = useState(0);
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState("");

  function place() {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition({ top: rect.bottom + 10, right: Math.max(12, window.innerWidth - rect.right) });
  }

  useEffect(() => {
    setMounted(true);
    let cancelled = false;
    void getCustomerNotificationUnreadCount().then((result) => {
      if (!cancelled && result.ok) setCount(result.data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    place();
    let cancelled = false;
    setLoading(true);
    setError("");
    void listCustomerNotifications({ page: 1, size: 5 }).then((result) => {
      if (cancelled) return;
      setLoading(false);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setItems(Array.isArray(result.data.data) ? result.data.data : []);
    });
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
      cancelled = true;
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open]);

  async function refreshCount() {
    const result = await getCustomerNotificationUnreadCount();
    if (result.ok) setCount(result.data);
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={count > 0 ? `Notifications, ${count} unread` : "Notifications"}
        onClick={() => {
          place();
          setOpen((current) => !current);
        }}
        className={cn("relative", tone === "light" ? "text-white" : "text-[#1c1f24]")}
      >
        <Bell className="size-[18px]" strokeWidth={1.75} />
        {count > 0 ? (
          <span className="absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#f47832] px-1 text-[10px] font-semibold leading-none text-white">
            {count > 99 ? "99+" : count}
          </span>
        ) : null}
      </button>
      {mounted && open
        ? createPortal(
            <div
              ref={panelRef}
              className={`${ptSerif.className} fixed z-[80] w-[min(22.5rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-[#e4e7ec] bg-white text-[#1c1f24] shadow-[0_18px_50px_rgba(17,17,22,0.14)]`}
              style={{ top: position.top, right: position.right }}
            >
              <div className="flex items-center justify-between border-b border-[#f2f4f7] px-4 py-3">
                <p className="text-sm font-semibold">Notifications</p>
                <p className="text-xs text-[#667085]">{count > 0 ? `${count} unread` : "All caught up"}</p>
              </div>
              {loading ? (
                <div className="space-y-3 px-4 py-4">
                  {Array.from({ length: 3 }, (_, index) => (
                    <div key={index} className="h-12 animate-pulse rounded-xl bg-[#f4f5f9]" />
                  ))}
                </div>
              ) : error ? (
                <p className="px-4 py-6 text-sm text-danger">{error}</p>
              ) : items.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-[#667085]">No notifications yet.</p>
              ) : (
                <ul>
                  {items.map((item) => (
                    <li key={item.id} className="border-b border-[#f2f4f7] last:border-b-0">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedId(item.id);
                          setOpen(false);
                        }}
                        className={cn(
                          "flex w-full gap-3 px-4 py-3 text-left hover:bg-[#f7f8f7]",
                          item.read ? "bg-white" : "bg-[#f4f7f6]",
                        )}
                      >
                        <span
                          className={cn(
                            "mt-1.5 size-2 shrink-0 rounded-full",
                            item.read ? "bg-transparent" : "bg-brand",
                          )}
                        />
                        <span className="min-w-0">
                          <span className="flex items-baseline justify-between gap-3">
                            <span className={cn("truncate text-sm", item.read ? "font-medium" : "font-semibold")}>
                              {item.title}
                            </span>
                            <span className="shrink-0 text-[11px] text-[#98a2b3]">
                              {formatNotificationTime(item.createdAt)}
                            </span>
                          </span>
                          <span className="mt-0.5 line-clamp-2 block text-xs leading-5 text-[#667085]">
                            {item.message}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>,
            document.body,
          )
        : null}
      {mounted && selectedId ? (
        <CustomerNotificationDialog
          id={selectedId}
          onClose={() => setSelectedId("")}
          onRead={() => {
            setItems((current) =>
              current.map((item) => (item.id === selectedId ? { ...item, read: true } : item)),
            );
            void refreshCount();
          }}
        />
      ) : null}
    </>
  );
}
