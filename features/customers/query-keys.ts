import type { CustomerListParams } from "@/core/customers/types";

export const customersKeys = {
  all: ["customers"] as const,
  list: (params: CustomerListParams) => [...customersKeys.all, "list", params] as const,
  detail: (id: string) => [...customersKeys.all, "detail", id] as const,
};
