"use client";

import { useQuery } from "@tanstack/react-query";
import type { CustomerListParams } from "@/core/customers/types";
import { customersKeys } from "@/features/customers/query-keys";
import {
  customersApi,
  getCustomerDetail,
  listCustomers,
} from "@/infrastructure/customers/customers-api";

export function useCustomers(params: CustomerListParams) {
  return useQuery({
    queryKey: customersKeys.list(params),
    queryFn: () => customersApi.list(params),
    placeholderData: listCustomers(params),
  });
}

export function useCustomerDetail(id: string) {
  return useQuery({
    queryKey: customersKeys.detail(id),
    queryFn: () => customersApi.get(id),
    placeholderData: getCustomerDetail(id),
  });
}
