import type { PaymentProvider } from "@/core/payments/private-api";

export const paymentVerifyKey = "flb-payment-verify";

export type StoredPaymentVerify = {
  reference: string;
  provider: PaymentProvider;
};

export function readStoredPayment(): StoredPaymentVerify | null {
  const raw = sessionStorage.getItem(paymentVerifyKey);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<StoredPaymentVerify>;
    if (
      (parsed.provider === "PAYSTACK" || parsed.provider === "FLUTTERWAVE") &&
      typeof parsed.reference === "string" &&
      parsed.reference
    ) {
      return { reference: parsed.reference, provider: parsed.provider };
    }
  } catch {
    return null;
  }
  return null;
}
