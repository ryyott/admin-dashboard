"use client";

import Image from "next/image";
import Link from "next/link";

import { motion } from "framer-motion";

import type { Product } from "@/types/shop";

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        delay: index * 0.05,
        ease: "easeOut",
      }}
      viewport={{ once: true }}
    >
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
    </motion.div>
  );
}
