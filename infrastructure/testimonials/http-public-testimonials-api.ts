import "server-only";

import type { TestimonialListQuery } from "@/core/testimonials/private-api";
import type { PublicTestimonialsApi } from "@/core/testimonials/public-api";
import { apiJson } from "@/infrastructure/http/api-client";

export const publicTestimonialEndpoints = {
  list: "/api/v1/testimonials/public",
} as const;

function listSearchParams(query: TestimonialListQuery) {
  const search = new URLSearchParams({
    page: String(query.page),
    size: String(query.size),
  });
  const searchParam = query.searchParam?.trim();
  if (searchParam) search.set("searchParam", searchParam);
  return search;
}

export const publicTestimonialsApi: PublicTestimonialsApi = {
  list(query) {
    return apiJson(`${publicTestimonialEndpoints.list}?${listSearchParams(query).toString()}`);
  },
};
