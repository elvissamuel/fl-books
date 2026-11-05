"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Cart } from "@/core/cart/cart";
import {
  addPrivateCartItem,
  getPrivateCart,
  removePrivateCartItem,
  updatePrivateCartItem,
} from "@/infrastructure/cart/private-cart-actions";

type ActionResult = { ok: true } | { ok: false; message: string };

type CartContextValue = {
  cart: Cart | null;
  ready: boolean;
  count: number;
  addItem: (bookId: string, quantity: number) => Promise<ActionResult>;
  removeItem: (cartItemId: string) => Promise<ActionResult>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<ActionResult>;
  reload: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

function failureMessage(message: string, sessionExpired?: boolean) {
  if (sessionExpired) return "Sign in to add books to your cart.";
  return message || "Could not update your cart.";
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getPrivateCart().then((result) => {
      if (cancelled) return;
      setCart(result.ok ? result.data : null);
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      ready,
      count: cart?.items.length ?? 0,
      async addItem(bookId, quantity) {
        const result = await addPrivateCartItem({ bookId, quantity });
        if (!result.ok) return { ok: false, message: failureMessage(result.message, result.sessionExpired) };
        setCart(result.data);
        return { ok: true };
      },
      async removeItem(cartItemId) {
        const result = await removePrivateCartItem(cartItemId);
        if (!result.ok) return { ok: false, message: failureMessage(result.message, result.sessionExpired) };
        setCart(result.data);
        return { ok: true };
      },
      async updateQuantity(cartItemId, quantity) {
        const result = await updatePrivateCartItem(cartItemId, { quantity });
        if (!result.ok) return { ok: false, message: failureMessage(result.message, result.sessionExpired) };
        setCart(result.data);
        return { ok: true };
      },
      async reload() {
        const result = await getPrivateCart();
        setCart(result.ok ? result.data : null);
        setReady(true);
      },
    }),
    [cart, ready],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) {
    throw new Error("useCart must be used within CartProvider");
  }
  return value;
}
