import type { OrderListParams } from "@/core/orders/types";

export const ordersKeys = {
  all: ["orders"] as const,
  list: (params: OrderListParams) => [...ordersKeys.all, "list", params] as const,
  detail: (id: string) => [...ordersKeys.all, "detail", id] as const,
};
