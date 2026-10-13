import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";
import type { AdminAuthenticator } from "@/core/auth/admin-authenticator";

function digest(value: string) {
  return createHash("sha256").update(value).digest();
}

function matches(actual: string, expected: string) {
  return timingSafeEqual(digest(actual), digest(expected));
}

export const envAdminAuthenticator: AdminAuthenticator = {
  async authenticate(credentials) {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set.");
    }

    const emailMatches = matches(
      credentials.email.toLowerCase(),
      email.trim().toLowerCase(),
    );
    const passwordMatches = matches(credentials.password, password);

    if (!emailMatches || !passwordMatches) {
      return null;
    }

    return { id: "admin" };
  },
};
