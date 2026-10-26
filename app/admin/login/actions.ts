"use server";

import { redirect } from "next/navigation";
import { signInAdmin } from "@/core/auth/sign-in-admin";
import type { LoginFormState } from "@/core/auth/types";
import { cookieSessionStore } from "@/infrastructure/auth/cookie-session";
import { httpAdminAuthenticator } from "@/infrastructure/auth/http-admin-authenticator";

export async function loginAdmin(
  _state: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  try {
    const result = await signInAdmin(
      {
        email: formData.get("email"),
        password: formData.get("password"),
      },
      {
        authenticator: httpAdminAuthenticator,
        sessions: cookieSessionStore,
      },
    );

    if (result) {
      return result;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to sign in right now.";
    console.error("[api] POST /api/v1/admin/public/login", message);
    return {
      fieldErrors: {},
      message,
    };
  }

  redirect("/admin");
}
