"use server";

import { redirect } from "next/navigation";
import { cookieSessionStore } from "@/infrastructure/auth/cookie-session";

export async function logoutAdmin() {
  await cookieSessionStore.destroy();
  redirect("/admin/login");
}
