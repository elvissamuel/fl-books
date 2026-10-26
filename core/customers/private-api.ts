import type { ApiResponse } from "@/core/auth/admin-api";
import type { CustomerGender, PublicCustomer } from "@/core/customers/public-api";

export type CustomerProfile = PublicCustomer;

export type CustomerProfileUpdateRequest = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: CustomerGender;
  profilePictureUrl: string;
  marketingEmailsEnabled: boolean;
};

export type CustomerPasswordChangeRequest = {
  oldPassword: string;
  newPassword: string;
};

export interface PrivateCustomersApi {
  getProfile(accessToken: string): Promise<ApiResponse<CustomerProfile>>;
  updateProfile(
    request: CustomerProfileUpdateRequest,
    accessToken: string,
  ): Promise<ApiResponse<CustomerProfile>>;
  changePassword(
    request: CustomerPasswordChangeRequest,
    accessToken: string,
  ): Promise<ApiResponse<string | null>>;
}
