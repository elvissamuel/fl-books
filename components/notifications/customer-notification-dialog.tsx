"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { formatNotificationTime, notificationTypeLabel } from "@/components/notifications/format";
import type { Notification } from "@/core/notifications/private-api";
import {
  getCustomerNotification,
  markCustomerNotificationRead,
} from "@/infrastructure/notifications/notification-actions";
import { ptSerif } from "@/lib/public-font";

export function CustomerNotificationDialog({
  id,
  onClose,
  onRead,
}: {
  id: string;
  onClose: () => void;
  onRead: () => void;
}) {
  const titleId = useId();
  const dialogRef = useRef<HTMLElement>(null);
  const onCloseRef = useRef(onClose);
  const onReadRef = useRef(onRead);
  const [item, setItem] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  onCloseRef.current = onClose;
  onReadRef.current = onRead;

  useEffect(() => {
    dialogRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCloseRef.current();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    void getCustomerNotification(id).then(async (result) => {
      if (cancelled) return;
      if (!result.ok) {
        setError(result.message);
        setLoading(false);
        return;
      }
      setItem(result.data);
      setLoading(false);
      if (result.data.read) return;
      const marked = await markCustomerNotificationRead(id);
      if (cancelled || !marked.ok) return;
      setItem(marked.data);
      onReadRef.current();
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return createPortal(
    <div className={`${ptSerif.className} fixed inset-0 z-[90] flex items-center justify-center px-4`}>
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/45"
        aria-label="Close notification"
        onClick={onClose}
      />
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-[480px] overflow-y-auto rounded-2xl bg-white px-6 pt-5 pb-6 text-[#1c1f24] shadow-[0_18px_50px_rgba(17,24,22,0.18)] outline-none"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium tracking-wide text-brand uppercase">
              {item ? notificationTypeLabel(item.type) : "Notification"}
            </p>
            <h2 id={titleId} className="mt-1 text-lg font-semibold tracking-tight">
              {item?.title ?? "Notification"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-8 items-center justify-center rounded-full text-[#667085] hover:bg-[#f4f5f9] hover:text-[#1c1f24]"
            aria-label="Close"
          >
            <X className="size-4" strokeWidth={1.75} />
          </button>
        </div>
        {loading ? (
          <div className="space-y-3">
            <div className="h-16 animate-pulse rounded-xl bg-[#f4f5f9]" />
            <div className="h-10 animate-pulse rounded-xl bg-[#f4f5f9]" />
          </div>
        ) : null}
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        {item ? (
          <div className="space-y-4">
            <p className="rounded-xl bg-[#f7faf8] px-4 py-3 text-sm leading-6 text-[#3d4450]">{item.message}</p>
            <dl className="text-sm">
              <dt className="text-xs text-[#98a2b3]">Received</dt>
              <dd className="mt-0.5 font-medium">{formatNotificationTime(item.createdAt)}</dd>
            </dl>
          </div>
        ) : null}
        <button
          type="button"
          onClick={onClose}
          className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-lg bg-brand text-sm font-medium text-white hover:bg-brand-hover"
        >
          Close
        </button>
      </section>
    </div>,
    document.body,
  );
}
