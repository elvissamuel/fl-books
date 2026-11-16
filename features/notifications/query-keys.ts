import type { NotificationFilter } from "@/core/notifications/private-api";

export const notificationKeys = {
  all: ["notifications"] as const,
  list: (query: NotificationFilter) => [...notificationKeys.all, "list", query] as const,
  filter: (query: NotificationFilter) => [...notificationKeys.all, "filter", query] as const,
  detail: (id: string) => [...notificationKeys.all, "detail", id] as const,
  unreadCount: () => [...notificationKeys.all, "unread-count"] as const,
};
