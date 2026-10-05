import { prisma } from "@/lib/prisma";
import { env } from "@/config/env";

export interface GSTR1Summary {
  period: string;
  sellerGstin: string;
  totalInvoicesIssued: number;
  totalTaxableAmount: number;
  totalCgst: number;
  totalSgst: number;
  totalIgst: number;
  totalTaxLiability: number;
  totalGrossTurnover: number;
  placeOfSupplySummary: Array<{
    state: string;
    isInterState: boolean;
    invoiceCount: number;
    taxableAmount: number;
    cgst: number;
    sgst: number;
    igst: number;
    totalTax: number;
  }>;
  hsnSummary: Array<{
    hsnCode: string;
    description: string;
    totalQuantity: number;
    taxableAmount: number;
    gstRate: number;
    totalTax: number;
  }>;
}

export class GSTReportService {
  async listInvoices(params: {
    page: number;
    limit: number;
    search?: string;
  }) {
    const { page, limit, search } = params;
    const skip = (page - 1) * limit;

    const where: any = {
      ...(search
        ? {
            OR: [
              { invoiceNumber: { contains: search, mode: "insensitive" } },
              { order: { orderNumber: { contains: search, mode: "insensitive" } } },
              { placeOfSupply: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        skip,
        take: limit,
        orderBy: { issuedAt: "desc" },
        include: {
          order: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
              items: true,
            },
          },
        },
      }),
      prisma.invoice.count({ where }),
    ]);

    return { invoices, total };
  }

  async getGSTR1MonthlySummary(month: number, year: number): Promise<GSTR1Summary> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const invoices = await prisma.invoice.findMany({
      where: {
        issuedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        order: {
          include: {
            items: true,
          },
        },
      },
    });

    let totalTaxable = 0;
    let totalCgst = 0;
    let totalSgst = 0;
    let totalIgst = 0;
    let totalTax = 0;
    let totalTurnover = 0;

    const stateMap = new Map<string, any>();
    const hsnMap = new Map<string, any>();

    for (const inv of invoices) {
      const order = inv.order;
      const taxable = Number(order.taxableAmount);
      const cgst = Number(order.cgstTotal);
      const sgst = Number(order.sgstTotal);
      const igst = Number(order.igstTotal);
      const tax = Number(order.totalTax);
      const grand = Number(order.grandTotal);

      totalTaxable += taxable;
      totalCgst += cgst;
      totalSgst += sgst;
      totalIgst += igst;
      totalTax += tax;
      totalTurnover += grand;

      // State Map aggregation
      const state = inv.placeOfSupply;
      const isInterState = igst > 0;
      if (!stateMap.has(state)) {
        stateMap.set(state, {
          state,
          isInterState,
          invoiceCount: 0,
          taxableAmount: 0,
          cgst: 0,
          sgst: 0,
          igst: 0,
          totalTax: 0,
        });
      }
      const stateEntry = stateMap.get(state);
      stateEntry.invoiceCount += 1;
      stateEntry.taxableAmount += taxable;
      stateEntry.cgst += cgst;
      stateEntry.sgst += sgst;
      stateEntry.igst += igst;
      stateEntry.totalTax += tax;

      // HSN items aggregation
      for (const item of order.items) {
        const hsn = item.hsnCode || "61091000";
        if (!hsnMap.has(hsn)) {
          hsnMap.set(hsn, {
            hsnCode: hsn,
            description: "Apparel & Clothing Accessories",
            totalQuantity: 0,
            taxableAmount: 0,
            gstRate: Number(item.gstRate),
            totalTax: 0,
          });
        }
        const hsnEntry = hsnMap.get(hsn);
        hsnEntry.totalQuantity += item.quantity;
        hsnEntry.taxableAmount += Number(item.totalAmount) - Number(item.totalTax);
        hsnEntry.totalTax += Number(item.totalTax);
      }
    }

    return {
      period: `${month.toString().padStart(2, "0")}/${year}`,
      sellerGstin: env.STORE_GSTIN,
      totalInvoicesIssued: invoices.length,
      totalTaxableAmount: Number(totalTaxable.toFixed(2)),
      totalCgst: Number(totalCgst.toFixed(2)),
      totalSgst: Number(totalSgst.toFixed(2)),
      totalIgst: Number(totalIgst.toFixed(2)),
      totalTaxLiability: Number(totalTax.toFixed(2)),
      totalGrossTurnover: Number(totalTurnover.toFixed(2)),
      placeOfSupplySummary: Array.from(stateMap.values()),
      hsnSummary: Array.from(hsnMap.values()),
    };
  }
}

export const gstReportService = new GSTReportService();
