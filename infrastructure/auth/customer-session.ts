import "server-only";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import {
  accessTokenExpired,
  adminSessionCookieBase,
  adminSessionExpiry,
} from "@/infrastructure/auth/session-token";

export const CUSTOMER_SESSION_COOKIE = "customer_session";

export type CustomerSession = {
  customerId: string;
  accessToken: string;
  refreshToken: string;
};

function signingKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET must be set.");
  return new TextEncoder().encode(secret);
}

async function encryptCustomerSession(session: CustomerSession) {
  return new SignJWT({
    customerId: session.customerId,
    role: "customer",
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(signingKey());
}

async function decryptCustomerSession(token: string | undefined): Promise<CustomerSession | null> {
  if (!token || !process.env.SESSION_SECRET) return null;

  try {
    const { payload } = await jwtVerify(token, signingKey(), { algorithms: ["HS256"] });
    if (
      payload.role !== "customer" ||
      typeof payload.customerId !== "string" ||
      typeof payload.accessToken !== "string" ||
      typeof payload.refreshToken !== "string"
    ) {
      return null;
    }
    return {
      customerId: payload.customerId,
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
    };
  } catch {
    return null;
  }
}

export async function saveCustomerSession(session: CustomerSession) {
  const token = await encryptCustomerSession(session);
  const cookieStore = await cookies();
  cookieStore.set(CUSTOMER_SESSION_COOKIE, token, {
    ...adminSessionCookieBase(),
    expires: adminSessionExpiry(),
  });
}

export async function destroyCustomerSession() {
  const cookieStore = await cookies();
  cookieStore.set(CUSTOMER_SESSION_COOKIE, "", {
    ...adminSessionCookieBase(),
    expires: new Date(0),
    maxAge: 0,
  });
}

export async function getCustomerSession() {
  const token = (await cookies()).get(CUSTOMER_SESSION_COOKIE)?.value;
  const session = await decryptCustomerSession(token);
  if (!session || accessTokenExpired(session.accessToken)) {
    return null;
  }
  return session;
}
