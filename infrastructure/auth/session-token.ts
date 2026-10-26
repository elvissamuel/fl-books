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
  return new SignJWT({
    userId: admin.id,
    role: "admin",
    accessToken: admin.accessToken,
    refreshToken: admin.refreshToken,
  })
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

    if (
      typeof payload.userId !== "string" ||
      payload.role !== "admin" ||
      typeof payload.accessToken !== "string" ||
      typeof payload.refreshToken !== "string"
    ) {
      return null;
    }

    return {
      userId: payload.userId,
      role: "admin",
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
    };
  } catch {
    return null;
  }
}

export function adminSessionExpiry() {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
}

export function adminSessionCookieBase() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };
}

export function accessTokenExpired(accessToken: string) {
  const payload = accessToken.split(".")[1];
  if (!payload) return false;

  try {
    const padded = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(payload.length / 4) * 4, "=");
    const decoded = JSON.parse(atob(padded)) as { exp?: unknown };
    return typeof decoded.exp === "number" && decoded.exp * 1000 <= Date.now();
  } catch {
    return false;
  }
}
