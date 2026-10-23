"use server";

import { unstable_rethrow } from "next/navigation";
import type {
  AdminCreateRequest,
  AdminForgotPasswordRequest,
  AdminListQuery,
  AdminResetPasswordRequest,
  AdminUpdateRequest,
  ApiResponse,
} from "@/core/auth/admin-api";
import { adminAuthApi } from "@/infrastructure/auth/admin-auth-api";
import { requireAdminSession } from "@/infrastructure/auth/require-admin-session";
import { ApiError } from "@/infrastructure/http/api-client";

export type ActionResult<T> = { ok: true; data: T } | { ok: false; message: string };

async function run<T>(
  task: (accessToken: string) => Promise<ApiResponse<T>>,
): Promise<ActionResult<T>> {
  try {
    const session = await requireAdminSession();
    return unwrap(await task(session.accessToken));
  } catch (error) {
    unstable_rethrow(error);
    if (error instanceof ApiError) return { ok: false, message: error.message };
    return { ok: false, message: "Request failed." };
  }
}

function unwrap<T>(response: ApiResponse<T>): ActionResult<T> {
  if (!response.success) {
    return { ok: false, message: response.message || "Request failed." };
  }
  return { ok: true, data: response.data };
}

export async function forgotAdminPassword(request: AdminForgotPasswordRequest) {
  return adminAuthApi.forgotPassword(request);
}

export async function resetAdminPassword(request: AdminResetPasswordRequest) {
  return adminAuthApi.resetPassword(request);
}

export async function createAdminAccount(request: AdminCreateRequest) {
  return run((accessToken) => adminAuthApi.create(request, accessToken));
}

export async function listAdminAccounts(query: AdminListQuery) {
  return run((accessToken) => adminAuthApi.list(query, accessToken));
}

export async function getAdminAccount(adminId: string) {
  return run((accessToken) => adminAuthApi.get(adminId, accessToken));
}

export async function updateAdminAccount(adminId: string, request: AdminUpdateRequest) {
  return run((accessToken) => adminAuthApi.update(adminId, request, accessToken));
}

export async function deactivateAdminAccount(adminId: string) {
  return run((accessToken) => adminAuthApi.deactivate(adminId, accessToken));
}

export async function activateAdminAccount(adminId: string) {
  return run((accessToken) => adminAuthApi.activate(adminId, accessToken));
}

export async function deleteAdminAccount(adminId: string) {
  return run((accessToken) => adminAuthApi.delete(adminId, accessToken));
}
