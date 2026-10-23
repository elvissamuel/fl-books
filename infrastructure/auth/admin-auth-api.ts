import "server-only";

import type { AdminAuthApi } from "@/core/auth/admin-api";
import { apiJson } from "@/infrastructure/http/api-client";

export const adminAuthEndpoints = {
  login: "/api/v1/admin/public/login",
  create: "/api/v1/admin/private/create",
  forgotPassword: "/api/v1/admin/auth/public/forgot-password",
  resetPassword: "/api/v1/admin/auth/public/reset-password",
  byId: (adminId: string) => `/api/v1/admin/private/${encodeURIComponent(adminId)}`,
  deactivate: (adminId: string) =>
    `/api/v1/admin/private/${encodeURIComponent(adminId)}/deactivate`,
  activate: (adminId: string) => `/api/v1/admin/private/${encodeURIComponent(adminId)}/activate`,
  list: "/api/v1/admin/private",
} as const;

function withAccessToken(accessToken: string, init?: RequestInit): RequestInit {
  return {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...init?.headers,
    },
  };
}

export const adminAuthApi: AdminAuthApi = {
  login(request) {
    return apiJson(adminAuthEndpoints.login, {
      method: "POST",
      body: JSON.stringify(request),
    });
  },

  create(request, accessToken) {
    return apiJson(
      adminAuthEndpoints.create,
      withAccessToken(accessToken, {
        method: "POST",
        body: JSON.stringify(request),
      }),
    );
  },

  forgotPassword(request) {
    return apiJson(adminAuthEndpoints.forgotPassword, {
      method: "POST",
      body: JSON.stringify(request),
    });
  },

  resetPassword(request) {
    return apiJson(adminAuthEndpoints.resetPassword, {
      method: "POST",
      body: JSON.stringify(request),
    });
  },

  get(adminId, accessToken) {
    return apiJson(adminAuthEndpoints.byId(adminId), withAccessToken(accessToken));
  },

  update(adminId, request, accessToken) {
    return apiJson(
      adminAuthEndpoints.byId(adminId),
      withAccessToken(accessToken, {
        method: "PUT",
        body: JSON.stringify(request),
      }),
    );
  },

  deactivate(adminId, accessToken) {
    return apiJson(
      adminAuthEndpoints.deactivate(adminId),
      withAccessToken(accessToken, { method: "PATCH" }),
    );
  },

  activate(adminId, accessToken) {
    return apiJson(
      adminAuthEndpoints.activate(adminId),
      withAccessToken(accessToken, { method: "PATCH" }),
    );
  },

  delete(adminId, accessToken) {
    return apiJson(
      adminAuthEndpoints.byId(adminId),
      withAccessToken(accessToken, { method: "DELETE" }),
    );
  },

  list(query, accessToken) {
    const search = new URLSearchParams({
      page: String(query.page),
      size: String(query.size),
    });
    if (query.search.trim()) search.set("search", query.search.trim());
    if (query.active !== undefined) search.set("active", String(query.active));

    return apiJson(`${adminAuthEndpoints.list}?${search.toString()}`, withAccessToken(accessToken));
  },
};
