"use client";

import { useQuery } from "@tanstack/react-query";
import type { NewsletterListQuery } from "@/core/newsletter/private-api";
import { unwrapAction } from "@/features/auth/unwrap-action";
import { newsletterKeys } from "@/features/newsletter/query-keys";
import { listPrivateNewsletter } from "@/infrastructure/newsletter/newsletter-actions";

export function usePrivateNewsletter(query: NewsletterListQuery) {
  return useQuery({
    queryKey: newsletterKeys.list(query),
    queryFn: async () => unwrapAction(await listPrivateNewsletter(query)),
  });
}
