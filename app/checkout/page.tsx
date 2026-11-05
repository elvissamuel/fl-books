import type { Metadata } from "next";
import { CartProvider } from "@/components/cart/cart-provider";
import { CheckoutScreen } from "@/components/checkout/checkout-screen";
import { StoreHeader } from "@/components/catalog/store-header";
import { LandingFooter } from "@/components/landing/landing-footer";
import { ptSerif } from "@/lib/public-font";

export const metadata: Metadata = {
  title: "Checkout",
};

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  return (
    <CartProvider>
      <main className={`${ptSerif.className} min-h-dvh bg-white`}>
        <StoreHeader active={null} />
        <CheckoutScreen />
        <LandingFooter />
      </main>
    </CartProvider>
  );
}
