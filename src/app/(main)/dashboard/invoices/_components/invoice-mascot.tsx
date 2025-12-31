"use client";

import { useState, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";

interface InvoiceMascotProps {
  currentStep: number;
  totalSteps: number;
  clientName?: string;
}

// Deterministic animation positions for each coin (avoids hydration mismatch)
const COIN_ANIMATIONS = [
  {
    initial: { x: -30, y: 10, opacity: 0 },
    animate: { x: -50, y: 20, opacity: [0, 1, 0], rotate: 360 },
  },
  {
    initial: { x: 20, y: -15, opacity: 0 },
    animate: { x: 40, y: -30, opacity: [0, 1, 0], rotate: 360 },
  },
  {
    initial: { x: 0, y: 25, opacity: 0 },
    animate: { x: 10, y: 35, opacity: [0, 1, 0], rotate: 360 },
  },
];

// Sparkle positions in a circle (deterministic, avoids hydration issues)
const SPARKLE_POSITIONS = Array.from({ length: 5 }, (_, i) => ({
  x: Math.cos((i * 2 * Math.PI) / 5) * 60,
  y: Math.sin((i * 2 * Math.PI) / 5) * 60,
}));

const MASCOT_MESSAGES = [
  "Let's create your invoice! 💰",
  (name?: string) => `Great choice, ${name || "there"}! 🎯`,
  "Perfect! What's this invoice for? 📝",
  "When should they pay? 📅",
  "Which currency works best? 💵",
  "Time to add what you're selling! 🛍️",
  "Any discounts or taxes? 💸",
  "Almost done! Any notes? ✨",
  "Woohoo! Ready to send! 🚀",
];

export function InvoiceMascot({ currentStep, totalSteps, clientName }: InvoiceMascotProps) {
  const [isWinking, setIsWinking] = useState(false);
  const [bounceKey, setBounceKey] = useState(0);

  useEffect(() => {
    // Trigger bounce animation on step change
    setBounceKey((prev) => prev + 1);

    // Random wink animation
    const timer = setTimeout(
      () => {
        setIsWinking(true);
        setTimeout(() => setIsWinking(false), 300);
      },
      Math.random() * 3000 + 2000,
    );

    return () => clearTimeout(timer);
  }, [currentStep]);

  const getMessage = () => {
    const msg = MASCOT_MESSAGES[currentStep];
    return typeof msg === "function" ? msg(clientName) : msg;
  };

  return (
    <div className="relative mb-8">
      {/* Cloud Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-2xl">
        <div className="absolute top-4 left-8 h-12 w-20 rounded-full bg-white/5 blur-xl" />
        <div className="absolute top-8 right-12 h-10 w-16 rounded-full bg-white/5 blur-xl" />
        <div className="absolute bottom-6 left-16 h-14 w-24 rounded-full bg-white/5 blur-xl" />
      </div>

      {/* Mascot Character */}
      <div className="flex flex-col items-center py-8">
        <motion.div
          key={bounceKey}
          initial={{ y: -20, scale: 0.8, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className="relative"
        >
          {/* Floating Coins */}
          {COIN_ANIMATIONS.map((coinAnim, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              initial={coinAnim.initial}
              animate={coinAnim.animate}
              transition={{
                duration: 2 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            >
              💰
            </motion.div>
          ))}

          {/* Money Bag Character */}
          <div className="relative text-8xl">
            <motion.div
              animate={{
                rotate: [0, -5, 5, -5, 0],
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="relative">
                💰
                {/* Sunglasses */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 text-4xl">{isWinking ? "😉" : "😎"}</div>
              </div>
            </motion.div>
          </div>

          {/* Sparkles */}
          {currentStep === totalSteps && (
            <>
              {SPARKLE_POSITIONS.map((pos, i) => (
                <motion.div
                  key={`sparkle-${i}`}
                  className="absolute text-xl"
                  initial={{
                    x: 0,
                    y: 0,
                    scale: 0,
                    opacity: 0,
                  }}
                  animate={{
                    x: pos.x,
                    y: pos.y,
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                >
                  ✨
                </motion.div>
              ))}
            </>
          )}
        </motion.div>

        {/* Speech Bubble */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`message-${currentStep}`}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative mt-6"
          >
            {/* Speech bubble tail */}
            <div className="border-b-primary/20 absolute -top-2 left-1/2 h-0 w-0 -translate-x-1/2 border-r-8 border-b-8 border-l-8 border-r-transparent border-l-transparent" />

            <div className="from-primary/20 to-primary/10 border-primary/30 rounded-2xl border bg-gradient-to-br px-6 py-4 shadow-lg backdrop-blur-sm">
              <p className="text-foreground text-center text-lg font-semibold">{getMessage()}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
