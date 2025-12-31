"use client";

import { X } from "lucide-react";

import { InvoicePreview } from "@/components/invoices/invoice-preview";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { Invoice } from "@/types/invoice";

interface InvoicePreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Partial<Invoice>;
}

export function InvoicePreviewModal({ open, onOpenChange, invoice }: InvoicePreviewModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[95vh] max-w-6xl gap-0 p-0">
        {/* Header */}
        <div className="border-b px-6 py-4">
          <DialogTitle className="text-lg font-semibold">Invoice Preview</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">Full preview of your invoice</DialogDescription>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-4xl">
            <InvoicePreview invoice={invoice} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
