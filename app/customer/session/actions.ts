"use server";

import { saveCustomerSession as writeCustomerSession, destroyCustomerSession } from "@/infrastructure/auth/customer-session";

export async function saveCustomerSession(session: {
  customerId: string;
  accessToken: string;
  refreshToken: string;
}) {
  if (!session.customerId || !session.accessToken || !session.refreshToken) {
    return { ok: false as const, message: "Could not start your session." };
  }

  try {
    await writeCustomerSession(session);
    return { ok: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not start your session.";
    return { ok: false as const, message };
  }
}

export async function clearCustomerSession() {
  await destroyCustomerSession();
}
