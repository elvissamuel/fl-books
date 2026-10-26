import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cookieSessionStore } from "@/infrastructure/auth/cookie-session";
import {
  ADMIN_SESSION_COOKIE,
  accessTokenExpired,
  decryptAdminSession,
} from "@/infrastructure/auth/session-token";

export async function getAdminSession() {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  const session = await decryptAdminSession(token);

  if (!session || accessTokenExpired(session.accessToken)) {
    if (token) await cookieSessionStore.destroy();
    return null;
  }

  return session;
}

export async function requireAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}
