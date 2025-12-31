"use client";

import { useState, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Send, Save, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface InvoiceCompletionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSendInvoice: () => void;
  onSaveDraft: () => void;
  onDownloadPDF: () => void;
  clientName?: string;
}

// Generate confetti positions (runs only on client side)
const generateConfetti = () =>
  Array.from({ length: 30 }, (_, i) => ({
    x: Math.random() * 500,
    startY: -50,
    endY: 600,
    rotate: Math.random() * 720 - 360,
    duration: 3 + Math.random() * 2,
    delay: Math.random() * 0.5,
    emoji: ["🎉", "🎊", "✨", "💰", "🚀"][Math.floor(Math.random() * 5)],
  }));

export function InvoiceCompletionModal({
  open,
  onOpenChange,
  onSendInvoice,
  onSaveDraft,
  onDownloadPDF,
  clientName,
}: InvoiceCompletionModalProps) {
  const [confetti, setConfetti] = useState<ReturnType<typeof generateConfetti>>([]);

  // Generate confetti only on client side to avoid hydration issues
  useEffect(() => {
    if (open) {
      setConfetti(generateConfetti());
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden border-0 p-0 sm:max-w-[550px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          {/* Confetti Background */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {confetti.map((piece, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                initial={{
                  x: piece.x,
                  y: piece.startY,
                  rotate: 0,
                  opacity: 0,
                }}
                animate={{
                  y: piece.endY,
                  rotate: piece.rotate,
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: piece.duration,
                  delay: piece.delay,
                  ease: "easeOut",
                }}
              >
                {piece.emoji}
              </motion.div>
            ))}
          </div>

          {/* Main Content */}
          <div className="from-background via-background to-primary/5 relative bg-gradient-to-br p-10 text-center">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
              className="mb-6 flex justify-center"
            >
              <div className="relative">
                <CheckCircle2 className="size-24 text-green-500" />
                {/* Pulse ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-green-500"
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
              </div>
            </motion.div>

            {/* Success Message */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <h2 className="text-foreground mb-3 text-3xl font-bold">Woohoo! You're All Set! 🎉</h2>
              <p className="text-muted-foreground mb-2 text-lg">
                Your invoice{clientName ? ` for ${clientName}` : ""} is ready to go!
              </p>
              <p className="text-muted-foreground/80 text-sm">What would you like to do next?</p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 space-y-3"
            >
              {/* Primary: Send Invoice */}
              <Button
                onClick={onSendInvoice}
                size="lg"
                className="group relative h-14 w-full gap-3 overflow-hidden text-base font-semibold"
              >
                <motion.div
                  className="from-primary/0 to-primary/0 absolute inset-0 bg-gradient-to-r via-white/20"
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <Send className="size-5 transition-transform group-hover:translate-x-1" />
                Send Invoice Now
              </Button>

              {/* Secondary Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={onSaveDraft} variant="outline" size="lg" className="group h-12 gap-2">
                  <Save className="size-4 transition-transform group-hover:scale-110" />
                  Save as Draft
                </Button>
                <Button onClick={onDownloadPDF} variant="outline" size="lg" className="group h-12 gap-2">
                  <Download className="size-4 transition-transform group-hover:scale-110" />
                  Download PDF
                </Button>
              </div>
            </motion.div>

            {/* Fun Fact */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="border-border/40 mt-8 border-t pt-6"
            >
              <div className="bg-primary/10 text-muted-foreground inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs">
                <span className="text-base">💡</span>
                <span className="font-medium">Pro tip: You can customize invoice templates in Settings</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
