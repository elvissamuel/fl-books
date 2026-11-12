import type { NewsletterListQuery } from "@/core/newsletter/private-api";

export const newsletterKeys = {
  all: ["newsletter"] as const,
  list: (query: NewsletterListQuery) => [...newsletterKeys.all, "list", query] as const,
};
