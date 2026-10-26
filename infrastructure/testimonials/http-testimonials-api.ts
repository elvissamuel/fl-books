import "server-only";

import type { PrivateTestimonialsApi, TestimonialListQuery } from "@/core/testimonials/private-api";
import { apiJson } from "@/infrastructure/http/api-client";

export const privateTestimonialEndpoints = {
  list: "/api/v1/testimonials/private",
  byId: (testimonialId: string) =>
    `/api/v1/testimonials/private/${encodeURIComponent(testimonialId)}`,
} as const;

function withAccessToken(accessToken: string, init?: RequestInit): RequestInit {
  return {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...init?.headers,
    },
  };
}

function listSearchParams(query: TestimonialListQuery) {
  const search = new URLSearchParams({
    page: String(query.page),
    size: String(query.size),
  });
  const searchParam = query.searchParam?.trim();
  if (searchParam) search.set("searchParam", searchParam);
  return search;
}

export const privateTestimonialsApi: PrivateTestimonialsApi = {
  list(query, accessToken) {
    return apiJson(
      `${privateTestimonialEndpoints.list}?${listSearchParams(query).toString()}`,
      withAccessToken(accessToken),
    );
  },

  create(request, accessToken) {
    return apiJson(
      privateTestimonialEndpoints.list,
      withAccessToken(accessToken, {
        method: "POST",
        body: JSON.stringify(request),
      }),
    );
  },

  get(testimonialId, accessToken) {
    return apiJson(privateTestimonialEndpoints.byId(testimonialId), withAccessToken(accessToken));
  },

  update(testimonialId, request, accessToken) {
    return apiJson(
      privateTestimonialEndpoints.byId(testimonialId),
      withAccessToken(accessToken, {
        method: "PUT",
        body: JSON.stringify(request),
      }),
    );
  },

  delete(testimonialId, accessToken) {
    return apiJson(
      privateTestimonialEndpoints.byId(testimonialId),
      withAccessToken(accessToken, { method: "DELETE" }),
    );
  },
};
