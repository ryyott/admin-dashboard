"use client";

import Image from "next/image";

import { useCartStore } from "@/stores/cart-store";
import type { CartItem } from "@/types/shop";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
}

export function CheckoutOrderSummary({ items, subtotal }: OrderSummaryProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const shipping: number = 0; // TBD
  const tax = subtotal * 0.1; // Example: 10% tax
  const total = subtotal + shipping + tax;

  return (
    <div className="space-y-6 border border-black/10 p-8">
      <h2 className="text-xs tracking-wider uppercase">ORDER SUMMARY</h2>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={`${item.productId}-${item.size}`} className="flex gap-4">
            <div className="relative h-16 w-16 flex-shrink-0 bg-gray-50">
              <Image src={item.image} alt={item.code} fill className="object-cover" sizes="64px" />
            </div>
            <div className="flex-grow">
              <p className="text-xs uppercase">{item.code}</p>
              <p className="text-xs text-black/60">SIZE {item.size}</p>
              <div className="mt-1 flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.productId, item.size, Math.max(1, item.qty - 1))}
                  className="flex h-5 w-5 items-center justify-center border border-black/20 text-xs"
                >
                  −
                </button>
                <span className="text-xs">{item.qty}</span>
                <button
                  onClick={() => updateQuantity(item.productId, item.size, item.qty + 1)}
                  className="flex h-5 w-5 items-center justify-center border border-black/20 text-xs"
                >
                  +
                </button>
              </div>
            </div>
            <p className="text-sm">${(item.price * item.qty).toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2 border-t border-black/10 pt-4">
        <div className="flex justify-between text-xs">
          <span className="uppercase">SUBTOTAL</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="uppercase">SHIPPING</span>
          <span>{shipping === 0 ? "Calculated at next step" : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="uppercase">TAX</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between border-t border-black/10 pt-2 text-sm font-medium">
          <span className="uppercase">TOTAL</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
