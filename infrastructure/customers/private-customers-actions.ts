"use server";

import { unstable_rethrow } from "next/navigation";
import type { ApiResponse } from "@/core/auth/admin-api";
import type {
  CustomerPasswordChangeRequest,
  CustomerProfileUpdateRequest,
} from "@/core/customers/private-api";
import { privateCustomersApi } from "@/infrastructure/customers/http-private-customers-api";
import { ApiError } from "@/infrastructure/http/api-client";

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string };

async function run<T>(task: () => Promise<ApiResponse<T>>): Promise<ActionResult<T>> {
  try {
    const response = await task();
    if (!response.success) {
      return { ok: false, message: response.message || "Request failed." };
    }
    return { ok: true, data: response.data };
  } catch (error) {
    unstable_rethrow(error);
    if (error instanceof ApiError) return { ok: false, message: error.message };
    return { ok: false, message: "Request failed." };
  }
}

export async function getCustomerProfile(accessToken: string) {
  return run(() => privateCustomersApi.getProfile(accessToken));
}

export async function updateCustomerProfile(
  accessToken: string,
  request: CustomerProfileUpdateRequest,
) {
  return run(() => privateCustomersApi.updateProfile(request, accessToken));
}

export async function changeCustomerPassword(
  accessToken: string,
  request: CustomerPasswordChangeRequest,
) {
  return run(() => privateCustomersApi.changePassword(request, accessToken));
}
