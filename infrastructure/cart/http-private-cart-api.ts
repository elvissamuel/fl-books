import "server-only";

import type { PrivateCartApi } from "@/core/cart/private-api";
import { apiJson } from "@/infrastructure/http/api-client";

export const privateCartEndpoints = {
  cart: "/api/v1/cart/public",
  items: "/api/v1/cart/public/items",
  item: (cartItemId: string) => `/api/v1/cart/private/items/${encodeURIComponent(cartItemId)}`,
  patchItem: (cartItemId: string) => `/api/v1/cart/items/${encodeURIComponent(cartItemId)}`,
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

export const privateCartApi: PrivateCartApi = {
  get(accessToken) {
    return apiJson(privateCartEndpoints.cart, withAccessToken(accessToken));
  },

  addItem(request, accessToken) {
    return apiJson(
      privateCartEndpoints.items,
      withAccessToken(accessToken, {
        method: "POST",
        body: JSON.stringify(request),
      }),
    );
  },

  updateItem(cartItemId, request, accessToken) {
    return apiJson(
      privateCartEndpoints.patchItem(cartItemId),
      withAccessToken(accessToken, {
        method: "PATCH",
        body: JSON.stringify(request),
      }),
    );
  },

  removeItem(cartItemId, accessToken) {
    return apiJson(
      privateCartEndpoints.item(cartItemId),
      withAccessToken(accessToken, { method: "DELETE" }),
    );
  },

  clear(accessToken) {
    return apiJson(
      privateCartEndpoints.cart,
      withAccessToken(accessToken, { method: "DELETE" }),
    );
  },
};
