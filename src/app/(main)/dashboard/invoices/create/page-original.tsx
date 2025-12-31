"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { AddClientModal } from "@/components/invoices/add-client-modal";
import { InvoicePreview } from "@/components/invoices/invoice-preview";
import { Form } from "@/components/ui/form";
import { calculateInvoiceTotals, generateInvoiceNumber, validateInvoice } from "@/lib/invoice-math";
import { mockClients } from "@/lib/mock/invoices";
import type { Invoice, Client, Currency } from "@/types/invoice";

import { InvoiceAIChatDialog } from "../_components/invoice-ai-chat-dialog";
import { InvoiceFormRedesigned } from "../_components/invoice-form-redesigned";
import { InvoiceHeaderV2 } from "../_components/invoice-header-v2";
import { InvoicePreviewControls } from "../_components/invoice-preview-controls";

const invoiceFormSchema = z.object({
  number: z.string().min(1, "Invoice number is required"),
  issueDate: z.date(),
  dueDate: z.date(),
  clientId: z.string().min(1, "Client is required"),
  subject: z.string().optional(),
  currency: z.string(),
  items: z.array(z.any()).min(1, "At least one item is required"),
  taxRate: z.number().min(0).max(1),
  discount: z.number().min(0),
  notes: z.string().optional(),
  terms: z.string().optional(),
  template: z.string().optional(),
  accentColor: z.string().optional(),
});

type InvoiceFormData = z.infer<typeof invoiceFormSchema>;

export default function CreateInvoicePage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [zoom, setZoom] = useState(85);
  const [previewData, setPreviewData] = useState<Partial<Invoice>>({});
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Company information (billedFrom)
  const billedFrom = {
    name: "Ryyott Enterprise",
    email: "billing@ryyott.com",
    addressLine1: "123 Business St",
    city: "San Francisco",
    state: "CA",
    zip: "94102",
    country: "United States",
    phone: "+1 (555) 123-4567",
  };

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceFormSchema),
    mode: "onChange",
    defaultValues: {
      number: generateInvoiceNumber(),
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      clientId: "",
      subject: "",
      currency: "USD",
      items: [],
      taxRate: 0.1,
      discount: 0,
      notes: "",
      terms: "",
      template: "modern",
      accentColor: "#0891b2",
    },
  });

  // Track unsaved changes
  useEffect(() => {
    const subscription = form.watch(() => {
      setHasUnsavedChanges(true);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Autosave draft (debounced)
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const timer = setTimeout(() => {
      handleAutosave();
    }, 2000);

    return () => clearTimeout(timer);
  }, [form.watch(), hasUnsavedChanges]);

  // Update preview data and validation when form changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      const selectedClient = clients.find((c) => c.id === value.clientId);
      const items = value.items || [];
      const totals = calculateInvoiceTotals(items, value.taxRate || 0, value.discount || 0);

      const updatedInvoice: Partial<Invoice> = {
        number: value.number,
        issueDate: value.issueDate?.toISOString().split("T")[0],
        dueDate: value.dueDate?.toISOString().split("T")[0],
        currency: value.currency as Currency,
        items,
        taxRate: value.taxRate || 0,
        discount: value.discount || 0,
        notes: value.notes,
        terms: value.terms,
        template: value.template as any,
        accentColor: value.accentColor,
        totals,
        billedFrom,
        billedTo: selectedClient
          ? {
              name: selectedClient.name,
              email: selectedClient.email,
              addressLine1: selectedClient.address.line1,
              addressLine2: selectedClient.address.line2,
              city: selectedClient.address.city,
              state: selectedClient.address.state,
              zip: selectedClient.address.zip,
              country: selectedClient.address.country,
              phone: selectedClient.phone,
              taxId: selectedClient.taxId,
            }
          : undefined,
      };

      setPreviewData(updatedInvoice);

      // Validate
      const validation = validateInvoice(value);
      setValidationErrors(validation.errors);
    });

    return () => subscription.unsubscribe();
  }, [form.watch(), clients]);

  const handleAutosave = async () => {
    setIsSaving(true);
    // Mock autosave
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSaving(false);
    setHasUnsavedChanges(false);
  };

  const handleAddClient = (client: Client) => {
    setClients([...clients, client]);
    form.setValue("clientId", client.id);
  };

  const handleSaveAsDraft = async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      toast.error("Please fix validation errors");
      return;
    }

    setIsSaving(true);

    const formData = form.getValues();
    const invoice: Invoice = {
      ...formData,
      id: crypto.randomUUID(),
      status: "draft",
      currency: formData.currency as Currency,
      issueDate: formData.issueDate.toISOString().split("T")[0],
      dueDate: formData.dueDate.toISOString().split("T")[0],
      totals: calculateInvoiceTotals(formData.items, formData.taxRate, formData.discount),
      billedFrom,
      billedTo: previewData.billedTo!,
      template: formData.template as any,
      discountType: "fixed",
    };

    console.log("Saving draft:", invoice);

    setTimeout(() => {
      setIsSaving(false);
      setHasUnsavedChanges(false);
      toast.success("Invoice saved as draft");
      router.push("/page/invoices");
    }, 1000);
  };

  const handleSendInvoice = async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      toast.error("Please fix validation errors");
      return;
    }

    setIsSaving(true);

    const formData = form.getValues();
    const invoice: Invoice = {
      ...formData,
      id: crypto.randomUUID(),
      status: "sent",
      currency: formData.currency as Currency,
      issueDate: formData.issueDate.toISOString().split("T")[0],
      dueDate: formData.dueDate.toISOString().split("T")[0],
      totals: calculateInvoiceTotals(formData.items, formData.taxRate, formData.discount),
      billedFrom,
      billedTo: previewData.billedTo!,
      template: formData.template as any,
      discountType: "fixed",
    };

    console.log("Sending invoice:", invoice);

    setTimeout(() => {
      setIsSaving(false);
      setHasUnsavedChanges(false);
      toast.success("Invoice sent successfully");
      router.push("/page/invoices");
    }, 1000);
  };

  const handleDownload = () => {
    toast.info("PDF download functionality coming soon");
  };

  const selectedClient = clients.find((c) => c.id === form.watch("clientId"));

  return (
    <>
      {/* Sticky Header with Validation */}
      <InvoiceHeaderV2
        status="draft"
        validationErrors={validationErrors}
        hasUnsavedChanges={hasUnsavedChanges}
        isSaving={isSaving}
        onSaveDraft={handleSaveAsDraft}
        onSendInvoice={handleSendInvoice}
        onDuplicate={() => toast.info("Duplicate functionality coming soon")}
        onDownloadPDF={handleDownload}
        onSharePaymentLink={() => toast.info("Payment link functionality coming soon")}
        onDelete={() => {
          if (confirm("Are you sure you want to delete this invoice?")) {
            router.push("/page/invoices");
          }
        }}
      />

      {/* Main Content - Ultra-Polished Layout */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mx-auto grid max-w-[1850px] grid-cols-1 gap-12 pb-20 xl:grid-cols-[minmax(650px,1fr)_540px]">
          {/* Left: Form Editor */}
          <div className="min-w-0 space-y-6">
            <Form {...form}>
              <InvoiceFormRedesigned
                form={form}
                clients={clients}
                selectedClient={selectedClient}
                onClientEdit={() => setIsAddClientModalOpen(true)}
              />
            </Form>
          </div>

          {/* Right: Preview Panel - Sticky */}
          <div className="hidden xl:block">
            <div className="sticky top-24 space-y-5">
              {/* Preview Header */}
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <div className="size-2 animate-pulse rounded-full bg-green-500" />
                  <h3 className="text-foreground text-sm font-semibold">Live Preview</h3>
                </div>
                <InvoicePreviewControls zoom={zoom} onZoomChange={setZoom} onDownload={handleDownload} />
              </div>

              {/* Preview Container with Enhanced Paper Effect */}
              <div className="group relative">
                {/* Outer Glow */}
                <div className="from-primary/10 to-primary/5 absolute -inset-1 rounded-[1.25rem] bg-gradient-to-br via-transparent opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

                {/* Main Container */}
                <div className="border-border/40 from-muted/20 via-muted/10 relative rounded-[1.25rem] border bg-gradient-to-br to-transparent p-10 shadow-[0_20px_70px_-15px_rgba(0,0,0,0.3)] backdrop-blur-sm">
                  {/* Subtle Grain Texture */}
                  <div className="pointer-events-none absolute inset-0 rounded-[1.25rem] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuMDMiLz48L3N2Zz4=')] opacity-40" />

                  {/* Document Shadow Gradient */}
                  <div className="from-background/5 pointer-events-none absolute inset-0 rounded-[1.25rem] bg-gradient-to-b via-transparent to-black/10" />

                  {/* Preview Content */}
                  <div
                    className="relative origin-top transition-all duration-300 ease-out"
                    style={{
                      transform: `scale(${zoom / 100})`,
                    }}
                  >
                    <div className="bg-background border-border/40 overflow-hidden rounded-xl border shadow-2xl ring-1 ring-black/5">
                      <InvoicePreview invoice={previewData} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Quick Actions - Enhanced */}
              <div className="flex items-center justify-center gap-3 pt-3">
                <button
                  className="group/btn text-muted-foreground hover:text-foreground hover:bg-accent/60 relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs transition-all duration-200 hover:shadow-md active:scale-95"
                  onClick={handleDownload}
                >
                  <span className="text-base transition-transform group-hover/btn:scale-110">📄</span>
                  <span className="font-semibold">Download PDF</span>
                </button>
                <button
                  className="group/btn text-muted-foreground hover:text-foreground hover:bg-accent/60 relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs transition-all duration-200 hover:shadow-md active:scale-95"
                  onClick={() => toast.info("Payment page coming soon")}
                >
                  <span className="text-base transition-transform group-hover/btn:scale-110">💳</span>
                  <span className="font-semibold">Payment Page</span>
                </button>
                <button
                  className="group/btn text-muted-foreground hover:text-foreground hover:bg-accent/60 relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs transition-all duration-200 hover:shadow-md active:scale-95"
                  onClick={() => toast.info("Email functionality coming soon")}
                >
                  <span className="text-base transition-transform group-hover/btn:scale-110">✉️</span>
                  <span className="font-semibold">Send Email</span>
                </button>
              </div>

              {/* Helpful Hint */}
              <div className="pt-2 text-center">
                <p className="text-muted-foreground/60 text-xs">Changes auto-save every 2 seconds</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddClientModal
        open={isAddClientModalOpen}
        onOpenChange={setIsAddClientModalOpen}
        onAddClient={handleAddClient}
      />

      <InvoiceAIChatDialog />
    </>
  );
}
