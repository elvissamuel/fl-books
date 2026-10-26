"use client";

import type {
  CustomerAuthResponse,
  CustomerForgotPasswordRequest,
  CustomerLoginRequest,
  CustomerOtpChallenge,
  CustomerRegisterRequest,
  CustomerResendOtpRequest,
  CustomerResetPasswordRequest,
  CustomerVerifyOtpRequest,
  PublicCustomer,
} from "@/core/customers/public-api";
import { browserApi } from "@/infrastructure/http/browser-api";

export async function registerPublicCustomer(request: CustomerRegisterRequest) {
  return browserApi<null>("/api/v1/customer/public/register", {
    method: "POST",
    json: request,
    allowEmptyData: true,
  });
}

export async function verifyCustomerOtp(request: CustomerVerifyOtpRequest) {
  return browserApi<PublicCustomer>("/api/v1/customer/public/verify-otp", {
    method: "POST",
    json: request,
  });
}

export async function resetCustomerPassword(request: CustomerResetPasswordRequest) {
  return browserApi<string | null>("/api/v1/customer/public/reset-password", {
    method: "POST",
    json: request,
    allowEmptyData: true,
  });
}

export async function resendCustomerOtp(request: CustomerResendOtpRequest) {
  return browserApi<CustomerOtpChallenge>("/api/v1/customer/public/resend-otp", {
    method: "POST",
    json: request,
  });
}

export async function loginPublicCustomer(request: CustomerLoginRequest) {
  return browserApi<CustomerAuthResponse>("/api/v1/customer/public/login", {
    method: "POST",
    json: request,
  });
}

export async function forgotCustomerPassword(request: CustomerForgotPasswordRequest) {
  return browserApi<CustomerOtpChallenge>("/api/v1/customer/public/forgot-password", {
    method: "POST",
    json: request,
  });
}
