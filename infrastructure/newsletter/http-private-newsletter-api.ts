import "server-only";

import type { NewsletterListQuery, PrivateNewsletterApi } from "@/core/newsletter/private-api";
import { apiJson } from "@/infrastructure/http/api-client";

export const privateNewsletterEndpoints = {
  list: "/api/v1/newsletter/private",
  export: "/api/v1/newsletter/private/export",
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

function listSearch(query: NewsletterListQuery) {
  const search = new URLSearchParams({
    page: String(query.page),
    size: String(query.size),
  });
  const term = query.search?.trim();
  if (term) search.set("search", term);
  return search;
}

export const privateNewsletterApi: PrivateNewsletterApi = {
  list(query, accessToken) {
    return apiJson(
      `${privateNewsletterEndpoints.list}?${listSearch(query).toString()}`,
      withAccessToken(accessToken),
    );
  },
};
