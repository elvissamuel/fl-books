import "server-only";

import { cookies } from "next/headers";
import type { AdminSessionStore } from "@/core/auth/admin-session-store";
import {
  ADMIN_SESSION_COOKIE,
  adminSessionCookieBase,
  adminSessionExpiry,
  encryptAdminSession,
} from "@/infrastructure/auth/session-token";

function sessionCookieOptions(expires: Date) {
  return {
    ...adminSessionCookieBase(),
    expires,
  };
}

export const cookieSessionStore: AdminSessionStore = {
  async create(admin) {
    const expires = adminSessionExpiry();
    const token = await encryptAdminSession(admin);
    const cookieStore = await cookies();

    cookieStore.set(ADMIN_SESSION_COOKIE, token, sessionCookieOptions(expires));
  },

  async destroy() {
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_SESSION_COOKIE, "", {
      ...adminSessionCookieBase(),
      expires: new Date(0),
      maxAge: 0,
    });
  },
};
