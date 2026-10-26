import "server-only";

import type { PrivateCustomersApi } from "@/core/customers/private-api";
import { apiJson } from "@/infrastructure/http/api-client";

export const privateCustomerEndpoints = {
  profile: "/api/v1/customer/private/profile",
  changePassword: "/api/v1/customer/private/change-password",
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

export const privateCustomersApi: PrivateCustomersApi = {
  getProfile(accessToken) {
    return apiJson(privateCustomerEndpoints.profile, withAccessToken(accessToken));
  },

  updateProfile(request, accessToken) {
    return apiJson(
      privateCustomerEndpoints.profile,
      withAccessToken(accessToken, {
        method: "PATCH",
        body: JSON.stringify(request),
      }),
    );
  },

  changePassword(request, accessToken) {
    return apiJson(
      privateCustomerEndpoints.changePassword,
      withAccessToken(accessToken, {
        method: "PATCH",
        body: JSON.stringify(request),
      }),
    );
  },
};
