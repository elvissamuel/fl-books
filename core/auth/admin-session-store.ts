import type { AuthenticatedAdmin } from "@/core/auth/types";

export interface AdminSessionStore {
  create(admin: AuthenticatedAdmin): Promise<void>;
  destroy(): Promise<void>;
}
