"use client";

import { Building2, MapPin, CreditCard, Wallet } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import type { Invoice } from "@/types/invoice";

interface InvoicePreviewModernProps {
  invoice: Partial<Invoice>;
}

export function InvoicePreviewModern({ invoice }: InvoicePreviewModernProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });
  };

  const getInitials = (name?: string) => {
    if (!name) return "—";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="bg-card border-border border p-4 shadow-lg">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-1.5">
          <div className="flex size-6 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
            <span className="text-[10px] font-bold text-white">R</span>
          </div>
          <div>
            <p className="text-xs font-semibold">{invoice.billedFrom?.name || "Ryyott Studios"}</p>
            <p className="text-muted-foreground text-[10px]">Invoice Creator</p>
          </div>
        </div>
        <p className="text-muted-foreground text-[10px]">Dashboard</p>
      </div>

      {/* Invoice Details - Top Right */}
      <div className="mb-3 flex justify-end gap-4 text-[10px]">
        <div>
          <p className="text-muted-foreground mb-1">Invoice Number</p>
          <p className="font-medium">{invoice.number || "000001"}</p>
        </div>
        <div>
          <p className="text-muted-foreground mb-1">Issued</p>
          <p className="font-medium">{formatDate(invoice.issueDate)}</p>
        </div>
        <div>
          <p className="text-muted-foreground mb-1">Due Date</p>
          <p className="font-medium">{formatDate(invoice.dueDate)}</p>
        </div>
      </div>

      {/* From/To Section */}
      <div className="mb-3 grid grid-cols-2 gap-4">
        {/* From */}
        <div>
          <div className="mb-1.5 flex items-center gap-1">
            <div className="bg-muted flex size-4 items-center justify-center rounded-full">
              <span className="text-[8px]">↑</span>
            </div>
            <p className="text-[10px] font-medium">From</p>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-start gap-1.5">
              <div className="flex size-5 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-purple-500 to-pink-500">
                <span className="text-[8px] font-bold text-white">R</span>
              </div>
              <div>
                <p className="text-[10px] font-medium">{invoice.billedFrom?.name || "Ryyott Studios"}</p>
                <p className="text-muted-foreground text-[9px]">
                  {invoice.billedFrom?.email || "contact@ryyott.studio"}
                </p>
              </div>
            </div>
            <div className="space-y-0.5 text-[9px]">
              <div className="flex items-start gap-1.5">
                <Building2 className="text-muted-foreground mt-0.5 size-3" />
                <div>
                  <p className="text-muted-foreground">Address</p>
                  <p className="font-medium">{invoice.billedFrom?.addressLine1 || "Atatürk Mh."}</p>
                </div>
              </div>
              <div className="flex items-start gap-1.5">
                <MapPin className="text-muted-foreground mt-0.5 size-3" />
                <div>
                  <p className="text-muted-foreground">City, State, Zip</p>
                  <p className="font-medium">
                    {invoice.billedFrom?.city || "Karesi"}, {invoice.billedFrom?.state || "Balıkesir"},{" "}
                    {invoice.billedFrom?.zip || "10010"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-1.5">
                <CreditCard className="text-muted-foreground mt-0.5 size-3" />
                <div>
                  <p className="text-muted-foreground">Tax ID</p>
                  <p className="font-medium">{invoice.billedFrom?.taxId || "934O1RS"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* To */}
        <div>
          <div className="mb-1.5 flex items-center gap-1">
            <div className="bg-muted flex size-4 items-center justify-center rounded-full">
              <span className="text-[8px]">↓</span>
            </div>
            <p className="text-[10px] font-medium">To</p>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-start gap-1.5">
              <Avatar className="size-5 bg-orange-500 dark:bg-orange-600">
                <AvatarFallback className="bg-orange-500 text-[8px] text-white dark:bg-orange-600">
                  {getInitials(invoice.billedTo?.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-[10px] font-medium">{invoice.billedTo?.name || "—"}</p>
                <p className="text-muted-foreground text-[9px]">{invoice.billedTo?.email || "—"}</p>
              </div>
            </div>
            {invoice.billedTo && (
              <div className="space-y-0.5 text-[9px]">
                <div className="flex items-start gap-1.5">
                  <Building2 className="text-muted-foreground mt-0.5 size-3" />
                  <div>
                    <p className="text-muted-foreground">Address</p>
                    <p className="font-medium">{invoice.billedTo.addressLine1 || "—"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-1.5">
                  <MapPin className="text-muted-foreground mt-0.5 size-3" />
                  <div>
                    <p className="text-muted-foreground">City, State, Zip</p>
                    <p className="font-medium">
                      {invoice.billedTo.city}, {invoice.billedTo.state}, {invoice.billedTo.zip}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-1.5">
                  <CreditCard className="text-muted-foreground mt-0.5 size-3" />
                  <div>
                    <p className="text-muted-foreground">Tax ID</p>
                    <p className="font-medium">{invoice.billedTo.taxId || "—"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Separator className="my-2" />

      {/* Line Items */}
      <div className="mb-2">
        <div className="text-muted-foreground mb-1.5 grid grid-cols-12 gap-2 text-[9px] font-medium">
          <div className="col-span-6">Description</div>
          <div className="col-span-2 text-center">QTY</div>
          <div className="col-span-2 text-right">Price</div>
          <div className="col-span-2 text-right">Amount</div>
        </div>
        <div className="space-y-1.5">
          {invoice.items && invoice.items.length > 0 ? (
            invoice.items.map((item, index) => (
              <div key={item.id || index} className="grid grid-cols-12 items-center gap-2 text-[10px]">
                <div className="col-span-6 flex items-center gap-1">
                  <div
                    className="size-1 rounded-full"
                    style={{
                      backgroundColor: index === 0 ? "#f59e0b" : "#3b82f6",
                    }}
                  />
                  <span className="font-medium">{item.description}</span>
                </div>
                <div className="col-span-2 text-center">{item.quantity}</div>
                <div className="col-span-2 text-right">
                  {formatCurrency(item.unitPrice / 100, {
                    currency: invoice.currency || "USD",
                  })}
                </div>
                <div className="col-span-2 text-right font-medium">
                  {formatCurrency(item.total / 100, {
                    currency: invoice.currency || "USD",
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="text-muted-foreground py-3 text-center text-[10px]">No items added yet</div>
          )}
        </div>
      </div>

      <Separator className="my-2" />

      {/* Totals */}
      <div className="space-y-1 text-[10px]">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">
            {formatCurrency((invoice.totals?.subtotal || 0) / 100, {
              currency: invoice.currency || "USD",
            })}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax</span>
          <span className="font-medium">
            {formatCurrency((invoice.totals?.tax || 0) / 100, {
              currency: invoice.currency || "USD",
            })}
          </span>
        </div>
        {invoice.totals?.discount ? (
          <div className="flex justify-between text-red-600">
            <span>Discount</span>
            <span>
              -
              {formatCurrency((invoice.totals.discount || 0) / 100, {
                currency: invoice.currency || "USD",
              })}
            </span>
          </div>
        ) : null}
        <div className="flex justify-between pt-0.5 text-xs font-semibold">
          <span>Total</span>
          <span>
            {formatCurrency((invoice.totals?.total || 0) / 100, {
              currency: invoice.currency || "USD",
            })}
          </span>
        </div>
      </div>

      <Separator className="my-2" />

      {/* Footer */}
      <div className="space-y-2">
        {/* Signature */}
        <div>
          <p className="text-muted-foreground mb-0.5 text-[9px]">Signature</p>
          <div className="flex h-8 items-center">
            <svg width="60" height="20" viewBox="0 0 120 40" className="text-muted-foreground">
              <path
                d="M10 30 Q 20 10, 40 25 T 80 20 Q 90 15, 110 25"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
        </div>

        {/* Payment Info */}
        <div className="grid grid-cols-2 gap-3 text-[9px]">
          <div>
            <p className="text-muted-foreground mb-1">Payable IN</p>
            <div className="flex items-center gap-1">
              <div className="flex size-3.5 items-center justify-center rounded-full bg-teal-400">
                <span className="text-[7px] font-bold text-white">T</span>
              </div>
              <div>
                <p className="text-[10px] font-medium">Tether</p>
                <p className="text-muted-foreground text-[8px]">USDT</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Instructions</p>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1">
                <Wallet className="text-muted-foreground size-2.5" />
                <div>
                  <p className="text-muted-foreground">Network</p>
                  <p className="font-medium">Tron</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <CreditCard className="text-muted-foreground size-2.5" />
                <div>
                  <p className="text-muted-foreground">Wallet</p>
                  <p className="font-mono text-[8px] font-medium">TY7MehaN8x4b2o1Sd6d414O3F2...</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Powered By */}
        <div className="text-muted-foreground pt-1 text-center text-[9px]">
          <p>
            Powered by <span className="text-foreground font-medium">Ryyott Studios</span>
          </p>
        </div>
      </div>
    </Card>
  );
}
