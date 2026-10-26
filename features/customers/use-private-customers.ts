"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  CustomerPasswordChangeRequest,
  CustomerProfileUpdateRequest,
} from "@/core/customers/private-api";
import { unwrapAction } from "@/features/auth/unwrap-action";
import { customersKeys } from "@/features/customers/query-keys";
import {
  changeCustomerPassword,
  getCustomerProfile,
  updateCustomerProfile,
} from "@/infrastructure/customers/private-customers-actions";

export function useCustomerProfile(accessToken: string) {
  return useQuery({
    queryKey: customersKeys.profile(accessToken),
    queryFn: async () => unwrapAction(await getCustomerProfile(accessToken)),
    enabled: accessToken.length > 0,
  });
}

export function useUpdateCustomerProfile() {
  return useMutation({
    mutationFn: async ({
      accessToken,
      request,
    }: {
      accessToken: string;
      request: CustomerProfileUpdateRequest;
    }) => unwrapAction(await updateCustomerProfile(accessToken, request)),
  });
}

export function useChangeCustomerPassword() {
  return useMutation({
    mutationFn: async ({
      accessToken,
      request,
    }: {
      accessToken: string;
      request: CustomerPasswordChangeRequest;
    }) => unwrapAction(await changeCustomerPassword(accessToken, request)),
  });
}
