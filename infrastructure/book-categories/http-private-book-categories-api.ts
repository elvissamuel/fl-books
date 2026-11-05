import "server-only";

import type { PrivateBookCategoriesApi } from "@/core/book-categories/private-api";
import { categoryListSearchParams } from "@/infrastructure/book-categories/category-list-query";
import { apiJson } from "@/infrastructure/http/api-client";

export const privateBookCategoryEndpoints = {
  list: "/api/v1/book-categories/private",
  byId: (categoryId: string) =>
    `/api/v1/book-categories/private/${encodeURIComponent(categoryId)}`,
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

export const privateBookCategoriesApi: PrivateBookCategoriesApi = {
  list(query, accessToken) {
    const search = categoryListSearchParams(query);
    return apiJson(
      `${privateBookCategoryEndpoints.list}?${search.toString()}`,
      withAccessToken(accessToken),
    );
  },

  create(request, accessToken) {
    return apiJson(
      privateBookCategoryEndpoints.list,
      withAccessToken(accessToken, {
        method: "POST",
        body: JSON.stringify(request),
      }),
    );
  },

  update(categoryId, request, accessToken) {
    return apiJson(
      privateBookCategoryEndpoints.byId(categoryId),
      withAccessToken(accessToken, {
        method: "PUT",
        body: JSON.stringify(request),
      }),
    );
  },

  delete(categoryId, accessToken) {
    return apiJson(
      privateBookCategoryEndpoints.byId(categoryId),
      withAccessToken(accessToken, { method: "DELETE" }),
    );
  },
};
