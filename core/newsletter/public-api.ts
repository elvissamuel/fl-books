import type { ApiResponse } from "@/core/auth/admin-api";
import type { NewsletterSubscription } from "@/core/newsletter/private-api";

export type SubscribeNewsletterRequest = {
  email: string;
};

export interface PublicNewsletterApi {
  subscribe(
    request: SubscribeNewsletterRequest,
  ): Promise<ApiResponse<NewsletterSubscription>>;
}
