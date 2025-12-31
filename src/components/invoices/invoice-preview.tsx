"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatInvoiceDate } from "@/lib/invoice-math";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Invoice } from "@/types/invoice";

interface InvoicePreviewProps {
  invoice: Partial<Invoice>;
  className?: string;
}

export function InvoicePreview({ invoice, className }: InvoicePreviewProps) {
  const accentColor = invoice.accentColor || "#0891b2";

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="space-y-6 p-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Invoice</h1>
            {invoice.number && <p className="text-muted-foreground text-sm">Invoice Number #{invoice.number}</p>}
          </div>
          <div className="size-12 rounded-lg" style={{ backgroundColor: accentColor }} />
        </div>

        <Separator />

        {/* Billed By / Billed To */}
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm font-medium">Billed By:</p>
            <div className="space-y-0.5">
              <p className="font-semibold">{invoice.billedFrom?.name}</p>
              {invoice.billedFrom?.addressLine1 && (
                <p className="text-muted-foreground text-sm">{invoice.billedFrom.addressLine1}</p>
              )}
              {invoice.billedFrom?.addressLine2 && (
                <p className="text-muted-foreground text-sm">{invoice.billedFrom.addressLine2}</p>
              )}
              {(invoice.billedFrom?.city || invoice.billedFrom?.state || invoice.billedFrom?.zip) && (
                <p className="text-muted-foreground text-sm">
                  {[invoice.billedFrom?.city, invoice.billedFrom?.state, invoice.billedFrom?.zip]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-muted-foreground text-sm font-medium">Billed To:</p>
            <div className="space-y-0.5">
              <p className="font-semibold">{invoice.billedTo?.name}</p>
              {invoice.billedTo?.addressLine1 && (
                <p className="text-muted-foreground text-sm">{invoice.billedTo.addressLine1}</p>
              )}
              {invoice.billedTo?.addressLine2 && (
                <p className="text-muted-foreground text-sm">{invoice.billedTo.addressLine2}</p>
              )}
              {(invoice.billedTo?.city || invoice.billedTo?.state || invoice.billedTo?.zip) && (
                <p className="text-muted-foreground text-sm">
                  {[invoice.billedTo?.city, invoice.billedTo?.state, invoice.billedTo?.zip].filter(Boolean).join(", ")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm font-medium">Date Issued:</p>
            <p className="text-sm">{invoice.issueDate ? formatInvoiceDate(invoice.issueDate) : "Not set"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm font-medium">Due Date:</p>
            <p className="text-sm">{invoice.dueDate ? formatInvoiceDate(invoice.dueDate) : "Not set"}</p>
          </div>
        </div>

        <Separator />

        {/* Items Table */}
        <div className="space-y-3">
          <p className="text-sm font-medium">Invoice Details</p>
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-muted-foreground p-2.5 text-left text-xs font-medium">ITEM</th>
                  <th className="text-muted-foreground w-16 p-2.5 text-center text-xs font-medium">QTY</th>
                  <th className="text-muted-foreground w-24 p-2.5 text-right text-xs font-medium">UNIT PRICE</th>
                  <th className="text-muted-foreground w-24 p-2.5 text-right text-xs font-medium">AMOUNT</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {invoice.items && invoice.items.length > 0 ? (
                  invoice.items.map((item) => (
                    <tr key={item.id}>
                      <td className="p-2.5">
                        <div className="flex items-center gap-2.5">
                          {item.image && (
                            <div className="bg-muted size-10 flex-shrink-0 overflow-hidden rounded-lg">
                              <img src={item.image} alt={item.description} className="size-full object-cover" />
                            </div>
                          )}
                          <span className="line-clamp-2 text-sm font-medium">{item.description}</span>
                        </div>
                      </td>
                      <td className="p-2.5 text-center text-sm">{item.quantity}</td>
                      <td className="p-2.5 text-right text-sm">
                        {formatCurrency(item.unitPrice, {
                          currency: invoice.currency || "USD",
                        })}
                      </td>
                      <td className="p-2.5 text-right text-sm font-semibold">
                        {formatCurrency(item.total, {
                          currency: invoice.currency || "USD",
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-muted-foreground p-8 text-center text-sm">
                      No items added yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">
                {formatCurrency(invoice.totals?.subtotal || 0, {
                  currency: invoice.currency || "USD",
                })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax ({((invoice.taxRate || 0) * 100).toFixed(0)}%)</span>
              <span className="font-medium">
                {formatCurrency(invoice.totals?.tax || 0, {
                  currency: invoice.currency || "USD",
                })}
              </span>
            </div>
            {(invoice.discount || 0) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Discount</span>
                <span className="font-medium text-red-600">
                  -
                  {formatCurrency(invoice.totals?.discount || 0, {
                    currency: invoice.currency || "USD",
                  })}
                </span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-base font-semibold">
              <span>Grand Total</span>
              <span>
                {formatCurrency(invoice.totals?.total || 0, {
                  currency: invoice.currency || "USD",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Notes</p>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-muted-foreground text-sm whitespace-pre-wrap">{invoice.notes}</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <Separator />
        <div className="text-muted-foreground flex items-center justify-between text-sm">
          <span>{invoice.billedFrom?.name || "Company Name"}</span>
          <span>{invoice.billedFrom?.phone || ""}</span>
        </div>
      </CardContent>
    </Card>
  );
}
