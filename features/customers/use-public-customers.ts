"use client";

import { useMutation } from "@tanstack/react-query";
import type {
  CustomerForgotPasswordRequest,
  CustomerLoginRequest,
  CustomerRegisterRequest,
  CustomerResendOtpRequest,
  CustomerResetPasswordRequest,
  CustomerVerifyOtpRequest,
} from "@/core/customers/public-api";
import { unwrapAction } from "@/features/auth/unwrap-action";
import {
  forgotCustomerPassword,
  loginPublicCustomer,
  registerPublicCustomer,
  resendCustomerOtp,
  resetCustomerPassword,
  verifyCustomerOtp,
} from "@/infrastructure/customers/public-customers-actions";

export function useRegisterPublicCustomer() {
  return useMutation({
    mutationFn: async (request: CustomerRegisterRequest) =>
      unwrapAction(await registerPublicCustomer(request)),
  });
}

export function useVerifyCustomerOtp() {
  return useMutation({
    mutationFn: async (request: CustomerVerifyOtpRequest) =>
      unwrapAction(await verifyCustomerOtp(request)),
  });
}

export function useResetCustomerPassword() {
  return useMutation({
    mutationFn: async (request: CustomerResetPasswordRequest) =>
      unwrapAction(await resetCustomerPassword(request)),
  });
}

export function useResendCustomerOtp() {
  return useMutation({
    mutationFn: async (request: CustomerResendOtpRequest) =>
      unwrapAction(await resendCustomerOtp(request)),
  });
}

export function usePublicCustomerLogin() {
  return useMutation({
    mutationFn: async (request: CustomerLoginRequest) =>
      unwrapAction(await loginPublicCustomer(request)),
  });
}

export function useForgotCustomerPassword() {
  return useMutation({
    mutationFn: async (request: CustomerForgotPasswordRequest) =>
      unwrapAction(await forgotCustomerPassword(request)),
  });
}
