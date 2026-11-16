"use client";

import { useState } from "react";
import { CheckCheck, Search, Trash2 } from "lucide-react";
import { BooksPagination } from "@/components/books/books-pagination";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { NotificationDetailDialog } from "@/components/notifications/notification-detail-dialog";
import { formatNotificationTime, notificationTypeLabel } from "@/components/notifications/format";
import { notificationTypes, type NotificationType } from "@/core/notifications/private-api";
import {
  useDeletePrivateNotification,
  useMarkAllPrivateNotificationsRead,
  usePrivateNotificationUnreadCount,
  usePrivateNotifications,
} from "@/features/notifications/use-notifications";
import { cn } from "@/lib/utils";

const pageSize = 8;
type ReadFilter = "all" | "unread" | "read";

export function NotificationsScreen() {
  const [search, setSearch] = useState("");
  const [readFilter, setReadFilter] = useState<ReadFilter>("all");
  const [type, setType] = useState<NotificationType | "">("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState("");
  const [confirmingId, setConfirmingId] = useState("");
  const [actionError, setActionError] = useState("");
  const unread = usePrivateNotificationUnreadCount();
  const markAll = useMarkAllPrivateNotificationsRead();
  const remove = useDeletePrivateNotification();
  const notifications = usePrivateNotifications({
    page,
    size: pageSize,
    search: search.trim() || undefined,
    read: readFilter === "all" ? undefined : readFilter === "read",
    type: type || undefined,
  });
  const pageData = notifications.data;
  const items = Array.isArray(pageData?.data) ? pageData.data : [];
  const totalPages = Math.max(pageData?.totalPage ?? 1, 1);
  const unreadCount = typeof unread.data === "number" ? unread.data : 0;

  function updateSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function updateRead(next: ReadFilter) {
    setReadFilter(next);
    setPage(1);
  }

  function updateType(next: string) {
    setType(notificationTypes.includes(next as NotificationType) ? (next as NotificationType) : "");
    setPage(1);
  }

  function deleteNotification(id: string) {
    setActionError("");
    remove.mutate(id, {
      onSuccess: () => setConfirmingId(""),
      onError: (error) => {
        setActionError(error instanceof Error ? error.message : "Could not delete this notification.");
      },
    });
  }

  return (
    <div className="px-5 pt-5 pb-8">
      <header className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-950">Notifications</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {unreadCount > 0 ? `${unreadCount} unread` : "You are up to date"}
          </p>
        </div>
        <NotificationBell />
      </header>

      <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative block w-full sm:w-[280px]">
            <span className="sr-only">Search notifications</span>
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
            <input
              value={search}
              onChange={(event) => updateSearch(event.target.value)}
              placeholder="Search notifications"
              className="h-10 w-full rounded-full border border-neutral-200 bg-white pr-4 pl-9 text-sm text-neutral-800 outline-none placeholder:text-neutral-400 focus:border-brand focus:ring-2 focus:ring-brand/15"
            />
          </label>
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by status">
            {(
              [
                ["all", "All"],
                ["unread", "Unread"],
                ["read", "Read"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                aria-pressed={readFilter === id}
                onClick={() => updateRead(id)}
                className={cn(
                  "h-10 rounded-full border px-4 text-sm font-medium",
                  readFilter === id
                    ? "border-brand bg-brand text-white"
                    : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <label className="block">
            <span className="sr-only">Notification type</span>
            <select
              value={type}
              onChange={(event) => updateType(event.target.value)}
              className="h-10 rounded-full border border-neutral-200 bg-white px-4 text-sm text-neutral-700 outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
            >
              <option value="">All types</option>
              {notificationTypes.map((option) => (
                <option key={option} value={option}>
                  {notificationTypeLabel(option)}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button
          type="button"
          disabled={markAll.isPending || unreadCount === 0}
          onClick={() => {
            setActionError("");
            markAll.mutate(undefined, {
              onError: (error) => {
                setActionError(error instanceof Error ? error.message : "Could not mark notifications as read.");
              },
            });
          }}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-brand px-4 text-sm font-medium text-white hover:bg-brand-hover disabled:opacity-60"
        >
          <CheckCheck className="size-4" strokeWidth={1.75} />
          {markAll.isPending ? "Marking…" : "Mark all as read"}
        </button>
      </div>

      {actionError ? <p className="mb-3 text-sm text-danger">{actionError}</p> : null}
      {notifications.error instanceof Error ? (
        <p className="mb-3 text-sm text-danger">{notifications.error.message}</p>
      ) : null}

      {notifications.isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-16 text-center">
          <p className="text-sm font-medium text-neutral-800">No notifications</p>
          <p className="mt-1 text-sm text-neutral-500">New paid orders will show up here.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => {
            const read = item.read;
            const confirming = confirmingId === item.id;
            return (
              <li key={item.id}>
                <article
                  className={cn(
                    "rounded-2xl border bg-white px-4 py-4 shadow-[0_1px_2px_rgba(17,17,22,0.04)] sm:px-5",
                    read ? "border-neutral-200" : "border-brand/25 bg-[#f7faf8]",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedId(item.id)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <span className="flex flex-wrap items-center gap-2">
                        <span className={cn("size-2 rounded-full", read ? "bg-neutral-300" : "bg-brand")} />
                        <span className={cn("text-sm text-neutral-950", read ? "font-medium" : "font-semibold")}>
                          {item.title}
                        </span>
                        <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-medium text-brand">
                          {notificationTypeLabel(item.type)}
                        </span>
                      </span>
                      <span className="mt-1.5 block text-sm leading-6 text-neutral-600">{item.message}</span>
                      <span className="mt-2 block text-xs text-neutral-400">
                        {formatNotificationTime(item.createdAt)}
                      </span>
                    </button>
                    {confirming ? (
                      <span className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          disabled={remove.isPending}
                          onClick={() => deleteNotification(item.id)}
                          className="text-xs font-medium text-danger hover:underline disabled:opacity-60"
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmingId("")}
                          className="text-xs font-medium text-neutral-500 hover:text-neutral-800"
                        >
                          Cancel
                        </button>
                      </span>
                    ) : (
                      <button
                        type="button"
                        aria-label={`Delete ${item.title}`}
                        onClick={() => setConfirmingId(item.id)}
                        className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-danger"
                      >
                        <Trash2 className="size-4" strokeWidth={1.75} />
                      </button>
                    )}
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}

      {items.length > 0 ? (
        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="text-sm text-neutral-500">
            Page {page} of {totalPages}
          </p>
          <BooksPagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      ) : null}
      {selectedId ? <NotificationDetailDialog id={selectedId} onClose={() => setSelectedId("")} /> : null}
    </div>
  );
}
