"use client";

import { useEffect, useRef, useState } from "react";
import { Check, X } from "lucide-react";
import { readStoredPayment } from "@/components/checkout/payment-return";
import type { PaymentProvider } from "@/core/payments/private-api";
import { verifyPrivatePayment } from "@/infrastructure/payments/payments-actions";

function firstParam(params: URLSearchParams, names: string[]) {
  for (const name of names) {
    const value = params.get(name)?.trim();
    if (value) return value;
  }
  return "";
}

function paymentProvider(params: URLSearchParams, storedProvider: string | undefined): PaymentProvider | "" {
  const fromQuery = firstParam(params, ["provider", "paymentClientServiceType"]).toUpperCase();
  if (fromQuery === "PAYSTACK" || fromQuery === "FLUTTERWAVE") return fromQuery;
  if (storedProvider === "PAYSTACK" || storedProvider === "FLUTTERWAVE") return storedProvider;
  if (firstParam(params, ["trxref"])) return "PAYSTACK";
  if (firstParam(params, ["transaction_id", "transactionId", "tx_ref"])) return "FLUTTERWAVE";
  return "";
}

function paymentCompleted(status: string) {
  const value = status.trim().toUpperCase();
  return value === "" || value === "SUCCESS" || value === "SUCCESSFUL" || value === "COMPLETED" || value === "PAID";
}

export function VerifyPaymentScreen() {
  const started = useRef(false);
  const [status, setStatus] = useState<"checking" | "success" | "error">("checking");
  const [message, setMessage] = useState("Confirming your payment...");
  const [reference, setReference] = useState("");

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const params = new URLSearchParams(window.location.search);
    const stored = readStoredPayment();
    const paymentReference = firstParam(params, ["reference", "trxref", "tx_ref"]) || stored?.reference || "";
    const provider = paymentProvider(params, stored?.provider);
    const transactionId = firstParam(params, ["transaction_id", "transactionId"]);
    const payload: Record<string, string> = {};
    params.forEach((value, key) => {
      payload[key] = value;
    });
    if (paymentReference) payload.reference = paymentReference;

    setReference(paymentReference);

    if (!paymentReference) {
      setStatus("error");
      setMessage("We could not find this payment reference.");
      return;
    }
    if (provider !== "PAYSTACK" && provider !== "FLUTTERWAVE") {
      setStatus("error");
      setMessage("We could not tell which payment method was used.");
      return;
    }

    verifyPrivatePayment({
      transactionId,
      reference: paymentReference,
      iswebhook: false,
      signature: firstParam(params, ["signature"]),
      payload,
      paymentClientServiceType: provider,
    }).then((result) => {
      if (!result.ok) {
        setStatus("error");
        setMessage(result.sessionExpired ? "Sign in again to confirm your payment." : result.message);
        return;
      }
      const nextReference = result.data.reference || paymentReference;
      setReference(nextReference);
      if (paymentCompleted(result.data.status)) {
        setStatus("success");
        setMessage(result.data.message || "Payment successful");
        return;
      }
      setStatus("error");
      setMessage(result.data.message || "Payment was not completed.");
    });
  }, []);

  return (
    <div className="mx-auto flex min-h-[420px] w-full max-w-[640px] items-center justify-center px-6 py-16">
      {status === "checking" ? <p className="text-[15px] text-[#6d7480]">{message}</p> : null}
      {status === "error" ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[420px] rounded-2xl bg-white px-8 py-10 text-center shadow-[0_16px_50px_rgba(0,0,0,0.16)]">
            <span className="mx-auto inline-flex size-16 items-center justify-center rounded-full bg-[#fff1f1] text-[#e35d6a]">
              <X className="size-7" strokeWidth={2.25} />
            </span>
            <h1 className="mt-5 text-[22px] font-semibold text-[#1c1f24]">Payment Failed</h1>
            <p className="mt-2 text-[14px] leading-6 text-[#6d7480]">{message}</p>
            {reference ? <p className="mt-3 text-[13px] text-[#8d939c]">Reference {reference}</p> : null}
            <a
              href="/checkout"
              className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#f47832] text-[14px] font-medium text-white hover:bg-[#e56d28]"
            >
              Back to Checkout
            </a>
          </div>
        </div>
      ) : null}
      {status === "success" ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[420px] rounded-2xl bg-white px-8 py-10 text-center shadow-[0_16px_50px_rgba(0,0,0,0.16)]">
            <span className="mx-auto inline-flex size-16 items-center justify-center rounded-full bg-[#fff1ea] text-[#f47832]">
              <Check className="size-7" strokeWidth={2.25} />
            </span>
            <h1 className="mt-5 text-[22px] font-semibold text-[#1c1f24]">Payment Successful</h1>
            <p className="mt-2 text-[14px] leading-6 text-[#6d7480]">{message}</p>
            {reference ? <p className="mt-3 text-[13px] text-[#8d939c]">Reference {reference}</p> : null}
            <a
              href="/"
              className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#f47832] text-[14px] font-medium text-white hover:bg-[#e56d28]"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
