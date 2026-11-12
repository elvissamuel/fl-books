import type { ApiResponse } from "@/core/auth/admin-api";

export type NewsletterSubscription = {
  id: string;
  email: string;
  createdAt: string;
};

export type NewsletterListQuery = {
  page: number;
  size: number;
  search?: string;
};

export type PaginatedNewsletter = {
  totalPage: number;
  numberOfElements: number;
  totalElements: number;
  data: NewsletterSubscription[];
};

export interface PrivateNewsletterApi {
  list(query: NewsletterListQuery, accessToken: string): Promise<ApiResponse<PaginatedNewsletter>>;
}
