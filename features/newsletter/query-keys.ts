import type { NewsletterListParams } from "@/core/newsletter/types";

export const newsletterKeys = {
  all: ["newsletter"] as const,
  list: (params: NewsletterListParams) => [...newsletterKeys.all, "list", params] as const,
};
