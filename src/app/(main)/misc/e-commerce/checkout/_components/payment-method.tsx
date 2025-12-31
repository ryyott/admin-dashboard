"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

export function CheckoutPaymentMethod() {
  const [method, setMethod] = useState<"card" | "usdc" | "sol">("card");

  return (
    <section className="space-y-4">
      <h2 className="text-xs tracking-wider uppercase">PAYMENT DETAILS</h2>

      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => setMethod("card")}
          className={cn(
            "border py-3 text-xs tracking-wider uppercase transition-colors",
            method === "card" ? "border-black bg-black text-white" : "border-black/20 hover:border-black",
          )}
        >
          CREDIT / DEBIT
        </button>
        <button
          onClick={() => setMethod("usdc")}
          className={cn(
            "border py-3 text-xs tracking-wider uppercase transition-colors",
            method === "usdc" ? "border-black bg-black text-white" : "border-black/20 hover:border-black",
          )}
        >
          USDC (CRYPTO)
        </button>
        <button
          onClick={() => setMethod("sol")}
          className={cn(
            "border py-3 text-xs tracking-wider uppercase transition-colors",
            method === "sol" ? "border-black bg-black text-white" : "border-black/20 hover:border-black",
          )}
        >
          SOL (CRYPTO)
        </button>
      </div>

      {method === "card" && (
        <div className="space-y-4 pt-4">
          <div className="relative">
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="w-full border border-black bg-white px-4 py-3 font-mono text-sm focus:border-black/60 focus:outline-none"
            />
            <div className="absolute top-1/2 right-4 flex -translate-y-1/2 gap-2">
              <span className="text-xs">💳</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="MM / YY"
              maxLength={7}
              className="border border-black bg-white px-4 py-3 font-mono text-sm uppercase placeholder:normal-case focus:border-black/60 focus:outline-none"
            />
            <input
              type="text"
              placeholder="CVV"
              maxLength={4}
              className="border border-black bg-white px-4 py-3 font-mono text-sm uppercase placeholder:normal-case focus:border-black/60 focus:outline-none"
            />
          </div>

          <input
            type="text"
            placeholder="Name on card"
            className="w-full border border-black bg-white px-4 py-3 text-sm uppercase placeholder:normal-case focus:border-black/60 focus:outline-none"
          />
        </div>
      )}

      {method === "usdc" && (
        <div className="space-y-4 pt-4">
          <p className="text-xs text-black/60">Connect your wallet to pay with USDC (USD Coin).</p>
          <button className="w-full border border-black py-3 text-sm tracking-wider uppercase transition-colors hover:bg-black hover:text-white">
            CONNECT WALLET
          </button>
        </div>
      )}

      {method === "sol" && (
        <div className="space-y-4 pt-4">
          <p className="text-xs text-black/60">Connect your wallet to pay with SOL (Solana).</p>
          <button className="w-full border border-black py-3 text-sm tracking-wider uppercase transition-colors hover:bg-black hover:text-white">
            CONNECT WALLET
          </button>
        </div>
      )}
    </section>
  );
}
