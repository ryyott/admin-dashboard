"use client";

import Link from "next/link";

import { motion } from "framer-motion";

import { useCartStore } from "@/stores/cart-store";

export function CartIcon() {
  const totalItems = useCartStore((state) => state.totalItems);

  return (
    <Link href="/misc/e-commerce/cart" className="fixed top-[13px] right-4 z-50 text-black">
      <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.15 }} className="relative">
        <svg className="h-6 w-6" aria-hidden="true" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect
            x="6"
            y="8"
            width="12"
            height="10"
            rx="2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          ></rect>
          <path
            d="M9 7V7C9 5.34315 10.3431 4 12 4V4C13.6569 4 15 5.34315 15 7V7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          ></path>
        </svg>
        {totalItems > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] text-white"
          >
            {totalItems}
          </motion.span>
        )}
      </motion.div>
    </Link>
  );
}
