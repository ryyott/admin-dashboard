"use client";

import Image from "next/image";
import Link from "next/link";

import type { CartItem as CartItemType } from "@/types/shop";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, size: string, qty: number) => void;
  onRemove: (productId: string, size: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="flex gap-6 border-b border-black/10 pb-6">
      {/* Product Image */}
      <Link href={`/misc/e-commerce/product/${item.slug}`} className="flex-shrink-0">
        <div className="relative h-24 w-24 bg-gray-50">
          <Image src={item.image} alt={item.code} fill className="object-cover" sizes="96px" />
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex-grow">
        <Link href={`/misc/e-commerce/product/${item.slug}`}>
          <p className="text-sm tracking-wide uppercase transition-opacity hover:opacity-60">{item.code}</p>
        </Link>
        <p className="mt-1 text-xs text-black/60 uppercase">SIZE {item.size}</p>

        {/* Quantity Controls */}
        <div className="mt-3 flex items-center gap-3">
          <p className="text-xs uppercase">QTY</p>
          <button
            onClick={() => onUpdateQuantity(item.productId, item.size, Math.max(1, item.qty - 1))}
            className="flex h-6 w-6 items-center justify-center border border-black/20 transition-colors hover:border-black"
          >
            −
          </button>
          <span className="min-w-[2ch] text-center text-sm">{item.qty}</span>
          <button
            onClick={() => onUpdateQuantity(item.productId, item.size, item.qty + 1)}
            className="flex h-6 w-6 items-center justify-center border border-black/20 transition-colors hover:border-black"
          >
            +
          </button>
        </div>
      </div>

      {/* Price & Remove */}
      <div className="flex flex-col items-end justify-between">
        <p className="text-lg">${(item.price * item.qty).toFixed(2)}</p>
        <button
          onClick={() => onRemove(item.productId, item.size)}
          className="text-xs uppercase transition-opacity hover:opacity-60"
        >
          REMOVE
        </button>
      </div>
    </div>
  );
}
