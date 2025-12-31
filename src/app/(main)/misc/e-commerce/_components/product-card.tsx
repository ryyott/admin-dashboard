"use client";

import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/types/shop";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div>
      <Link href={`/misc/e-commerce/product/${product.slug}`}>
        <div className="group cursor-pointer">
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={product.images[0]}
              alt={product.code}
              fill
              className="object-contain transition-transform duration-150 ease-out group-hover:scale-103"
              loading="lazy"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          </div>
          <div className="mt-3 text-center">
            <p className="text-xs font-medium tracking-wide text-black uppercase">{product.code}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
