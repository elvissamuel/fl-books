import "server-only";

import { cookies } from "next/headers";
import type { AdminSessionStore } from "@/core/auth/admin-session-store";
import {
  ADMIN_SESSION_COOKIE,
  adminSessionExpiry,
  encryptAdminSession,
} from "@/infrastructure/auth/session-token";

function sessionCookieOptions(expires: Date) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    expires,
    path: "/",
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
    cookieStore.delete(ADMIN_SESSION_COOKIE);
  },
};
