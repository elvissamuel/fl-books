import "server-only";

import type { AdminAccount, AdminProfileUpdateRequest, ApiResponse } from "@/core/auth/admin-api";
import { apiJson } from "@/infrastructure/http/api-client";

const profile = "/api/v1/admin/private/profile";

function withAccessToken(accessToken: string, init?: RequestInit): RequestInit {
  return {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...init?.headers,
    },
  };
}

export const privateAdminProfileApi = {
  get(accessToken: string): Promise<ApiResponse<AdminAccount>> {
    return apiJson(profile, withAccessToken(accessToken));
  },

  update(request: AdminProfileUpdateRequest, accessToken: string): Promise<ApiResponse<AdminAccount>> {
    return apiJson(
      profile,
      withAccessToken(accessToken, {
        method: "PATCH",
        body: JSON.stringify(request),
      }),
    );
  },
};
