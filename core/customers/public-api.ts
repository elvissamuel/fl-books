import type { ApiResponse } from "@/core/auth/admin-api";

export const customerGenders = ["MALE", "FEMALE"] as const;

export type CustomerGender = (typeof customerGenders)[number];

export const customerOtpTypes = ["LOGIN", "PASSWORD_RESET", "ACCOUNT_ACTIVATION"] as const;

export type CustomerOtpType = (typeof customerOtpTypes)[number];

export type PublicCustomer = {
  customerId: string;
  customerNumber: string;
  userId: string;
  firstName: string | null;
  lastName: string | null;
  emailAddress: string;
  phoneNumber: string | null;
  profilePictureUrl: string | null;
  dateOfBirth: string | null;
  age: string | null;
  gender: CustomerGender | null;
  active: boolean;
  verified: boolean;
  marketingEmailsEnabled: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CustomerRegisterRequest = {
  emailAddress: string;
  password: string;
};

export type CustomerVerifyOtpRequest = {
  emailAddress: string;
  otp: string;
};

export type CustomerResetPasswordRequest = {
  emailAddress: string;
  otp: string;
  newPassword: string;
};

export type CustomerResendOtpRequest = {
  emailAddress: string;
  userOtpType: CustomerOtpType;
};

export type CustomerLoginRequest = {
  emailAddress: string;
  password: string;
};

export type CustomerForgotPasswordRequest = {
  emailAddress: string;
};

export type CustomerOtpChallenge = {
  userId: string;
  emailAddress: string;
  otpExpiresAt: string;
};

export type CustomerAuthResponse = {
  accessToken: string;
  refreshToken: string;
  customer: PublicCustomer;
};

export interface PublicCustomersApi {
  register(request: CustomerRegisterRequest): Promise<ApiResponse<null>>;
  verifyOtp(request: CustomerVerifyOtpRequest): Promise<ApiResponse<PublicCustomer>>;
  resetPassword(request: CustomerResetPasswordRequest): Promise<ApiResponse<string | null>>;
  resendOtp(request: CustomerResendOtpRequest): Promise<ApiResponse<CustomerOtpChallenge>>;
  login(request: CustomerLoginRequest): Promise<ApiResponse<CustomerAuthResponse>>;
  forgotPassword(
    request: CustomerForgotPasswordRequest,
  ): Promise<ApiResponse<CustomerOtpChallenge>>;
}
