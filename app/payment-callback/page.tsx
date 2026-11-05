import type { Metadata } from "next";
import { CartProvider } from "@/components/cart/cart-provider";
import { VerifyPaymentScreen } from "@/components/checkout/verify-payment-screen";
import { StoreHeader } from "@/components/catalog/store-header";
import { ptSerif } from "@/lib/public-font";

export const metadata: Metadata = {
  title: "Payment",
};

export const dynamic = "force-dynamic";

export default function PaymentCallbackPage() {
  return (
    <CartProvider>
      <main className={`${ptSerif.className} min-h-dvh bg-white`}>
        <StoreHeader active={null} />
        <VerifyPaymentScreen />
      </main>
    </CartProvider>
  );
}
