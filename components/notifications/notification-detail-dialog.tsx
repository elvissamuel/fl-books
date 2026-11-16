"use client";

import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import { formatNotificationTime, notificationTypeLabel } from "@/components/notifications/format";
import { Button } from "@/components/ui/button";
import { useMarkPrivateNotificationRead, usePrivateNotification } from "@/features/notifications/use-notifications";

export function NotificationDetailDialog({ id, onClose }: { id: string; onClose: () => void }) {
  const titleId = useId();
  const dialogRef = useRef<HTMLElement>(null);
  const onCloseRef = useRef(onClose);
  const markedRef = useRef("");
  const notification = usePrivateNotification(id);
  const markRead = useMarkPrivateNotificationRead();
  const item = notification.data;
  onCloseRef.current = onClose;

  useEffect(() => {
    dialogRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCloseRef.current();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!item || item.read || markedRef.current === item.id) return;
    markedRef.current = item.id;
    markRead.mutate(item.id);
  }, [item, markRead]);

  return (
    <div className="fixed inset-y-0 right-0 left-0 z-[70] flex items-center justify-center px-4 md:left-[232px]">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/25"
        aria-label="Close notification"
        onClick={onClose}
      />
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-[480px] overflow-y-auto rounded-2xl bg-white px-6 pt-5 pb-6 shadow-[0_18px_50px_rgba(17,24,22,0.18)] outline-none"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium tracking-wide text-brand uppercase">
              {item ? notificationTypeLabel(item.type) : "Notification"}
            </p>
            <h2 id={titleId} className="mt-1 text-lg font-semibold tracking-tight text-neutral-950">
              {item?.title ?? "Notification"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-8 items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
            aria-label="Close"
          >
            <X className="size-4" strokeWidth={1.75} />
          </button>
        </div>

        {notification.isLoading ? (
          <div className="space-y-3">
            <div className="h-16 animate-pulse rounded-xl bg-neutral-100" />
            <div className="h-10 animate-pulse rounded-xl bg-neutral-100" />
          </div>
        ) : null}
        {notification.error instanceof Error ? (
          <p className="text-sm text-danger">{notification.error.message}</p>
        ) : null}
        {item ? (
          <div className="space-y-4">
            <p className="rounded-xl bg-[#f7faf8] px-4 py-3 text-sm leading-6 text-neutral-700">{item.message}</p>
            <dl className="text-sm">
              <dt className="text-xs text-neutral-400">Received</dt>
              <dd className="mt-0.5 font-medium text-neutral-800">{formatNotificationTime(item.createdAt)}</dd>
            </dl>
          </div>
        ) : null}

        <Button
          type="button"
          onClick={onClose}
          className="mt-5 h-11 w-full rounded-lg bg-brand text-sm font-medium text-white hover:bg-brand-hover"
        >
          Close
        </Button>
      </section>
    </div>
  );
}
