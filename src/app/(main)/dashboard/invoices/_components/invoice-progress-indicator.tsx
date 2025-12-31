"use client";

import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";

interface InvoiceProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  clientName?: string;
  currency?: string;
  itemCount?: number;
}

const PROGRESS_MESSAGES = [
  "Let's get started! 🚀",
  (name?: string) => `Nice! ${name || "Client"} is all set 🎯`,
  "Looking good so far! 📝",
  "Payment terms locked in! 📅",
  (currency?: string) => `${currency || "USD"} selected—perfect choice! 💵`,
  (count?: number) => `${count || 0} ${count === 1 ? "item" : "items"} added—great work! 🛍️`,
  "Pricing adjustments applied! 💸",
  "Almost there—final touches! ✨",
  "All done! Ready to send! 🎉",
];

export function InvoiceProgressIndicator({
  currentStep,
  totalSteps,
  clientName,
  currency,
  itemCount,
}: InvoiceProgressIndicatorProps) {
  const progress = (currentStep / totalSteps) * 100;

  const getMessage = () => {
    const msg = PROGRESS_MESSAGES[currentStep];
    if (typeof msg === "function") {
      switch (currentStep) {
        case 1:
          return (msg as (name?: string) => string)(clientName);
        case 4:
          return (msg as (currency?: string) => string)(currency);
        case 5:
          return (msg as (count?: number) => string)(itemCount);
        default:
          return (msg as () => string)();
      }
    }
    return msg;
  };

  return (
    <div className="bg-background/95 supports-[backdrop-filter]:bg-background/90 border-border/40 fixed right-0 bottom-0 left-0 z-50 border-t backdrop-blur">
      <div className="mx-auto max-w-[1850px] px-6 py-5">
        <div className="flex items-center gap-6">
          {/* Progress Fraction */}
          <div className="shrink-0">
            <motion.div
              key={currentStep}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex items-baseline gap-1"
            >
              <span className="text-primary text-3xl font-bold">{currentStep}</span>
              <span className="text-muted-foreground text-lg font-medium">/{totalSteps}</span>
            </motion.div>
          </div>

          {/* Progress Bar Container */}
          <div className="min-w-0 flex-1">
            {/* Personalized Message */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`progress-message-${currentStep}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mb-2"
              >
                <p className="text-foreground text-sm font-semibold">{getMessage()}</p>
              </motion.div>
            </AnimatePresence>

            {/* Progress Bar Track */}
            <div className="bg-muted/50 relative h-2 overflow-hidden rounded-full">
              {/* Animated Fill */}
              <motion.div
                className="from-primary to-primary/80 absolute inset-y-0 left-0 rounded-full bg-gradient-to-r"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{
                  duration: 0.8,
                  ease: [0.25, 0.1, 0.25, 1.0],
                }}
              />

              {/* Shimmer Effect */}
              <motion.div
                className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                  repeatDelay: 1,
                }}
                style={{ width: `${progress}%` }}
              />

              {/* Glow Effect */}
              <motion.div
                className="bg-primary/30 absolute inset-0 blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: progress > 0 ? 0.4 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Progress Percentage (small text) */}
            <motion.div
              key={progress}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              className="mt-1.5 text-right"
            >
              <span className="text-muted-foreground text-xs font-medium">{Math.round(progress)}% Complete</span>
            </motion.div>
          </div>

          {/* Confetti on completion */}
          {currentStep === totalSteps && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="text-4xl"
            >
              🎊
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
