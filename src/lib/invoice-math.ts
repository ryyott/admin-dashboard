import type { InvoiceItem, InvoiceTotals, DiscountType } from "@/types/invoice";

/**
 * Calculate the subtotal from invoice items
 */
export function calculateSubtotal(items: InvoiceItem[]): number {
  return items.reduce((sum, item) => sum + item.total, 0);
}

/**
 * Calculate the tax amount based on subtotal and tax rate
 */
export function calculateTax(subtotal: number, taxRate: number): number {
  return subtotal * taxRate;
}

/**
 * Calculate discount amount based on type
 */
export function calculateDiscountAmount(subtotal: number, discount: number, discountType: DiscountType): number {
  if (discountType === "percent") {
    return subtotal * (discount / 100);
  }
  return discount;
}

/**
 * Calculate the grand total
 */
export function calculateTotal(subtotal: number, tax: number, discount: number, shipping: number = 0): number {
  return subtotal + tax - discount + shipping;
}

/**
 * Calculate all invoice totals
 */
export function calculateInvoiceTotals(
  items: InvoiceItem[],
  taxRate: number,
  discount: number,
  discountType: DiscountType = "fixed",
  shipping: number = 0,
): InvoiceTotals {
  const subtotal = calculateSubtotal(items);
  const discountAmount = calculateDiscountAmount(subtotal, discount, discountType);
  const tax = calculateTax(subtotal, taxRate);
  const total = calculateTotal(subtotal, tax, discountAmount, shipping);

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    discount: Math.round(discountAmount * 100) / 100,
    shipping: shipping > 0 ? Math.round(shipping * 100) / 100 : undefined,
    total: Math.round(total * 100) / 100,
  };
}

/**
 * Calculate item total from quantity and unit price
 */
export function calculateItemTotal(quantity: number, unitPrice: number): number {
  return Math.round(quantity * unitPrice * 100) / 100;
}

/**
 * Generate a unique invoice number
 * Format: INV-YYMMDD-XXX
 */
export function generateInvoiceNumber(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const random = String(Math.floor(Math.random() * 1000)).padStart(3, "0");

  return `INV-${year}${month}${day}-${random}`;
}

/**
 * Format a date for invoice display
 */
export function formatInvoiceDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Check if an invoice is overdue
 */
export function isInvoiceOverdue(dueDate: string, status: string): boolean {
  if (status === "paid") return false;
  const due = new Date(dueDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return due < now;
}

/**
 * Calculate due date based on preset (Net 7, Net 14, Net 30)
 */
export function calculateDueDateFromPreset(issueDate: Date, preset: "net7" | "net14" | "net30"): Date {
  const dueDate = new Date(issueDate);
  const days = preset === "net7" ? 7 : preset === "net14" ? 14 : 30;
  dueDate.setDate(dueDate.getDate() + days);
  return dueDate;
}

/**
 * Validate invoice has all required fields
 */
export function validateInvoice(invoice: Partial<any>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!invoice.clientId) errors.push("Missing client");
  if (!invoice.number) errors.push("Missing invoice number");
  if (!invoice.issueDate) errors.push("Missing issue date");
  if (!invoice.dueDate) errors.push("Missing due date");
  if (!invoice.currency) errors.push("Missing currency");
  if (!invoice.items || invoice.items.length === 0) {
    errors.push("Missing items");
  } else {
    const invalidItems = invoice.items.some(
      (item: any) => !item.description || item.quantity <= 0 || item.unitPrice < 0,
    );
    if (invalidItems) errors.push("Invalid item data");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
