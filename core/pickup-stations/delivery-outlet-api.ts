import type { ApiResponse } from "@/core/auth/admin-api";

export const deliveryOutletStatuses = ["ACTIVE", "INACTIVE"] as const;

export type DeliveryOutletStatus = (typeof deliveryOutletStatuses)[number];

export type DeliveryOutletWeightPrice = {
  minKg: number;
  maxKg: number;
  price: number;
};

export type PrivateDeliveryOutlet = {
  id: string;
  outletName: string;
  fullAddress: string;
  city: string;
  state: string;
  country: string;
  contactName: string;
  phoneNumber: string;
  emailAddress: string;
  status: DeliveryOutletStatus;
  currencyCode: string;
  weightPrices: DeliveryOutletWeightPrice[];
  createdAt: string;
  updatedAt: string;
};

export type PaginatedDeliveryOutlets = {
  totalPage: number;
  numberOfElements: number;
  totalElements: number;
  data: PrivateDeliveryOutlet[];
};

export type DeliveryOutletListQuery = {
  page: number;
  size: number;
  searchParams?: string;
  status?: DeliveryOutletStatus;
};

export type DeliveryOutletFilter = {
  searchParam?: string;
  status?: DeliveryOutletStatus;
  country?: string;
  state?: string;
  city?: string;
};

export type DeliveryOutletFilterQuery = {
  page: number;
  size: number;
  filter: DeliveryOutletFilter;
};

export type DeliveryOutletWriteRequest = {
  outletName: string;
  fullAddress: string;
  city: string;
  state: string;
  country: string;
  contactName: string;
  phoneNumber: string;
  emailAddress: string;
  status: DeliveryOutletStatus;
  weightPrices: DeliveryOutletWeightPrice[];
};

export type DeliveryOutletStatistics = {
  totalOutlets: number;
  activeOutlets: number;
  inactiveOutlets: number;
};

export interface PrivateDeliveryOutletsApi {
  list(
    query: DeliveryOutletListQuery,
    accessToken: string,
  ): Promise<ApiResponse<PaginatedDeliveryOutlets>>;
  create(
    request: DeliveryOutletWriteRequest,
    accessToken: string,
  ): Promise<ApiResponse<PrivateDeliveryOutlet>>;
  filter(
    query: DeliveryOutletFilterQuery,
    accessToken: string,
  ): Promise<ApiResponse<PaginatedDeliveryOutlets>>;
  get(outletId: string, accessToken: string): Promise<ApiResponse<PrivateDeliveryOutlet>>;
  update(
    outletId: string,
    request: DeliveryOutletWriteRequest,
    accessToken: string,
  ): Promise<ApiResponse<PrivateDeliveryOutlet>>;
  updateStatus(
    outletId: string,
    status: DeliveryOutletStatus,
    accessToken: string,
  ): Promise<ApiResponse<PrivateDeliveryOutlet>>;
  delete(outletId: string, accessToken: string): Promise<ApiResponse<string>>;
  statistics(accessToken: string): Promise<ApiResponse<DeliveryOutletStatistics>>;
}
