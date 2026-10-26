import type { ApiResponse } from "@/core/auth/admin-api";

export type DistanceBand = {
  id: string;
  label: string;
  minKm: number;
  maxKm: number;
  fee: number;
  estimatedTransit: string;
  createdAt: string;
  updatedAt: string;
};

export type DistanceBandWriteRequest = {
  label: string;
  minKm: number;
  maxKm: number;
  fee: number;
  estimatedTransit: string;
};

export interface PrivateDistanceBandsApi {
  list(accessToken: string): Promise<ApiResponse<DistanceBand[]>>;
  get(bandId: string, accessToken: string): Promise<ApiResponse<DistanceBand>>;
  create(
    request: DistanceBandWriteRequest,
    accessToken: string,
  ): Promise<ApiResponse<DistanceBand>>;
  update(
    bandId: string,
    request: DistanceBandWriteRequest,
    accessToken: string,
  ): Promise<ApiResponse<DistanceBand>>;
  delete(bandId: string, accessToken: string): Promise<ApiResponse<string>>;
}
