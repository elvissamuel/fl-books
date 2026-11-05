"use client";

import { useQuery } from "@tanstack/react-query";
import type { OrderFilterRequest } from "@/core/orders/private-api";
import type { OrderListParams } from "@/core/orders/types";
import { unwrapAction } from "@/features/auth/unwrap-action";
import { ordersKeys } from "@/features/orders/query-keys";
import { getOrderDetail, listOrders, ordersApi } from "@/infrastructure/orders/orders-api";
import { filterPrivateOrders, getPrivateOrder } from "@/infrastructure/orders/private-orders-actions";

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
