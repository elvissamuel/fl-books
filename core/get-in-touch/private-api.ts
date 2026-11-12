import type { ApiResponse } from "@/core/auth/admin-api";

export type GetInTouchMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  updatedAt: string;
};

export type GetInTouchWriteRequest = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type GetInTouchListQuery = {
  page: number;
  size: number;
  search?: string;
  email?: string;
};

export type PaginatedGetInTouch = {
  totalPage: number;
  numberOfElements: number;
  totalElements: number;
  data: GetInTouchMessage[];
};

export interface PrivateGetInTouchApi {
  list(query: GetInTouchListQuery, accessToken: string): Promise<ApiResponse<PaginatedGetInTouch>>;
  get(messageId: string, accessToken: string): Promise<ApiResponse<GetInTouchMessage>>;
  update(
    messageId: string,
    request: GetInTouchWriteRequest,
    accessToken: string,
  ): Promise<ApiResponse<GetInTouchMessage>>;
  delete(messageId: string, accessToken: string): Promise<ApiResponse<string>>;
}
