"use client";

import { useEffect, useState, useRef } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { calculateInvoiceTotals, generateInvoiceNumber } from "@/lib/invoice-math";
import { mockClients } from "@/lib/mock/invoices";
import { cn } from "@/lib/utils";
import type { Invoice, Client, Currency } from "@/types/invoice";

import { AddClientModal } from "./add-client-modal";
import { InvoiceItemsEditor } from "./invoice-items-editor";

const invoiceFormSchema = z.object({
  number: z.string().min(1, "Invoice number is required"),
  issueDate: z.date(),
  dueDate: z.date(),
  clientId: z.string().min(1, "Client is required"),
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

interface InvoiceEditorProps {
  invoice?: Partial<Invoice>;
  billedFrom: Partial<Invoice["billedFrom"]>;
  onChange: (invoice: Partial<Invoice>) => void;
}

export function InvoiceEditor({ invoice, billedFrom, onChange }: InvoiceEditorProps) {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);

  // Use ref to avoid infinite loop in useEffect
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      number: invoice?.number || generateInvoiceNumber(),
      issueDate: invoice?.issueDate ? new Date(invoice.issueDate) : new Date(),
      dueDate: invoice?.dueDate ? new Date(invoice.dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      clientId: "",
      currency: (invoice?.currency as string) || "USD",
      items: invoice?.items || [],
      taxRate: invoice?.taxRate || 0.1,
      discount: invoice?.discount || 0,
      notes: invoice?.notes || "",
      terms: invoice?.terms || "",
      template: invoice?.template || "modern",
      accentColor: invoice?.accentColor || "#0891b2",
    },
  });

  // Update parent component whenever form values change
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
        billedFrom: billedFrom as any,
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

      onChangeRef.current(updatedInvoice);
    });

    return () => subscription.unsubscribe();
  }, [form, clients, billedFrom]);

  const handleAddClient = (client: Client) => {
    setClients([...clients, client]);
    form.setValue("clientId", client.id);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Invoice Detail</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="layout">Layout</TabsTrigger>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="payment">Payment</TabsTrigger>
              </TabsList>

              {/* Layout Tab */}
              <TabsContent value="layout" className="mt-4 space-y-4">
                <FormField
                  control={form.control}
                  name="template"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select template" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="minimal">Minimal</SelectItem>
                          <SelectItem value="modern">Modern</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accentColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Accent Color</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input type="color" {...field} className="h-10 w-20" />
                        </FormControl>
                        <Input value={field.value} onChange={field.onChange} placeholder="#0891b2" className="flex-1" />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2 pt-4">
                  <FormLabel>Logo</FormLabel>
                  <Button type="button" variant="outline" className="w-full">
                    Upload Logo (Coming Soon)
                  </Button>
                  <p className="text-muted-foreground text-xs">Logo upload functionality will be available soon</p>
                </div>
              </TabsContent>

              {/* General Tab */}
              <TabsContent value="general" className="mt-4 space-y-4">
                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice Number</FormLabel>
                      <FormControl>
                        <Input placeholder="INV-250117-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="issueDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date Issued</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto size-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Due Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto size-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <FormField
                    control={form.control}
                    name="clientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Billed To</FormLabel>
                        <div className="flex gap-2">
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Select client" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {clients.map((client) => (
                                <SelectItem key={client.id} value={client.id}>
                                  {client.name} - {client.email}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => setIsAddClientModalOpen(true)}
                          >
                            <Plus className="size-4" />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                          <SelectItem value="AUD">AUD (A$)</SelectItem>
                          <SelectItem value="CAD">CAD (C$)</SelectItem>
                          <SelectItem value="JPY">JPY (¥)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="items"
                  render={({ field }) => (
                    <FormItem>
                      <InvoiceItemsEditor
                        items={field.value}
                        currency={form.watch("currency")}
                        onChange={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="taxRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax Percentage</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(parseFloat(value))}
                          value={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select tax rate" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0">0%</SelectItem>
                            <SelectItem value="0.05">5%</SelectItem>
                            <SelectItem value="0.08">8%</SelectItem>
                            <SelectItem value="0.1">10%</SelectItem>
                            <SelectItem value="0.15">15%</SelectItem>
                            <SelectItem value="0.2">20%</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {/* Payment Tab */}
              <TabsContent value="payment" className="mt-4 space-y-4">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Payment is due by January 31, 2025.
Include the invoice number in the payment reference to ensure accurate processing."
                          className="min-h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Terms</FormLabel>
                      <FormControl>
                        <Input placeholder="Net 30" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2 pt-4">
                  <FormLabel>Payment Methods</FormLabel>
                  <Button type="button" variant="outline" className="w-full">
                    Add Payment Method (Coming Soon)
                  </Button>
                  <p className="text-muted-foreground text-xs">
                    Configure bank transfer, crypto, and card payment options
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </Form>
        </CardContent>
      </Card>

      <AddClientModal
        open={isAddClientModalOpen}
        onOpenChange={setIsAddClientModalOpen}
        onAddClient={handleAddClient}
      />
    </>
  );
}
