import type { ApiResponse } from "@/core/auth/admin-api";
import type { CustomerAddress, CustomerGender, PublicCustomer } from "@/core/customers/public-api";

export type CustomerProfile = PublicCustomer & {
  address: CustomerAddress | null;
};

export type CustomerProfileUpdateRequest = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: CustomerGender;
  profilePictureUrl: string;
  marketingEmailsEnabled: boolean;
  address: CustomerAddress;
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
