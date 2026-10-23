import type { ApiResponse } from "@/core/auth/admin-api";

export const pickupLocationStatuses = ["ACTIVE", "INACTIVE"] as const;

export type PickupLocationStatus = (typeof pickupLocationStatuses)[number];

export type PickupLocation = {
  id: string;
  locationName: string;
  fullAddress: string;
  city: string;
  state: string;
  country: string;
  contactName: string;
  phoneNumber: string;
  emailAddress: string;
  status: PickupLocationStatus;
  createdAt: string;
  updatedAt: string;
};

export type PaginatedPickupLocations = {
  totalPage: number;
  numberOfElements: number;
  totalElements: number;
  data: PickupLocation[];
};

export type PickupLocationListQuery = {
  page: number;
  size: number;
  searchParams?: string;
  status?: PickupLocationStatus;
};

export type PickupLocationFilter = {
  searchParam?: string;
  status?: PickupLocationStatus;
  country?: string;
  state?: string;
  city?: string;
};

export type PickupLocationFilterQuery = {
  page: number;
  size: number;
  filter: PickupLocationFilter;
};

export type CreatePickupLocationRequest = {
  locationName: string;
  fullAddress: string;
  city: string;
  state: string;
  country: string;
  contactName: string;
  phoneNumber: string;
  emailAddress: string;
  status: PickupLocationStatus;
};

export type UpdatePickupLocationRequest = CreatePickupLocationRequest;

export type PickupLocationStatistics = {
  totalLocations: number;
  activeLocations: number;
  inactiveLocations: number;
};

export interface PrivatePickupLocationsApi {
  list(
    query: PickupLocationListQuery,
    accessToken: string,
  ): Promise<ApiResponse<PaginatedPickupLocations>>;
  filter(
    query: PickupLocationFilterQuery,
    accessToken: string,
  ): Promise<ApiResponse<PaginatedPickupLocations>>;
  get(locationId: string, accessToken: string): Promise<ApiResponse<PickupLocation>>;
  create(
    request: CreatePickupLocationRequest,
    accessToken: string,
  ): Promise<ApiResponse<PickupLocation>>;
  update(
    locationId: string,
    request: UpdatePickupLocationRequest,
    accessToken: string,
  ): Promise<ApiResponse<PickupLocation>>;
  updateStatus(
    locationId: string,
    status: PickupLocationStatus,
    accessToken: string,
  ): Promise<ApiResponse<PickupLocation>>;
  delete(locationId: string, accessToken: string): Promise<ApiResponse<string>>;
  statistics(accessToken: string): Promise<ApiResponse<PickupLocationStatistics>>;
}
