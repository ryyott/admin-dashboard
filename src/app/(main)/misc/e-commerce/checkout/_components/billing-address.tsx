"use client";

import { useState } from "react";

export function CheckoutBillingAddress() {
  const [sameAsShipping, setSameAsShipping] = useState(true);

  return (
    <section className="space-y-4">
      <h2 className="text-xs tracking-wider uppercase">BILLING ADDRESS</h2>

      <div className="border border-yellow-200 bg-yellow-50 p-4">
        <p className="text-xs">⚠️ Must match the address on file with your payment method.</p>
      </div>

      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={sameAsShipping}
          onChange={(e) => setSameAsShipping(e.target.checked)}
          className="mt-1 h-4 w-4 border border-black"
        />
        <span className="text-xs">Use shipping address as billing address</span>
      </label>

      {!sameAsShipping && (
        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First name"
              className="border border-black bg-white px-4 py-3 text-sm uppercase placeholder:normal-case focus:border-black/60 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Last name"
              className="border border-black bg-white px-4 py-3 text-sm uppercase placeholder:normal-case focus:border-black/60 focus:outline-none"
            />
          </div>

          <input
            type="text"
            placeholder="Address"
            className="w-full border border-black bg-white px-4 py-3 text-sm uppercase placeholder:normal-case focus:border-black/60 focus:outline-none"
          />

          <input
            type="text"
            placeholder="City"
            className="w-full border border-black bg-white px-4 py-3 text-sm uppercase placeholder:normal-case focus:border-black/60 focus:outline-none"
          />

          <div className="grid grid-cols-3 gap-4">
            <select className="col-span-1 border border-black bg-white px-4 py-3 text-sm uppercase focus:border-black/60 focus:outline-none">
              <option>United States</option>
              <option>Canada</option>
              <option>United Kingdom</option>
            </select>
            <input
              type="text"
              placeholder="State"
              className="border border-black bg-white px-4 py-3 text-sm uppercase placeholder:normal-case focus:border-black/60 focus:outline-none"
            />
            <input
              type="text"
              placeholder="ZIP"
              className="border border-black bg-white px-4 py-3 text-sm uppercase placeholder:normal-case focus:border-black/60 focus:outline-none"
            />
          </div>
        </div>
      )}
    </section>
  );
}
