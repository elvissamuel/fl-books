import type { AdminAuthenticator } from "@/core/auth/admin-authenticator";
import type { AdminSessionStore } from "@/core/auth/admin-session-store";
import type { LoginFormState } from "@/core/auth/types";
import { validateCredentials } from "@/core/auth/validate-credentials";

type SignInDependencies = {
  authenticator: AdminAuthenticator;
  sessions: AdminSessionStore;
};

export async function signInAdmin(
  input: { email: unknown; password: unknown },
  dependencies: SignInDependencies,
): Promise<LoginFormState | null> {
  const validated = validateCredentials(input);

  if (!validated.ok) {
    return { fieldErrors: validated.fieldErrors };
  }

  const result = await dependencies.authenticator.authenticate(validated.credentials);

  if (!result.ok) {
    return {
      fieldErrors: {},
      message: result.message,
    };
  }

  await dependencies.sessions.create(result.admin);
  return null;
}
