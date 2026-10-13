import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_SESSION_COOKIE,
  decryptAdminSession,
} from "@/infrastructure/auth/session-token";

export async function requireAdminSession() {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  const session = await decryptAdminSession(token);

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}
