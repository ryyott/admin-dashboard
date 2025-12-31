"use client";

import { use } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ChevronRight, Mail, FileText, Pencil, Copy, MoreHorizontal } from "lucide-react";

import { InvoicePreview } from "@/components/invoices/invoice-preview";
import { InvoiceStatusBadge } from "@/components/invoices/invoice-status-badge";
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
import { mockInvoices } from "@/lib/mock/invoices";

interface InvoiceViewPageProps {
  params: Promise<{ id: string }>;
}

export default function InvoiceViewPage({ params }: InvoiceViewPageProps) {
  const router = useRouter();
  const { id } = use(params);

  const invoice = mockInvoices.find((inv) => inv.id === id);

  if (!invoice) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
          <h2 className="text-2xl font-bold">Invoice Not Found</h2>
          <p className="text-muted-foreground">The invoice you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/page/invoices">Back to Invoices</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    router.push(`/page/invoices/${invoice.id}/edit`);
  };

  const handleDuplicate = () => {
    console.log("Duplicate invoice:", invoice.number);
    // TODO: Implement duplicate functionality
  };

  const handleEmail = () => {
    console.log("Email invoice:", invoice.number);
    // TODO: Implement email functionality
  };

  const handlePDF = () => {
    console.log("Download PDF:", invoice.number);
    window.print();
  };

  const handleSend = () => {
    console.log("Send invoice:", invoice.number);
    // TODO: Implement send functionality
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/page/invoices">Invoices</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="size-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>{invoice.number}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">Invoice {invoice.number}</h1>
            <InvoiceStatusBadge status={invoice.status} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleEdit}>
            <Pencil className="mr-2 size-4" />
            Edit
          </Button>
          <Button variant="outline" onClick={handleEmail}>
            <Mail className="mr-2 size-4" />
            Email
          </Button>
          <Button variant="outline" onClick={handlePDF}>
            <FileText className="mr-2 size-4" />
            PDF
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDuplicate}>
                <Copy className="mr-2 size-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSend}>
                <Mail className="mr-2 size-4" />
                Send to Client
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Invoice Preview */}
      <div className="mx-auto max-w-4xl">
        <InvoicePreview invoice={invoice} />
      </div>
    </div>
  );
}
