"use client";

import { useState, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export function EmailBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Check if user has dismissed the banner before
    const isDismissed = localStorage.getItem("emailBannerDismissed");
    if (!isDismissed) {
      // Show banner after a short delay
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("emailBannerDismissed", "true");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add email subscription logic here
    console.log("Email submitted:", email);
    setEmail("");
    // Optionally dismiss after successful subscription
    handleDismiss();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{
            duration: 0.4,
            ease: [0.19, 1, 0.22, 1],
          }}
          className="fixed right-0 bottom-0 left-0 z-50"
        >
          <div className="relative overflow-hidden">
            {/* Backdrop blur container */}
            <div className="absolute inset-0 bg-white/60 backdrop-blur-xl" />

            {/* Content */}
            <div className="relative px-4 py-6">
              <div className="mx-auto max-w-2xl">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <h3 className="mb-3 text-xs font-semibold tracking-widest text-black uppercase">
                      RECEIVE WEBSITE UPDATES
                    </h3>
                    <form onSubmit={handleSubmit} className="flex gap-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="EMAIL ADDRESS"
                        required
                        className="flex-1 border border-black/10 bg-white/80 px-4 py-3 text-xs tracking-wide text-black uppercase placeholder:text-black/30 focus:border-black focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="bg-black px-8 py-3 text-xs font-semibold tracking-widest text-white uppercase transition-opacity hover:opacity-80"
                      >
                        SUBSCRIBE
                      </button>
                    </form>
                  </div>

                  {/* Close button */}
                  <button
                    onClick={handleDismiss}
                    className="flex h-10 w-10 items-center justify-center text-black/40 transition-colors hover:text-black"
                    aria-label="Close banner"
                  >
                    <X size={20} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
