import type { ApiResponse } from "@/core/auth/admin-api";
import type { TestimonialListQuery } from "@/core/testimonials/private-api";

export type PublicTestimonial = {
  id: string;
  name: string;
  role: string;
  message: string;
  imageUrl: string | null;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PaginatedPublicTestimonials = {
  totalPage: number;
  numberOfElements: number;
  totalElements: number;
  data: PublicTestimonial[];
};

export interface PublicTestimonialsApi {
  list(query: TestimonialListQuery): Promise<ApiResponse<PaginatedPublicTestimonials>>;
}
