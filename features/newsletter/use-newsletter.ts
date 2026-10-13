"use client";

import { useQuery } from "@tanstack/react-query";
import type { NewsletterListParams } from "@/core/newsletter/types";
import { newsletterKeys } from "@/features/newsletter/query-keys";
import { listNewsletterSubscribers, newsletterApi } from "@/infrastructure/newsletter/newsletter-api";

export function useNewsletterSubscribers(params: NewsletterListParams) {
  return useQuery({
    queryKey: newsletterKeys.list(params),
    queryFn: () => newsletterApi.list(params),
    placeholderData: listNewsletterSubscribers(params),
  });
}
