"use client";

import Link from "next/link";

import { useCartStore } from "@/stores/cart-store";

import { CartItem } from "../_components/cart-item";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const subtotal = useCartStore((state) => state.subtotal);

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-sm tracking-wide uppercase">YOUR CART IS EMPTY</p>
          <Link href="/misc/e-commerce" className="text-xs uppercase underline transition-colors hover:no-underline">
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-20">
      <h1 className="mb-12 text-2xl tracking-wide uppercase">SHOPPING CART</h1>

      <div className="space-y-6">
        {items.map((item) => (
          <CartItem
            key={`${item.productId}-${item.size}`}
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemove={removeItem}
          />
        ))}
      </div>

      <div className="mt-12 border-t border-black/10 pt-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm tracking-wide uppercase">SUBTOTAL</p>
          <p className="text-2xl">${subtotal.toFixed(2)}</p>
        </div>

        <Link
          href="/misc/e-commerce/checkout"
          className="block w-full bg-black py-4 text-center text-sm tracking-wider text-white uppercase transition-colors hover:bg-black/90"
        >
          CHECKOUT
        </Link>

        <Link
          href="/misc/e-commerce"
          className="mt-4 block text-center text-xs uppercase underline transition-colors hover:no-underline"
        >
          CONTINUE SHOPPING
        </Link>
      </div>
    </div>
  );
}
