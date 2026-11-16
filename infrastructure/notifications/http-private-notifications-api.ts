import "server-only";

import type { NotificationFilter, PrivateNotificationsApi } from "@/core/notifications/private-api";
import { apiJson } from "@/infrastructure/http/api-client";

export const privateNotificationEndpoints = {
  filter: "/api/v1/notifications/private/filter",
  list: "/api/v1/notifications/private",
  readAll: "/api/v1/notifications/private/read-all",
  unreadCount: "/api/v1/notifications/private/unread-count",
  byId: (id: string) => `/api/v1/notifications/private/${encodeURIComponent(id)}`,
  markRead: (id: string) => `/api/v1/notifications/private/${encodeURIComponent(id)}/read`,
} as const;

function withAccessToken(accessToken: string, init?: RequestInit): RequestInit {
  return {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...init?.headers,
    },
  };
}

function setQuery(
  search: URLSearchParams,
  key: string,
  value: string | number | boolean | undefined,
) {
  if (value === undefined || value === "") return;
  search.set(key, String(value));
}

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

function patch(accessToken: string) {
  return withAccessToken(accessToken, { method: "PATCH" });
}

export const privateNotificationsApi: PrivateNotificationsApi = {
  filter(request, accessToken) {
    return apiJson(
      privateNotificationEndpoints.filter,
      withAccessToken(accessToken, {
        method: "POST",
        body: JSON.stringify(request),
      }),
    );
  },

  markRead(id, accessToken) {
    return apiJson(privateNotificationEndpoints.markRead(id), patch(accessToken));
  },

  markAllRead(accessToken) {
    return apiJson(privateNotificationEndpoints.readAll, patch(accessToken));
  },

  list(query, accessToken) {
    return apiJson(
      `${privateNotificationEndpoints.list}?${listSearch(query).toString()}`,
      withAccessToken(accessToken),
    );
  },

  get(id, accessToken) {
    return apiJson(privateNotificationEndpoints.byId(id), withAccessToken(accessToken));
  },

  delete(id, accessToken) {
    return apiJson(
      privateNotificationEndpoints.byId(id),
      withAccessToken(accessToken, { method: "DELETE" }),
    );
  },

  unreadCount(accessToken) {
    return apiJson(privateNotificationEndpoints.unreadCount, withAccessToken(accessToken));
  },
};
