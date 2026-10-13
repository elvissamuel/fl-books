"use client";

import { useQuery } from "@tanstack/react-query";
import type { OrderListParams } from "@/core/orders/types";
import { ordersKeys } from "@/features/orders/query-keys";
import { getOrderDetail, listOrders, ordersApi } from "@/infrastructure/orders/orders-api";

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
