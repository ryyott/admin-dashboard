"use client";

import { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface InvoiceBuilderLayoutProps {
  formContent: ReactNode;
  previewContent: ReactNode;
  className?: string;
}

export function InvoiceBuilderLayout({ formContent, previewContent, className }: InvoiceBuilderLayoutProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-6 lg:grid-cols-[1fr_0.6fr]", className)}>
      {/* Left Panel: Form */}
      <div className="animate-in slide-in-from-bottom-4 space-y-6 duration-200">{formContent}</div>

      {/* Right Panel: Preview */}
      <div className="animate-in slide-in-from-bottom-4 hidden delay-100 duration-200 lg:block">
        <div className="sticky top-4 space-y-4">{previewContent}</div>
      </div>
    </div>
  );
}
