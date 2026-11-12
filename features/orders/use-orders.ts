"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { FulfilmentStatus, OrderFilterRequest } from "@/core/orders/private-api";
import type { OrderListParams } from "@/core/orders/types";
import { unwrapAction } from "@/features/auth/unwrap-action";
import { ordersKeys } from "@/features/orders/query-keys";
import { getOrderDetail, listOrders, ordersApi } from "@/infrastructure/orders/orders-api";
import {
  cancelPrivateOrder,
  filterPrivateOrders,
  getPrivateOrder,
  updateOrderFulfilmentStatus,
} from "@/infrastructure/orders/private-orders-actions";

export function useOrders(params: OrderListParams) {
  return useQuery({
    queryKey: ordersKeys.list(params),
    queryFn: () => ordersApi.list(params),
    placeholderData: listOrders(params),
  });
}

export function useOrderDetail(id: string) {
  return useQuery({
    queryKey: ordersKeys.detail(id),
    queryFn: () => ordersApi.get(id),
    placeholderData: getOrderDetail(id),
  });
}

export function usePrivateOrders(query: OrderFilterRequest) {
  return useQuery({
    queryKey: ordersKeys.privateList(query),
    queryFn: async () => unwrapAction(await filterPrivateOrders(query)),
  });
}

export function usePrivateOrder(orderId: string) {
  return useQuery({
    queryKey: ordersKeys.privateDetail(orderId),
    queryFn: async () => unwrapAction(await getPrivateOrder(orderId)),
    enabled: orderId.length > 0,
  });
}

export function useCancelPrivateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, reason }: { orderId: string; reason: string }) =>
      unwrapAction(await cancelPrivateOrder(orderId, { reason })),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ordersKeys.all }),
  });
}

export function useUpdateOrderFulfilmentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: FulfilmentStatus }) =>
      unwrapAction(await updateOrderFulfilmentStatus(orderId, { status })),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ordersKeys.all }),
  });
}
