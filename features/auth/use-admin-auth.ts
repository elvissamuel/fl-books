"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  AdminCreateRequest,
  AdminForgotPasswordRequest,
  AdminListQuery,
  AdminResetPasswordRequest,
  AdminUpdateRequest,
} from "@/core/auth/admin-api";
import {
  activateAdminAccount,
  createAdminAccount,
  deactivateAdminAccount,
  deleteAdminAccount,
  forgotAdminPassword,
  getAdminAccount,
  listAdminAccounts,
  resetAdminPassword,
  updateAdminAccount,
} from "@/infrastructure/auth/admin-auth-actions";
import { unwrapAction } from "@/features/auth/unwrap-action";

export function useForgotAdminPassword() {
  return useMutation({
    mutationFn: (request: AdminForgotPasswordRequest) => forgotAdminPassword(request),
  });
}

export function useResetAdminPassword() {
  return useMutation({
    mutationFn: (request: AdminResetPasswordRequest) => resetAdminPassword(request),
  });
}

export function useAdminAccounts(query: AdminListQuery) {
  return useQuery({
    queryKey: ["admins", query],
    queryFn: async () => unwrapAction(await listAdminAccounts(query)),
  });
}

export function useCreateAdminAccount() {
  return useMutation({
    mutationFn: async (request: AdminCreateRequest) => unwrapAction(await createAdminAccount(request)),
  });
}

export function useAdminAccount(adminId: string) {
  return useQuery({
    queryKey: ["admin-account", adminId],
    queryFn: async () => unwrapAction(await getAdminAccount(adminId)),
    enabled: adminId.length > 0,
  });
}

export function useUpdateAdminAccount() {
  return useMutation({
    mutationFn: async ({ adminId, request }: { adminId: string; request: AdminUpdateRequest }) =>
      unwrapAction(await updateAdminAccount(adminId, request)),
  });
}

export function useDeactivateAdminAccount() {
  return useMutation({
    mutationFn: async (adminId: string) => unwrapAction(await deactivateAdminAccount(adminId)),
  });
}

export function useActivateAdminAccount() {
  return useMutation({
    mutationFn: async (adminId: string) => unwrapAction(await activateAdminAccount(adminId)),
  });
}

export function useDeleteAdminAccount() {
  return useMutation({
    mutationFn: async (adminId: string) => unwrapAction(await deleteAdminAccount(adminId)),
  });
}
