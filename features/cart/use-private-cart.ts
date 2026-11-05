"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AddCartItemRequest, UpdateCartItemRequest } from "@/core/cart/cart";
import { unwrapAction } from "@/features/auth/unwrap-action";
import { cartKeys } from "@/features/cart/query-keys";
import {
  addPrivateCartItem,
  clearPrivateCart,
  getPrivateCart,
  removePrivateCartItem,
  updatePrivateCartItem,
} from "@/infrastructure/cart/private-cart-actions";

function useRefreshCart() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: cartKeys.all });
}

export function usePrivateCart() {
  return useQuery({
    queryKey: cartKeys.private(),
    queryFn: async () => unwrapAction(await getPrivateCart()),
  });
}

export function useAddPrivateCartItem() {
  const refresh = useRefreshCart();
  return useMutation({
    mutationFn: async (request: AddCartItemRequest) => unwrapAction(await addPrivateCartItem(request)),
    onSuccess: refresh,
  });
}

export function useUpdatePrivateCartItem() {
  const refresh = useRefreshCart();
  return useMutation({
    mutationFn: async ({
      cartItemId,
      request,
    }: {
      cartItemId: string;
      request: UpdateCartItemRequest;
    }) => unwrapAction(await updatePrivateCartItem(cartItemId, request)),
    onSuccess: refresh,
  });
}

export function useRemovePrivateCartItem() {
  const refresh = useRefreshCart();
  return useMutation({
    mutationFn: async (cartItemId: string) => unwrapAction(await removePrivateCartItem(cartItemId)),
    onSuccess: refresh,
  });
}

export function useClearPrivateCart() {
  const refresh = useRefreshCart();
  return useMutation({
    mutationFn: async () => unwrapAction(await clearPrivateCart()),
    onSuccess: refresh,
  });
}
