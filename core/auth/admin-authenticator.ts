import type { AdminCredentials, AuthenticatedAdmin } from "@/core/auth/types";

export interface AdminAuthenticator {
  authenticate(credentials: AdminCredentials): Promise<AuthenticatedAdmin | null>;
}
