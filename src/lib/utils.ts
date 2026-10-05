import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export * from "./serialize";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string | { toString(): string }, currency = "INR"): string {
  const numericAmount = typeof amount === "number" ? amount : Number(amount.toString());
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(numericAmount);
}

export function calculateGST(
  unitPrice: number,
  quantity: number,
  gstRate: number,
  isInterState: boolean
) {
  const baseSubtotal = unitPrice * quantity;
  const taxableAmount = (baseSubtotal * 100) / (100 + gstRate);
  const totalTax = baseSubtotal - taxableAmount;

  if (isInterState) {
    return {
      taxableAmount,
      cgst: 0,
      sgst: 0,
      igst: totalTax,
      totalTax,
      grandTotal: baseSubtotal,
    };
  }

  const halfTax = totalTax / 2;
  return {
    taxableAmount,
    cgst: halfTax,
    sgst: halfTax,
    igst: 0,
    totalTax,
    grandTotal: baseSubtotal,
  };
}
