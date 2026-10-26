"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import type { AdminCustomerFilterQuery, AdminCustomerListQuery } from "@/core/customers/admin-api";
import { unwrapAction } from "@/features/auth/unwrap-action";
import { customersKeys } from "@/features/customers/query-keys";
import {
  activateAdminCustomer,
  deactivateAdminCustomer,
  deleteAdminCustomer,
  filterAdminCustomers,
  getAdminCustomer,
  listAdminCustomers,
} from "@/infrastructure/customers/admin-customers-actions";

export function useAdminCustomers(query: AdminCustomerListQuery) {
  return useQuery({
    queryKey: customersKeys.adminList(query),
    queryFn: async () => unwrapAction(await listAdminCustomers(query)),
  });
}

export function useFilteredAdminCustomers(query: AdminCustomerFilterQuery) {
  return useQuery({
    queryKey: customersKeys.adminFilter(query),
    queryFn: async () => unwrapAction(await filterAdminCustomers(query)),
  });
}

export function useAdminCustomer(customerId: string) {
  return useQuery({
    queryKey: customersKeys.adminDetail(customerId),
    queryFn: async () => unwrapAction(await getAdminCustomer(customerId)),
    enabled: customerId.length > 0,
  });
}

export function useDeleteAdminCustomer() {
  return useMutation({
    mutationFn: async (customerId: string) => unwrapAction(await deleteAdminCustomer(customerId)),
  });
}

export function useDeactivateAdminCustomer() {
  return useMutation({
    mutationFn: async (customerId: string) =>
      unwrapAction(await deactivateAdminCustomer(customerId)),
  });
}

export function useActivateAdminCustomer() {
  return useMutation({
    mutationFn: async (customerId: string) => unwrapAction(await activateAdminCustomer(customerId)),
  });
}
