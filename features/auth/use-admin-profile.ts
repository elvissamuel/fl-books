"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AdminProfileUpdateRequest } from "@/core/auth/admin-api";
import { unwrapAction } from "@/features/auth/unwrap-action";
import {
  getPrivateAdminProfile,
  updatePrivateAdminProfile,
} from "@/infrastructure/auth/admin-profile-actions";

export const adminProfileKeys = {
  all: ["admin-profile"] as const,
};

export function usePrivateAdminProfile() {
  return useQuery({
    queryKey: adminProfileKeys.all,
    queryFn: async () => unwrapAction(await getPrivateAdminProfile()),
  });
}

export function useUpdatePrivateAdminProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (request: AdminProfileUpdateRequest) =>
      unwrapAction(await updatePrivateAdminProfile(request)),
    onSuccess: (profile) => queryClient.setQueryData(adminProfileKeys.all, profile),
  });
}
