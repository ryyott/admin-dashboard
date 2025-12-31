"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { useCartStore } from "@/stores/cart-store";

import { CheckoutBillingAddress } from "./_components/billing-address";
import { CheckoutContactForm } from "./_components/contact-form";
import { CheckoutExpressMethods } from "./_components/express-methods";
import { CheckoutOrderSummary } from "./_components/order-summary";
import { CheckoutPaymentMethod } from "./_components/payment-method";
import { CheckoutShippingForm } from "./_components/shipping-form";
import { CheckoutSubmit } from "./_components/submit-section";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal);

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/misc/e-commerce/cart");
    }
  }, [items, router]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="mb-12 text-2xl tracking-wide uppercase">CHECKOUT</h1>

      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2">
        {/* Left Column - Forms */}
        <div className="space-y-12">
          <CheckoutExpressMethods />
          <CheckoutContactForm />
          <CheckoutShippingForm />
          <CheckoutPaymentMethod />
          <CheckoutBillingAddress />
          <CheckoutSubmit />
        </div>

        {/* Right Column - Order Summary */}
        <div className="h-fit lg:sticky lg:top-20">
          <CheckoutOrderSummary items={items} subtotal={subtotal} />
        </div>
      </div>
    </div>
  );
}
