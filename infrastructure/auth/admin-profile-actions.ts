"use client";

import type { AdminAccount, AdminProfileUpdateRequest } from "@/core/auth/admin-api";
import { browserApi } from "@/infrastructure/http/browser-api";

const profile = "/api/v1/admin/private/profile";

export async function getPrivateAdminProfile() {
  return browserApi<AdminAccount>(profile);
}

export async function updatePrivateAdminProfile(request: AdminProfileUpdateRequest) {
  return browserApi<AdminAccount>(profile, { method: "PATCH", json: request });
}
