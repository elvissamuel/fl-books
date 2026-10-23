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
  } catch {
    return {
      fieldErrors: {},
      message: "Unable to sign in right now.",
    };
  }

  redirect("/admin");
}
