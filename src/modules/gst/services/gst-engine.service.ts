import { env } from "@/config/env";
import { prisma } from "@/lib/prisma";

export interface TaxCalculationResult {
  isInterState: boolean;
  taxableAmount: number;
  cgstTotal: number;
  sgstTotal: number;
  igstTotal: number;
  totalTax: number;
  grandTotal: number;
  itemBreakdowns: Array<{
    variantId: string;
    unitPrice: number;
    quantity: number;
    hsnCode: string;
    gstRate: number;
    taxableAmount: number;
    cgstAmount: number;
    sgstAmount: number;
    igstAmount: number;
    totalTax: number;
    totalAmount: number;
  }>;
}

export class GSTEngineService {
  private originState: string;

  constructor() {
    this.originState = (env.STORE_ORIGIN_STATE || "Karnataka").trim().toLowerCase();
  }

  /**
   * Computes statutory GST line-item breakdowns and totals.
   */
  calculateTaxes(
    items: Array<{
      variantId: string;
      unitPrice: number;
      quantity: number;
      hsnCode: string;
      gstRate: number;
    }>,
    buyerState: string
  ): TaxCalculationResult {
    const cleanBuyerState = buyerState.trim().toLowerCase();
    const isInterState = cleanBuyerState !== this.originState;

    let overallTaxable = 0;
    let overallCgst = 0;
    let overallSgst = 0;
    let overallIgst = 0;
    let overallTotalTax = 0;
    let overallGrandTotal = 0;

    const itemBreakdowns = items.map((item) => {
      const lineTotal = item.unitPrice * item.quantity;
      const rate = item.gstRate || 5.0;

      // Inclusive GST formula: Taxable = Total * 100 / (100 + Rate)
      const itemTaxable = (lineTotal * 100) / (100 + rate);
      const itemTax = lineTotal - itemTaxable;

      let itemCgst = 0;
      let itemSgst = 0;
      let itemIgst = 0;

      if (isInterState) {
        itemIgst = itemTax;
      } else {
        itemCgst = itemTax / 2;
        itemSgst = itemTax / 2;
      }

      overallTaxable += itemTaxable;
      overallCgst += itemCgst;
      overallSgst += itemSgst;
      overallIgst += itemIgst;
      overallTotalTax += itemTax;
      overallGrandTotal += lineTotal;

      return {
        variantId: item.variantId,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        hsnCode: item.hsnCode || "61091000",
        gstRate: rate,
        taxableAmount: Number(itemTaxable.toFixed(2)),
        cgstAmount: Number(itemCgst.toFixed(2)),
        sgstAmount: Number(itemSgst.toFixed(2)),
        igstAmount: Number(itemIgst.toFixed(2)),
        totalTax: Number(itemTax.toFixed(2)),
        totalAmount: Number(lineTotal.toFixed(2)),
      };
    });

    return {
      isInterState,
      taxableAmount: Number(overallTaxable.toFixed(2)),
      cgstTotal: Number(overallCgst.toFixed(2)),
      sgstTotal: Number(overallSgst.toFixed(2)),
      igstTotal: Number(overallIgst.toFixed(2)),
      totalTax: Number(overallTotalTax.toFixed(2)),
      grandTotal: Number(overallGrandTotal.toFixed(2)),
      itemBreakdowns,
    };
  }

  /**
   * Generates a gap-free sequential GST Tax Invoice Number (e.g. INV-2627-0001)
   */
  async generateNextInvoiceNumber(): Promise<string> {
    const now = new Date();
    const currentYear = now.getFullYear();
    const month = now.getMonth() + 1; // 1-12

    // Indian FY runs April to March
    const startYear = month >= 4 ? currentYear : currentYear - 1;
    const endYear = (startYear + 1) % 100;
    const fyCode = `${startYear.toString().slice(-2)}${endYear.toString().padStart(2, "0")}`;

    const count = await prisma.invoice.count();
    const nextSeq = (count + 1).toString().padStart(4, "0");

    return `INV-${fyCode}-${nextSeq}`;
  }
}

export const gstEngineService = new GSTEngineService();
