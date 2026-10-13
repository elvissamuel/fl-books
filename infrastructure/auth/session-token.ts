import { jwtVerify, SignJWT } from "jose";
import type { AdminSession, AuthenticatedAdmin } from "@/core/auth/types";

export const ADMIN_SESSION_COOKIE = "session";

const SESSION_DURATION = "7d";

function getSigningKey() {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error("SESSION_SECRET must be set.");
  }

  return new TextEncoder().encode(secret);
}

export async function encryptAdminSession(admin: AuthenticatedAdmin) {
  return new SignJWT({ userId: admin.id, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(getSigningKey());
}

export async function decryptAdminSession(
  token: string | undefined,
): Promise<AdminSession | null> {
  if (!token || !process.env.SESSION_SECRET) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getSigningKey(), {
      algorithms: ["HS256"],
    });

    if (typeof payload.userId !== "string" || payload.role !== "admin") {
      return null;
    }

    return { userId: payload.userId, role: "admin" };
  } catch {
    return null;
  }
}

export function adminSessionExpiry() {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
}
