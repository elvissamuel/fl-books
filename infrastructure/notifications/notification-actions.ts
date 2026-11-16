"use client";

import type {
  Notification,
  NotificationFilter,
  PaginatedNotifications,
} from "@/core/notifications/private-api";
import { browserApi, setQuery, withSearch } from "@/infrastructure/http/browser-api";

const customerSession = { "X-Customer-Session": "1" };

const filter = "/api/v1/notifications/private/filter";
const list = "/api/v1/notifications/private";
const readAll = "/api/v1/notifications/private/read-all";
const unreadCount = "/api/v1/notifications/private/unread-count";
const byId = (id: string) => `/api/v1/notifications/private/${encodeURIComponent(id)}`;
const markRead = (id: string) => `${byId(id)}/read`;

function listSearch(query: NotificationFilter) {
  const search = new URLSearchParams({
    page: String(query.page),
    size: String(query.size),
  });
  setQuery(search, "search", query.search?.trim());
  setQuery(search, "read", query.read);
  setQuery(search, "type", query.type);
  setQuery(search, "orderId", query.orderId?.trim());
  return search;
}

export async function filterPrivateNotifications(request: NotificationFilter) {
  return browserApi<PaginatedNotifications>(filter, { method: "POST", json: request });
}

export async function markPrivateNotificationRead(id: string) {
  return browserApi<Notification>(markRead(id), { method: "PATCH" });
}

export async function markAllPrivateNotificationsRead() {
  return browserApi<number>(readAll, { method: "PATCH" });
}

export async function listPrivateNotifications(query: NotificationFilter) {
  return browserApi<PaginatedNotifications>(withSearch(list, listSearch(query)));
}

export async function getPrivateNotification(id: string) {
  return browserApi<Notification>(byId(id));
}

export async function deletePrivateNotification(id: string) {
  return browserApi<string>(byId(id), { method: "DELETE", allowEmptyData: true });
}

export async function getPrivateNotificationUnreadCount() {
  return browserApi<number>(unreadCount);
}

export async function listCustomerNotifications(query: NotificationFilter) {
  return browserApi<PaginatedNotifications>(withSearch(list, listSearch(query)), {
    headers: customerSession,
  });
}

export async function getCustomerNotification(id: string) {
  return browserApi<Notification>(byId(id), { headers: customerSession });
}

export async function markCustomerNotificationRead(id: string) {
  return browserApi<Notification>(markRead(id), { method: "PATCH", headers: customerSession });
}

export async function getCustomerNotificationUnreadCount() {
  return browserApi<number>(unreadCount, { headers: customerSession });
}
