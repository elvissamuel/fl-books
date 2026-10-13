"use server";

import { redirect } from "next/navigation";
import { signInAdmin } from "@/core/auth/sign-in-admin";
import type { LoginFormState } from "@/core/auth/types";
import { cookieSessionStore } from "@/infrastructure/auth/cookie-session";
import { envAdminAuthenticator } from "@/infrastructure/auth/env-admin-authenticator";

export async function loginAdmin(
  _state: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const result = await signInAdmin(
    {
      email: formData.get("email"),
      password: formData.get("password"),
    },
    {
      authenticator: envAdminAuthenticator,
      sessions: cookieSessionStore,
    },
  );

  if (result) {
    return result;
  }

  redirect("/admin");
}
