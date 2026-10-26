"use server";

import { unstable_rethrow } from "next/navigation";
import type { ApiResponse } from "@/core/auth/admin-api";
import type {
  CustomerForgotPasswordRequest,
  CustomerLoginRequest,
  CustomerRegisterRequest,
  CustomerResendOtpRequest,
  CustomerResetPasswordRequest,
  CustomerVerifyOtpRequest,
} from "@/core/customers/public-api";
import { ApiError } from "@/infrastructure/http/api-client";
import { publicCustomersApi } from "@/infrastructure/customers/http-public-customers-api";

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

export async function registerPublicCustomer(request: CustomerRegisterRequest) {
  return run(() => publicCustomersApi.register(request));
}

export async function verifyCustomerOtp(request: CustomerVerifyOtpRequest) {
  return run(() => publicCustomersApi.verifyOtp(request));
}

export async function resetCustomerPassword(request: CustomerResetPasswordRequest) {
  return run(() => publicCustomersApi.resetPassword(request));
}

export async function resendCustomerOtp(request: CustomerResendOtpRequest) {
  return run(() => publicCustomersApi.resendOtp(request));
}

export async function loginPublicCustomer(request: CustomerLoginRequest) {
  return run(() => publicCustomersApi.login(request));
}

export async function forgotCustomerPassword(request: CustomerForgotPasswordRequest) {
  return run(() => publicCustomersApi.forgotPassword(request));
}
