"use client";

import { useState, useEffect } from "react";

import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarIcon, Pencil, ChevronDown, FileText, UserPlus } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { InvoiceItemsEditor } from "@/components/invoices/invoice-items-editor";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn, getInitials } from "@/lib/utils";
import type { Client } from "@/types/invoice";

interface InvoiceFormSteppedProps {
  form: UseFormReturn<any>;
  clients: Client[];
  selectedClient: Client | undefined;
  onClientEdit: () => void;
  currentStep: number;
  onStepComplete: (step: number) => void;
}

const CURRENCIES = [
  { value: "USD", label: "USD", symbol: "$", flag: "🇺🇸" },
  { value: "EUR", label: "EUR", symbol: "€", flag: "🇪🇺" },
  { value: "GBP", label: "GBP", symbol: "£", flag: "🇬🇧" },
  { value: "CAD", label: "CAD", symbol: "$", flag: "🇨🇦" },
  { value: "AUD", label: "AUD", symbol: "$", flag: "🇦🇺" },
  { value: "JPY", label: "JPY", symbol: "¥", flag: "🇯🇵" },
];

const TAX_RATES = [
  { value: 0, label: "0%" },
  { value: 0.05, label: "5%" },
  { value: 0.08, label: "8%" },
  { value: 0.1, label: "10%" },
  { value: 0.15, label: "15%" },
  { value: 0.2, label: "20%" },
];

const fieldVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 20,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: { duration: 0.3 },
  },
};

export function InvoiceFormStepped({
  form,
  clients,
  selectedClient,
  onClientEdit,
  currentStep,
  onStepComplete,
}: InvoiceFormSteppedProps) {
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Auto-advance when field is completed
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (!name) return;

      // Step 1: Client selection
      if (currentStep === 1 && name === "clientId" && value.clientId) {
        setTimeout(() => onStepComplete(1), 500);
      }

      // Step 2: Subject
      if (currentStep === 2 && name === "subject" && value.subject?.length > 0) {
        setTimeout(() => onStepComplete(2), 500);
      }

      // Step 3: Due date
      if (currentStep === 3 && name === "dueDate" && value.dueDate) {
        setTimeout(() => onStepComplete(3), 500);
      }

      // Step 4: Currency
      if (currentStep === 4 && name === "currency" && value.currency) {
        setTimeout(() => onStepComplete(4), 500);
      }

      // Step 5: Items (at least one item)
      if (currentStep === 5 && name === "items" && value.items?.length > 0) {
        const hasValidItem = value.items.some(
          (item: any) => item.description && item.quantity > 0 && item.unitPrice > 0,
        );
        if (hasValidItem) {
          setTimeout(() => onStepComplete(5), 500);
        }
      }

      // Step 6: All remaining fields appear together (tax, discount, notes are all optional)
      // User can manually proceed or auto-advance won't block them
    });

    return () => subscription.unsubscribe();
  }, [form, currentStep, onStepComplete]);

  return (
    <div className="space-y-8 pt-8 pb-32">
      {/* Step 0: Welcome (handled by mascot) */}

      {/* Step 1: Client Selection */}
      <AnimatePresence mode="wait">
        {currentStep >= 1 && (
          <motion.div
            key="step-1"
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full text-sm font-bold">
                1
              </div>
              <h3 className="text-foreground text-base font-bold">Who are you billing?</h3>
            </div>
            <Card className="border-border/40 shadow-lg shadow-black/5 transition-all duration-300 hover:shadow-xl hover:shadow-black/10">
              <CardContent className="p-6">
                {selectedClient ? (
                  <div className="flex items-start gap-4">
                    <Avatar className="ring-border/30 size-12 ring-2">
                      <AvatarImage src={selectedClient.avatar} />
                      <AvatarFallback className="text-base font-semibold">
                        {getInitials(selectedClient.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-base font-semibold">{selectedClient.name}</h4>
                      <p className="text-muted-foreground mt-0.5 text-sm">{selectedClient.email}</p>
                      {selectedClient.company && (
                        <p className="text-muted-foreground mt-0.5 text-sm">{selectedClient.company}</p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={onClientEdit}
                      className="hover:bg-accent/50"
                    >
                      <Pencil className="size-4" />
                    </Button>
                  </div>
                ) : (
                  <FormField
                    control={form.control}
                    name="clientId"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={(value) => {
                            if (value === "create-new") {
                              onClientEdit();
                            } else {
                              field.onChange(value);
                            }
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-border/50 h-12 text-base">
                              <SelectValue placeholder="Select a client..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <div className="px-2 pt-1 pb-2">
                              <Input
                                placeholder="Search clients..."
                                className="h-8"
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => {
                                  const search = e.target.value.toLowerCase();
                                  const items = document.querySelectorAll('[role="option"]');
                                  items.forEach((item) => {
                                    const text = item.textContent?.toLowerCase() || "";
                                    if (text.includes(search) || item.getAttribute("data-value") === "create-new") {
                                      (item as HTMLElement).style.display = "";
                                    } else {
                                      (item as HTMLElement).style.display = "none";
                                    }
                                  });
                                }}
                              />
                            </div>
                            <SelectItem value="create-new">
                              <div className="text-primary flex items-center gap-2">
                                <UserPlus className="size-4" />
                                <span className="font-medium">Create New Client</span>
                              </div>
                            </SelectItem>
                            <div className="my-1 border-t" />
                            {clients.map((client) => (
                              <SelectItem key={client.id} value={client.id}>
                                <div className="flex items-center gap-2">
                                  <Avatar className="size-6">
                                    <AvatarImage src={client.avatar} />
                                    <AvatarFallback className="text-xs">{getInitials(client.name)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{client.name}</div>
                                    <div className="text-muted-foreground text-xs">{client.email}</div>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 2: Subject */}
      <AnimatePresence mode="wait">
        {currentStep >= 2 && (
          <motion.div
            key="step-2"
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full text-sm font-bold">
                2
              </div>
              <h3 className="text-foreground text-base font-bold">What's this invoice for?</h3>
            </div>
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="e.g., Website Development Services"
                      className="border-border/40 focus-visible:border-primary/50 focus-visible:ring-primary/20 h-12 text-base transition-all focus-visible:ring-2"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 3: Due Date */}
      <AnimatePresence mode="wait">
        {currentStep >= 3 && (
          <motion.div
            key="step-3"
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full text-sm font-bold">
                3
              </div>
              <h3 className="text-foreground text-base font-bold">When should they pay?</h3>
            </div>
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "border-border/40 hover:border-border/60 hover:bg-accent/60 h-12 pl-3 text-left text-base font-normal transition-all",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? format(field.value, "MMMM dd, yyyy") : <span>Pick a due date</span>}
                          <CalendarIcon className="ml-auto size-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setIsCalendarOpen(false);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 4: Currency */}
      <AnimatePresence mode="wait">
        {currentStep >= 4 && (
          <motion.div
            key="step-4"
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full text-sm font-bold">
                4
              </div>
              <h3 className="text-foreground text-base font-bold">Which currency?</h3>
            </div>
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Tabs value={field.value} onValueChange={field.onChange}>
                      <TabsList className="grid h-12 w-full grid-cols-6">
                        {CURRENCIES.map((currency) => (
                          <TabsTrigger key={currency.value} value={currency.value} className="gap-2 text-base">
                            <span>{currency.flag}</span>
                            <span>{currency.label}</span>
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 5: Items */}
      <AnimatePresence mode="wait">
        {currentStep >= 5 && (
          <motion.div
            key="step-5"
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full text-sm font-bold">
                5
              </div>
              <h3 className="text-foreground text-base font-bold">What are you selling?</h3>
            </div>
            <FormField
              control={form.control}
              name="items"
              render={({ field }) => (
                <FormItem>
                  <InvoiceItemsEditor items={field.value} currency={form.watch("currency")} onChange={field.onChange} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 6: Tax, Discount & Notes - All together */}
      <AnimatePresence mode="wait">
        {currentStep >= 6 && (
          <motion.div
            key="step-6"
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            {/* Discount & Tax */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full text-sm font-bold">
                  6
                </div>
                <h3 className="text-foreground text-base font-bold">Any discounts or taxes?</h3>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/90 text-sm font-medium">Discount Amount</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 text-sm">
                            $
                          </span>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            className="border-border/50 h-11 pl-7"
                            value={field.value === 0 ? "" : field.value}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            onFocus={(e) => {
                              if (field.value === 0) {
                                e.target.select();
                              }
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="taxRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/90 text-sm font-medium">Tax Percentage</FormLabel>
                      <FormControl>
                        <Tabs
                          value={field.value.toString()}
                          onValueChange={(value) => field.onChange(parseFloat(value))}
                        >
                          <TabsList className="grid h-11 w-full grid-cols-6">
                            {TAX_RATES.map((rate) => (
                              <TabsTrigger key={rate.value} value={rate.value.toString()}>
                                {rate.label}
                              </TabsTrigger>
                            ))}
                          </TabsList>
                        </Tabs>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Notes Section */}
            <div className="space-y-4">
              <Collapsible open={isNotesOpen} onOpenChange={setIsNotesOpen}>
                <CollapsibleTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-border/40 hover:bg-accent/60 hover:border-border/60 group/notes h-11 w-full justify-between transition-all duration-300 hover:shadow-md"
                  >
                    <span className="flex items-center gap-2.5 text-sm font-semibold">
                      <FileText className="size-4 transition-transform group-hover/notes:scale-110" />
                      {isNotesOpen ? "Hide Notes" : "Add Notes (Optional)"}
                    </span>
                    <ChevronDown
                      className={cn("size-4 transition-transform duration-300", isNotesOpen && "rotate-180")}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="animate-in slide-in-from-top-2 pt-5 duration-300">
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Add notes about payment terms, delivery instructions, or any other relevant information..."
                            className="border-border/40 focus-visible:border-primary/50 focus-visible:ring-primary/20 min-h-28 resize-none transition-all focus-visible:ring-2"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CollapsibleContent>
              </Collapsible>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
