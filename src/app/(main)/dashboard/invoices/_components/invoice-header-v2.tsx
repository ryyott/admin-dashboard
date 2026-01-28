"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { AlertCircle, MoreVertical, Save, Send, Copy, Download, Link as LinkIcon, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { InvoiceStatus } from "@/types/invoice";

interface InvoiceHeaderProps {
  status: InvoiceStatus;
  validationErrors: string[];
  hasUnsavedChanges?: boolean;
  isSaving?: boolean;
  onSaveDraft: () => void;
  onSendInvoice: () => void;
  onDuplicate?: () => void;
  onDownloadPDF?: () => void;
  onSharePaymentLink?: () => void;
  onDelete?: () => void;
}

const STATUS_CONFIG: Record<
  InvoiceStatus,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  draft: { label: "Draft", variant: "secondary" },
  ready: { label: "Ready", variant: "default" },
  sent: { label: "Sent", variant: "outline" },
  paid: { label: "Paid", variant: "default" },
  overdue: { label: "Overdue", variant: "destructive" },
};

export function InvoiceHeaderV2({
  status,
  validationErrors,
  hasUnsavedChanges = false,
  isSaving = false,
  onSaveDraft,
  onSendInvoice,
  onDuplicate,
  onDownloadPDF,
  onSharePaymentLink,
  onDelete,
}: InvoiceHeaderProps) {
  const router = useRouter();
  const isValid = validationErrors.length === 0;
  const statusConfig = STATUS_CONFIG[status];

  return (
    <div className="bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-10 -mx-6 -mt-6 mb-6 backdrop-blur">
      <div className="border-b">
        <div className="px-6 py-4">
          {/* Top Row: Breadcrumb + Status + Actions */}
          <div className="flex items-center justify-between gap-4">
            {/* Left: Breadcrumb */}
            <div className="flex items-center gap-3">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink onClick={() => router.push("/dashboard/invoices")} className="cursor-pointer">
                      Invoices
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Create Invoice</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              {/* Status Badge */}
              <Badge variant={statusConfig.variant} className="capitalize">
                {statusConfig.label}
              </Badge>

              {/* Unsaved Changes Indicator */}
              {hasUnsavedChanges && !isSaving && (
                <span className="text-muted-foreground flex items-center gap-1 text-xs">
                  <span className="size-1.5 rounded-full bg-amber-500" />
                  Unsaved changes
                </span>
              )}

              {/* Saving Indicator */}
              {isSaving && (
                <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                  <span className="size-1.5 animate-pulse rounded-full bg-blue-500" />
                  Saving...
                </span>
              )}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={onSaveDraft} disabled={isSaving} className="gap-2">
                <Save className="size-4" />
                Save Draft
              </Button>

              <Button size="sm" onClick={onSendInvoice} disabled={!isValid || isSaving} className="gap-2">
                <Send className="size-4" />
                Send Invoice
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="size-9 p-0">
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={onDuplicate}>
                    <Copy className="mr-2 size-4" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onDownloadPDF}>
                    <Download className="mr-2 size-4" />
                    Download PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onSharePaymentLink}>
                    <LinkIcon className="mr-2 size-4" />
                    Share Payment Link
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
                    <Trash2 className="mr-2 size-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Validation Summary (only when invalid) */}
          {!isValid && (
            <div className="border-destructive/20 bg-destructive/5 mt-3 flex items-start gap-2 rounded-lg border px-3 py-2">
              <AlertCircle className="text-destructive mt-0.5 size-4 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-destructive text-sm font-medium">Please fix the following issues:</p>
                <p className="text-muted-foreground mt-0.5 text-xs">{validationErrors.join(" • ")}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
