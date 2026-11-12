import "server-only";

import type { GetInTouchListQuery, PrivateGetInTouchApi } from "@/core/get-in-touch/private-api";
import { apiJson } from "@/infrastructure/http/api-client";

export const privateGetInTouchEndpoints = {
  list: "/api/v1/get-in-touch/private",
  byId: (messageId: string) => `/api/v1/get-in-touch/private/${encodeURIComponent(messageId)}`,
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

function listSearch(query: GetInTouchListQuery) {
  const search = new URLSearchParams({
    page: String(query.page),
    size: String(query.size),
  });
  const term = query.search?.trim();
  const email = query.email?.trim();
  if (term) search.set("search", term);
  if (email) search.set("email", email);
  return search;
}

export const privateGetInTouchApi: PrivateGetInTouchApi = {
  list(query, accessToken) {
    return apiJson(
      `${privateGetInTouchEndpoints.list}?${listSearch(query).toString()}`,
      withAccessToken(accessToken),
    );
  },

  get(messageId, accessToken) {
    return apiJson(privateGetInTouchEndpoints.byId(messageId), withAccessToken(accessToken));
  },

  update(messageId, request, accessToken) {
    return apiJson(
      privateGetInTouchEndpoints.byId(messageId),
      withAccessToken(accessToken, {
        method: "PATCH",
        body: JSON.stringify(request),
      }),
    );
  },

  delete(messageId, accessToken) {
    return apiJson(
      privateGetInTouchEndpoints.byId(messageId),
      withAccessToken(accessToken, { method: "DELETE" }),
    );
  },
};
