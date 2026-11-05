import type { Metadata } from "next";
import { CartScreen } from "@/components/cart/cart-screen";
import { CartProvider } from "@/components/cart/cart-provider";
import { StoreHeader } from "@/components/catalog/store-header";
import { catalogCanvas } from "@/components/landing/catalog-shared";
import { ptSerif } from "@/lib/public-font";

export const metadata: Metadata = {
  title: "Cart",
};

export default function CartPage() {
  return (
    <CartProvider>
      <main className={`${ptSerif.className} min-h-dvh`} style={{ backgroundColor: catalogCanvas }}>
        <StoreHeader active={null} />
        <CartScreen />
      </main>
    </CartProvider>
  );
}
