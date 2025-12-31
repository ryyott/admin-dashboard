"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Plus, FileDown } from "lucide-react";

import { InvoicesTable } from "@/components/invoices/invoices-table";
import { Button } from "@/components/ui/button";
import { mockInvoices } from "@/lib/mock/invoices";
import type { Invoice } from "@/types/invoice";

import { InvoiceAIChatDialog } from "./_components/invoice-ai-chat-dialog";
import { InvoiceChart } from "./_components/invoice-chart";
import { InvoiceStatsCards } from "./_components/invoice-stats-cards";

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices] = useState<Invoice[]>(mockInvoices);

  const handleEdit = (invoice: Invoice) => {
    router.push(`/page/invoices/${invoice.id}/edit`);
  };

  const handleDuplicate = (invoice: Invoice) => {
    console.log("Duplicate invoice:", invoice.number);
    // TODO: Implement duplicate functionality
  };

  const handleDownload = (invoice: Invoice) => {
    console.log("Download PDF:", invoice.number);
    window.print();
  };

  const handleSend = (invoice: Invoice) => {
    console.log("Send invoice:", invoice.number);
    // TODO: Implement send functionality
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">Manage and track all your invoices</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <FileDown className="size-4" />
            Export
          </Button>
          <Button className="gap-2" onClick={() => router.push("/page/invoices/create")}>
            <Plus className="size-4" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <InvoiceStatsCards invoices={invoices} />

      {/* Chart */}
      <InvoiceChart invoices={invoices} />

      {/* Invoices Table */}
      <InvoicesTable
        invoices={invoices}
        onEdit={handleEdit}
        onDuplicate={handleDuplicate}
        onDownload={handleDownload}
        onSend={handleSend}
      />

      {/* AI Chat Dialog */}
      <InvoiceAIChatDialog />
    </div>
  );
}
