import "server-only";

import { unstable_rethrow } from "next/navigation";
import type { AdminSession } from "@/core/auth/types";
import { cookieSessionStore } from "@/infrastructure/auth/cookie-session";
import { getAdminSession } from "@/infrastructure/auth/require-admin-session";
import { ApiError } from "@/infrastructure/http/api-client";

const expiredMessage = "Session expired or invalid; please log in again";

export type ExpiredSessionResult = {
  ok: false;
  message: string;
  sessionExpired: true;
};

export function sessionExpiredResult(message?: string): ExpiredSessionResult {
  return {
    ok: false,
    message: message || expiredMessage,
    sessionExpired: true,
  };
}

export async function readActionSession(): Promise<
  | { session: AdminSession; failure: null }
  | { session: null; failure: ExpiredSessionResult }
> {
  const session = await getAdminSession();
  if (!session) return { session: null, failure: sessionExpiredResult() };
  return { session, failure: null };
}

export async function adminActionFailure(error: unknown) {
  unstable_rethrow(error);

  if (error instanceof ApiError && error.status === 401) {
    await cookieSessionStore.destroy();
    return sessionExpiredResult(error.message);
  }

  if (error instanceof ApiError) return { ok: false as const, message: error.message };
  return { ok: false as const, message: "Request failed." };
}
