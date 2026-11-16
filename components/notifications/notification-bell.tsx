"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationDetailDialog } from "@/components/notifications/notification-detail-dialog";
import { formatNotificationTime } from "@/components/notifications/format";
import { usePrivateNotificationUnreadCount, usePrivateNotifications } from "@/features/notifications/use-notifications";
import { cn } from "@/lib/utils";

const previewQuery = { page: 1, size: 5 };

export function NotificationBell() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const unread = usePrivateNotificationUnreadCount();
  const preview = usePrivateNotifications(previewQuery, open);
  const count = typeof unread.data === "number" ? unread.data : 0;
  const items = open && Array.isArray(preview.data?.data) ? preview.data.data : [];

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={count > 0 ? `Notifications, ${count} unread` : "Notifications"}
        onClick={() => setOpen((current) => !current)}
        className="relative size-9 rounded-full border-neutral-200 bg-white text-neutral-600 shadow-none"
      >
        <Bell className="size-4" strokeWidth={1.75} />
        {count > 0 ? (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#f47832] px-1 text-[10px] font-semibold leading-none text-white">
            {count > 99 ? "99+" : count}
          </span>
        ) : null}
      </Button>
      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-[min(22.5rem,calc(100vw-2.5rem))] overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_18px_50px_rgba(17,17,22,0.14)]">
          <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
            <p className="text-sm font-semibold text-neutral-950">Notifications</p>
            <p className="text-xs text-neutral-500">{count > 0 ? `${count} unread` : "All caught up"}</p>
          </div>
          {preview.isLoading ? (
            <div className="space-y-3 px-4 py-4">
              {Array.from({ length: 3 }, (_, index) => (
                <div key={index} className="h-12 animate-pulse rounded-xl bg-neutral-100" />
              ))}
            </div>
          ) : preview.error instanceof Error ? (
            <p className="px-4 py-6 text-sm text-danger">{preview.error.message}</p>
          ) : items.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-neutral-500">No notifications yet.</p>
          ) : (
            <ul>
              {items.map((item) => {
                const read = item.read;
                return (
                  <li key={item.id} className="border-b border-neutral-100 last:border-b-0">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedId(item.id);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex w-full gap-3 px-4 py-3 text-left hover:bg-[#f7f8f7]",
                        read ? "bg-white" : "bg-[#f4f7f6]",
                      )}
                    >
                      <span
                        className={cn("mt-1.5 size-2 shrink-0 rounded-full", read ? "bg-transparent" : "bg-brand")}
                      />
                      <span className="min-w-0">
                        <span className="flex items-baseline justify-between gap-3">
                          <span className={cn("truncate text-sm text-neutral-950", read ? "font-medium" : "font-semibold")}>
                            {item.title}
                          </span>
                          <span className="shrink-0 text-[11px] text-neutral-400">
                            {formatNotificationTime(item.createdAt)}
                          </span>
                        </span>
                        <span className="mt-0.5 line-clamp-2 block text-xs leading-5 text-neutral-500">
                          {item.message}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          <Link
            href="/admin/notifications"
            onClick={() => setOpen(false)}
            className="block border-t border-neutral-100 px-4 py-3 text-center text-sm font-medium text-brand hover:bg-[#f7f8f7]"
          >
            View all
          </Link>
        </div>
      ) : null}
      {selectedId ? <NotificationDetailDialog id={selectedId} onClose={() => setSelectedId("")} /> : null}
    </div>
  );
}
