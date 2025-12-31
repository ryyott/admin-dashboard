import type { Metadata } from "next";

import { CartIcon } from "./_components/cart-icon";
import { CheckoutBackButton } from "./_components/checkout-back-button";
import { EmailBanner } from "./_components/email-banner";

export const metadata: Metadata = {
  title: "Shop | YZY",
  description: "Minimalist e-commerce experience",
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-helvetica hide-scrollbar min-h-screen bg-white font-bold text-black">
      <CheckoutBackButton />
      <CartIcon />
      <main className="hide-scrollbar">{children}</main>
      <EmailBanner />
    </div>
  );
}
