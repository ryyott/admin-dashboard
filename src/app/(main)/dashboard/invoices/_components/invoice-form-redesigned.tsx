"use client";

import { useState } from "react";

import { format } from "date-fns";
import { CalendarIcon, Pencil, ChevronDown, FileText, Plus, UserPlus } from "lucide-react";
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

interface InvoiceFormRedesignedProps {
  form: UseFormReturn<any>;
  clients: Client[];
  selectedClient: Client | undefined;
  onClientEdit: () => void;
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

export function InvoiceFormRedesigned({ form, clients, selectedClient, onClientEdit }: InvoiceFormRedesignedProps) {
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  return (
    <div className="space-y-10">
      {/* Billed To Section */}
      <div className="group/section space-y-4">
        <div className="flex items-center gap-2">
          <div className="bg-primary/60 size-1.5 rounded-full" />
          <h3 className="text-foreground text-sm font-bold tracking-tight">Billed to</h3>
        </div>
        <Card className="border-border/40 hover:border-border/60 shadow-lg shadow-black/5 transition-all duration-300 hover:shadow-xl hover:shadow-black/10">
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
                <Button type="button" variant="ghost" size="icon" onClick={onClientEdit} className="hover:bg-accent/50">
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
                        <SelectTrigger className="border-border/50 h-10">
                          <SelectValue placeholder="Select client" />
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
      </div>

      {/* Subject & Due Date */}
      <div className="grid grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground text-sm font-medium">Subject</FormLabel>
              <FormControl>
                <Input
                  placeholder="Electronic purchasing"
                  className="border-border/40 focus-visible:border-primary/50 focus-visible:ring-primary/20 h-11 transition-all focus-visible:ring-2"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-foreground text-sm font-medium">Due Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "border-border/40 hover:border-border/60 hover:bg-accent/60 h-11 pl-3 text-left font-normal transition-all",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? format(field.value, "dd MMMM yyyy") : <span>Pick a date</span>}
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

      {/* Currency - Tabs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="bg-primary/60 size-1.5 rounded-full" />
          <h3 className="text-foreground text-sm font-bold tracking-tight">Currency</h3>
        </div>
        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Tabs value={field.value} onValueChange={field.onChange}>
                  <TabsList className="grid w-full grid-cols-6">
                    {CURRENCIES.map((currency) => (
                      <TabsTrigger key={currency.value} value={currency.value} className="gap-2">
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
      </div>

      {/* Product Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="bg-primary/60 size-1.5 rounded-full" />
          <h3 className="text-foreground text-sm font-bold tracking-tight">Products & Services</h3>
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
      </div>

      {/* Discount & Tax - Inline Inputs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="bg-primary/60 size-1.5 rounded-full" />
          <h3 className="text-foreground text-sm font-bold tracking-tight">Pricing Adjustments</h3>
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
                    <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 text-sm">$</span>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="border-border/50 h-10 pl-7"
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
                  <Tabs value={field.value.toString()} onValueChange={(value) => field.onChange(parseFloat(value))}>
                    <TabsList className="grid w-full grid-cols-6">
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

      {/* Notes - Collapsible */}
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
                {isNotesOpen ? "Hide Notes" : "Add Notes"}
              </span>
              <ChevronDown className={cn("size-4 transition-transform duration-300", isNotesOpen && "rotate-180")} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="animate-in slide-in-from-top-2 pt-5 duration-300">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/90 text-sm font-medium">Customer Notes</FormLabel>
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
    </div>
  );
}
