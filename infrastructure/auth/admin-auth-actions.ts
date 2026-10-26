"use client";

import type {
  AdminAccount,
  AdminCreateRequest,
  AdminForgotPasswordRequest,
  AdminForgotPasswordResponse,
  AdminListQuery,
  AdminResetPasswordRequest,
  AdminUpdateRequest,
  PaginatedAdmins,
} from "@/core/auth/admin-api";
import { browserApi, setQuery, withSearch } from "@/infrastructure/http/browser-api";

const list = "/api/v1/admin/private";
const byId = (adminId: string) => `/api/v1/admin/private/${encodeURIComponent(adminId)}`;

export async function forgotAdminPassword(request: AdminForgotPasswordRequest) {
  return browserApi<AdminForgotPasswordResponse>("/api/v1/admin/auth/public/forgot-password", {
    method: "POST",
    json: request,
  });
}

export async function resetAdminPassword(request: AdminResetPasswordRequest) {
  return browserApi<string | null>("/api/v1/admin/auth/public/reset-password", {
    method: "POST",
    json: request,
    allowEmptyData: true,
  });
}

export async function createAdminAccount(request: AdminCreateRequest) {
  return browserApi<AdminAccount>("/api/v1/admin/private/create", {
    method: "POST",
    json: request,
  });
}

export async function listAdminAccounts(query: AdminListQuery) {
  const search = new URLSearchParams({
    page: String(query.page),
    size: String(query.size),
  });
  setQuery(search, "search", query.search.trim());
  setQuery(search, "active", query.active);
  return browserApi<PaginatedAdmins>(withSearch(list, search));
}

export async function getAdminAccount(adminId: string) {
  return browserApi<AdminAccount>(byId(adminId));
}

export async function updateAdminAccount(adminId: string, request: AdminUpdateRequest) {
  return browserApi<AdminAccount>(byId(adminId), { method: "PUT", json: request });
}

export async function deactivateAdminAccount(adminId: string) {
  return browserApi<AdminAccount>(`${byId(adminId)}/deactivate`, { method: "PATCH" });
}

export async function activateAdminAccount(adminId: string) {
  return browserApi<AdminAccount>(`${byId(adminId)}/activate`, { method: "PATCH" });
}

export async function deleteAdminAccount(adminId: string) {
  return browserApi<string>(byId(adminId), { method: "DELETE", allowEmptyData: true });
}
