"use client";

import { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import type { Product } from "@/types/shop";

import { ProductInfoDrawer } from "./product-info-drawer";

interface SizeSelectorProps {
  product: Product;
  selectedSize: string | null;
  onSelectSize: (size: string) => void;
  onClose: () => void;
}

export function SizeSelector({ product, selectedSize, onSelectSize, onClose }: SizeSelectorProps) {
  const [showInfo, setShowInfo] = useState(false);
  const [showActualSizes, setShowActualSizes] = useState(false);
  const [hoveredSize, setHoveredSize] = useState<number | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  const handleSizeClick = (size: string) => {
    // Add to cart immediately when size is clicked
    addItem({
      productId: product.id,
      code: product.code,
      slug: product.slug,
      price: product.price,
      size: size,
      qty: 1,
      image: product.images[0],
    });

    toast.success("Added to cart", {
      description: `${product.code} - SIZE ${size}`,
      duration: 2000,
    });

    onClose();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, originY: 0 }}
        animate={{ opacity: 1, scale: 1, originY: 0 }}
        exit={{ opacity: 0, scale: 0.95, originY: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relative mb-2 text-xs tracking-widest uppercase">
          <p className="text-sm font-medium tracking-widest">SELECT SIZE</p>
          <div
            className="absolute top-0 right-0 left-0 flex justify-between"
            style={{ paddingLeft: "calc(16.666% - 10px)", paddingRight: "calc(16.666% - 10px)" }}
          >
            <button
              onMouseEnter={() => setShowActualSizes(true)}
              onMouseLeave={() => setShowActualSizes(false)}
              className="transition-opacity hover:opacity-60"
            >
              <svg
                width="10"
                height="13"
                viewBox="0 0 11 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="block"
              >
                <path d="M5.5 8L5.5 9" stroke="black" strokeWidth="2" strokeLinecap="round" />
                <path
                  d="M1.5 4.5C1.5 2 4 1 5.5 1C7 1 9.5 2 9.5 4.5C9.5 7 5.5 8 5.5 8"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M5.5 13.5C5.3619 13.5 5.25 13.3881 5.25 13.25C5.25 13.1119 5.3619 13 5.5 13"
                  stroke="black"
                  strokeWidth="2"
                />
                <path
                  d="M5.5 13.5C5.6381 13.5 5.75 13.3881 5.75 13.25C5.75 13.1119 5.6381 13 5.5 13"
                  stroke="black"
                  strokeWidth="2"
                />
              </svg>
            </button>
            <button onClick={onClose} className="transition-opacity hover:opacity-60">
              <svg
                width="13"
                height="13"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="block"
              >
                <path d="M1.5 1.5L13.5 13.5" stroke="black" strokeWidth="2" strokeLinecap="round" />
                <path d="M13.5 1.5L1.5 13.5" stroke="black" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <p className="mb-6 text-center text-xl">${product.price}</p>

        <div className="mb-6 grid grid-cols-3 gap-4">
          {product.sizes.slice(0, 3).map((size, idx) => (
            <div key={size.value} className="relative">
              <button
                onClick={() => handleSizeClick(size.value)}
                disabled={!size.available}
                className={cn(
                  "relative flex h-10 w-full items-center justify-center overflow-hidden text-sm tracking-widest uppercase transition-opacity",
                  size.available ? "hover:opacity-60" : "cursor-not-allowed opacity-30",
                )}
              >
                <span
                  className="relative inline-block min-w-8 overflow-hidden"
                  onMouseEnter={() => setHoveredSize(idx)}
                  onMouseLeave={() => setHoveredSize(null)}
                >
                  <motion.span
                    initial={false}
                    animate={{
                      y: showActualSizes || hoveredSize === idx ? -24 : 0,
                      opacity: showActualSizes || hoveredSize === idx ? 0 : 1,
                    }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="block h-6 text-center"
                  >
                    {idx + 1}
                  </motion.span>
                  <motion.span
                    initial={false}
                    animate={{
                      y: showActualSizes || hoveredSize === idx ? -24 : 0,
                      opacity: showActualSizes || hoveredSize === idx ? 1 : 0,
                    }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-6 right-0 left-0 block h-6 text-center"
                  >
                    {size.value}
                  </motion.span>
                </span>
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowInfo(true)}
          className="w-full text-center text-xs tracking-widest uppercase transition-opacity hover:opacity-60"
        >
          INFORMATION
        </button>
      </motion.div>

      <AnimatePresence>
        {showInfo && <ProductInfoDrawer product={product} onClose={() => setShowInfo(false)} />}
      </AnimatePresence>
    </>
  );
}
