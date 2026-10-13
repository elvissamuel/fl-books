"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import type { AdminListParams, CreateStaffAdminPayload } from "@/core/administration/types";
import { administrationKeys } from "@/features/administration/query-keys";
import {
  administrationApi,
  listStaffAdmins,
} from "@/infrastructure/administration/administration-api";

export function useStaffAdmins(params: AdminListParams) {
  return useQuery({
    queryKey: administrationKeys.list(params),
    queryFn: () => administrationApi.list(params),
    placeholderData: listStaffAdmins(params),
  });
}

export function useCreateStaffAdmin() {
  return useMutation({
    mutationFn: (payload: CreateStaffAdminPayload) => administrationApi.create(payload),
  });
}
