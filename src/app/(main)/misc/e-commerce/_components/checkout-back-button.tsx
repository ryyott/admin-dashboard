"use client";

import { useRouter, usePathname } from "next/navigation";

import { ChevronLeft } from "lucide-react";

export function CheckoutBackButton() {
  const router = useRouter();
  const pathname = usePathname();

  // Only show on checkout and cart pages
  if (!pathname?.includes("/checkout") && !pathname?.includes("/cart")) {
    return null;
  }

  return (
    <button
      onClick={() => router.back()}
      className="fixed top-[13px] left-4 z-50 text-black transition-opacity hover:opacity-60"
      aria-label="Go back"
    >
      <ChevronLeft className="h-6 w-6" strokeWidth={1.5} />
    </button>
  );
}
