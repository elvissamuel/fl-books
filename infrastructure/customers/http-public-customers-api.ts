import "server-only";

import type { PublicCustomersApi } from "@/core/customers/public-api";
import { apiJson } from "@/infrastructure/http/api-client";

export const publicCustomerEndpoints = {
  register: "/api/v1/customer/public/register",
  verifyOtp: "/api/v1/customer/public/verify-otp",
  resetPassword: "/api/v1/customer/public/reset-password",
  resendOtp: "/api/v1/customer/public/resend-otp",
  login: "/api/v1/customer/public/login",
  forgotPassword: "/api/v1/customer/public/forgot-password",
} as const;

function post(request: unknown) {
  return {
    method: "POST",
    body: JSON.stringify(request),
  } satisfies RequestInit;
}

export const publicCustomersApi: PublicCustomersApi = {
  register(request) {
    return apiJson(publicCustomerEndpoints.register, post(request));
  },

  verifyOtp(request) {
    return apiJson(publicCustomerEndpoints.verifyOtp, post(request));
  },

  resetPassword(request) {
    return apiJson(publicCustomerEndpoints.resetPassword, post(request));
  },

  resendOtp(request) {
    return apiJson(publicCustomerEndpoints.resendOtp, post(request));
  },

  login(request) {
    return apiJson(publicCustomerEndpoints.login, post(request));
  },

  forgotPassword(request) {
    return apiJson(publicCustomerEndpoints.forgotPassword, post(request));
  },
};
