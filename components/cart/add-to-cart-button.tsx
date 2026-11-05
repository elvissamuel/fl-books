"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { CartAuthMessage } from "@/components/cart/cart-auth-message";
import { useCart } from "@/components/cart/cart-provider";

export function AddToCartButton({
  bookId,
  quantity = 1,
  className,
  label = "Add To Cart",
  disabled = false,
}: {
  bookId: string;
  quantity?: number;
  className?: string;
  label?: string;
  disabled?: boolean;
}) {
  const { addItem } = useCart();
  const [pending, setPending] = useState(false);
  const [added, setAdded] = useState(false);
  const [message, setMessage] = useState("");

  async function onClick() {
    setPending(true);
    setAdded(false);
    setMessage("");
    const result = await addItem(bookId, quantity);
    setPending(false);
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    setAdded(true);
  }

  return (
    <div className="w-full">
      <button
        type="button"
        disabled={disabled || pending}
        onClick={onClick}
        className={className}
      >
        <ShoppingCart className="size-4" strokeWidth={1.75} />
        {pending ? "Adding..." : added ? "Added" : label}
      </button>
      {message ? (
        <CartAuthMessage message={message} className="mt-1.5 text-center text-[12px] leading-4 text-danger" />
      ) : null}
    </div>
  );
}
