export type InvoiceStatus = "draft" | "ready" | "sent" | "paid" | "overdue";

export type Currency = "USD" | "EUR" | "GBP" | "AUD" | "CAD" | "JPY";

export type DiscountType = "percent" | "fixed";

export type DueDatePreset = "net7" | "net14" | "net30" | "custom";

export type PaymentMethodType = "bank" | "crypto" | "card";

export interface Party {
  name: string;
  email?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  phone?: string;
  taxId?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  detailedDescription?: string; // Optional expanded description
  image?: string; // Optional product image URL
  quantity: number;
  unitPrice: number;
  total: number;
  taxRate?: number; // Per-line tax if enabled
}

export interface PaymentMethod {
  type: PaymentMethodType;
  details: string;
}

export interface InvoiceTotals {
  subtotal: number;
  tax: number;
  discount: number;
  shipping?: number;
  total: number;
}

export interface Invoice {
  id: string;
  number: string; // INV-129482-000
  status: InvoiceStatus;
  currency: Currency;
  issueDate: string; // ISO date string
  dueDate: string; // ISO date string
  subject?: string;
  billedFrom: Party;
  billedTo: Party;
  items: InvoiceItem[];
  taxRate: number; // 0.10 for 10%
  discount: number; // flat amount or percentage
  discountType: DiscountType;
  shipping?: number;
  notes?: string; // Customer-facing notes
  internalNotes?: string; // Internal only
  terms?: string;
  attachments?: string[]; // Mock file names
  paymentMethods?: PaymentMethod[];
  paymentPageEnabled?: boolean;
  paymentPageUrl?: string;
  totals: InvoiceTotals;
  // Layout options
  template?: "minimal" | "modern" | "professional";
  accentColor?: string;
  logoUrl?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  company?: string;
  address: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  phone?: string;
  taxId?: string;
  avatar?: string;
}
