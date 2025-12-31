"use client";

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
    <button
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs tracking-wider uppercase transition-all active:scale-95",
        active ? "border-black bg-black text-white" : "border-black/20 bg-transparent text-black hover:border-black/40",
        className,
      )}
    >
      <span>{label}</span>
      {active && onRemove && (
        <span
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
        </span>
      )}
    </button>
  );
}
