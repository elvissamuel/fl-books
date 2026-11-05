"use client";

import type { AddCartItemRequest, Cart, UpdateCartItemRequest } from "@/core/cart/cart";
import { browserApi } from "@/infrastructure/http/browser-api";

const cart = "/api/v1/cart/public";
const items = "/api/v1/cart/public/items";
const item = (cartItemId: string) => `/api/v1/cart/private/items/${encodeURIComponent(cartItemId)}`;
const patchItem = (cartItemId: string) => `/api/v1/cart/items/${encodeURIComponent(cartItemId)}`;

export async function getPrivateCart() {
  return browserApi<Cart>(cart);
}

export async function addPrivateCartItem(request: AddCartItemRequest) {
  return browserApi<Cart>(items, { method: "POST", json: request });
}

export async function updatePrivateCartItem(cartItemId: string, request: UpdateCartItemRequest) {
  return browserApi<Cart>(patchItem(cartItemId), { method: "PATCH", json: request });
}

export async function removePrivateCartItem(cartItemId: string) {
  return browserApi<Cart>(item(cartItemId), { method: "DELETE" });
}

export async function clearPrivateCart() {
  return browserApi<string>(cart, { method: "DELETE" });
}
