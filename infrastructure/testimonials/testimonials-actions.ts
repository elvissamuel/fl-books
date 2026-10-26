"use client";

import type {
  PaginatedTestimonials,
  PrivateTestimonial,
  TestimonialListQuery,
  TestimonialWriteRequest,
} from "@/core/testimonials/private-api";
import { browserApi, withSearch } from "@/infrastructure/http/browser-api";

const list = "/api/v1/testimonials/private";
const byId = (testimonialId: string) =>
  `/api/v1/testimonials/private/${encodeURIComponent(testimonialId)}`;

export async function listPrivateTestimonials(query: TestimonialListQuery) {
  const search = new URLSearchParams({
    page: String(query.page),
    size: String(query.size),
  });
  const searchParam = query.searchParam?.trim();
  if (searchParam) search.set("searchParam", searchParam);
  return browserApi<PaginatedTestimonials>(withSearch(list, search));
}

export async function createPrivateTestimonial(request: TestimonialWriteRequest) {
  return browserApi<PrivateTestimonial>(list, { method: "POST", json: request });
}

export async function getPrivateTestimonial(testimonialId: string) {
  return browserApi<PrivateTestimonial>(byId(testimonialId));
}

export async function updatePrivateTestimonial(
  testimonialId: string,
  request: TestimonialWriteRequest,
) {
  return browserApi<PrivateTestimonial>(byId(testimonialId), { method: "PUT", json: request });
}

export async function deletePrivateTestimonial(testimonialId: string) {
  return browserApi<string>(byId(testimonialId), { method: "DELETE", allowEmptyData: true });
}
