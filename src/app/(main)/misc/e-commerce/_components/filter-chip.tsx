"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

interface FilterChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  className?: string;
}

export function FilterChip({ label, active = false, onClick, onRemove, className }: FilterChipProps) {
  return (
    <motion.button
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{
        duration: 0.2,
        ease: [0.19, 1, 0.22, 1],
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs tracking-wider uppercase transition-all",
        active ? "border-black bg-black text-white" : "border-black/20 bg-transparent text-black hover:border-black/40",
        className,
      )}
    >
      <span>{label}</span>
      {active && onRemove && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.15 }}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 cursor-pointer transition-opacity hover:opacity-60"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
            }
          }}
        >
          <X className="h-3 w-3" strokeWidth={2} />
        </motion.div>
      )}
    </motion.button>
  );
}
