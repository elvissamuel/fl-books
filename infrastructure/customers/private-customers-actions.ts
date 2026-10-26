"use client";

import type {
  CustomerPasswordChangeRequest,
  CustomerProfile,
  CustomerProfileUpdateRequest,
} from "@/core/customers/private-api";
import { browserApi } from "@/infrastructure/http/browser-api";

function bearer(accessToken: string) {
  return { Authorization: `Bearer ${accessToken}` };
}

export async function getCustomerProfile(accessToken: string) {
  return browserApi<CustomerProfile>("/api/v1/customer/private/profile", {
    headers: bearer(accessToken),
  });
}

export async function updateCustomerProfile(
  accessToken: string,
  request: CustomerProfileUpdateRequest,
) {
  return browserApi<CustomerProfile>("/api/v1/customer/private/profile", {
    method: "PATCH",
    json: request,
    headers: bearer(accessToken),
  });
}

export async function changeCustomerPassword(
  accessToken: string,
  request: CustomerPasswordChangeRequest,
) {
  return browserApi<string | null>("/api/v1/customer/private/change-password", {
    method: "PATCH",
    json: request,
    headers: bearer(accessToken),
    allowEmptyData: true,
  });
}
