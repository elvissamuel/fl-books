import type { ApiResponse } from "@/core/auth/admin-api";

export type PrivateTestimonial = {
  id: string;
  name: string;
  role: string;
  message: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type TestimonialWriteRequest = {
  name: string;
  role: string;
  message: string;
  imageUrl: string;
};

export type TestimonialListQuery = {
  page: number;
  size: number;
  searchParam?: string;
};

export type PaginatedTestimonials = {
  totalPage: number;
  numberOfElements: number;
  totalElements: number;
  data: PrivateTestimonial[];
};

export interface PrivateTestimonialsApi {
  list(
    query: TestimonialListQuery,
    accessToken: string,
  ): Promise<ApiResponse<PaginatedTestimonials>>;
  create(
    request: TestimonialWriteRequest,
    accessToken: string,
  ): Promise<ApiResponse<PrivateTestimonial>>;
  get(testimonialId: string, accessToken: string): Promise<ApiResponse<PrivateTestimonial>>;
  update(
    testimonialId: string,
    request: TestimonialWriteRequest,
    accessToken: string,
  ): Promise<ApiResponse<PrivateTestimonial>>;
  delete(testimonialId: string, accessToken: string): Promise<ApiResponse<string>>;
}
