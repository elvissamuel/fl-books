import type { AdminCredentials, LoginFieldErrors } from "@/core/auth/types";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type CredentialValidation =
  | { ok: true; credentials: AdminCredentials }
  | { ok: false; fieldErrors: LoginFieldErrors };

export function validateCredentials(input: {
  email: unknown;
  password: unknown;
}): CredentialValidation {
  const email = typeof input.email === "string" ? input.email.trim() : "";
  const password = typeof input.password === "string" ? input.password : "";
  const fieldErrors: LoginFieldErrors = {};

  if (!email) {
    fieldErrors.email = "Enter your email address.";
  } else if (!emailPattern.test(email)) {
    fieldErrors.email = "Enter a valid email address.";
  }

  if (!password) {
    fieldErrors.password = "Enter your password.";
  }

  if (fieldErrors.email || fieldErrors.password) {
    return { ok: false, fieldErrors };
  }

  return { ok: true, credentials: { email, password } };
}
