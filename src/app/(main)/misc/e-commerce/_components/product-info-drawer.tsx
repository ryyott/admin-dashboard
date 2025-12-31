"use client";

import { motion } from "framer-motion";

import type { Product } from "@/types/shop";

interface ProductInfoDrawerProps {
  product: Product;
  onClose: () => void;
}

export function ProductInfoDrawer({ product, onClose }: ProductInfoDrawerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-white"
      onClick={onClose}
    >
      <div className="container mx-auto max-w-2xl px-8 py-16" onClick={(e) => e.stopPropagation()}>
        <div className="mb-8 flex items-start justify-between">
          <h2 className="text-2xl tracking-wide uppercase">{product.code}</h2>
          <button onClick={onClose} className="text-2xl transition-opacity hover:opacity-60">
            ×
          </button>
        </div>

        <div className="space-y-6 text-sm tracking-wide uppercase">
          <section>
            <h3 className="mb-2">PRODUCT DETAILS</h3>
            <p className="normal-case opacity-60">{product.description || "Premium quality construction."}</p>
          </section>

          <section>
            <h3 className="mb-2">MATERIALS</h3>
            <p className="normal-case opacity-60">
              100% Premium Materials. Sustainably sourced and ethically produced.
            </p>
          </section>

          <section>
            <h3 className="mb-2">SIZE & FIT</h3>
            <p className="normal-case opacity-60">
              True to size. For detailed measurements, please refer to the size chart.
            </p>
          </section>

          <section>
            <h3 className="mb-2">CARE INSTRUCTIONS</h3>
            <p className="normal-case opacity-60">
              Follow care label instructions. Keep away from extreme heat or cold.
            </p>
          </section>

          <section>
            <h3 className="mb-2">SHIPPING & RETURNS</h3>
            <p className="normal-case opacity-60">
              Free shipping on all orders. 30-day return policy for unworn items.
            </p>
          </section>
        </div>
      </div>
    </motion.div>
  );
}
