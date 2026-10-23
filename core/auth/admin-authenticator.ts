import type { AdminCredentials, AuthenticatedAdmin } from "@/core/auth/types";

export type AuthenticationResult =
  | { ok: true; admin: AuthenticatedAdmin }
  | { ok: false; message: string };

export interface AdminAuthenticator {
  authenticate(credentials: AdminCredentials): Promise<AuthenticationResult>;
}
