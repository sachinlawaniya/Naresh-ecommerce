import { NextRequest } from "next/server";
import { gstReportService } from "@/modules/gst/services/gst-report.service";
import { successResponse, errorResponse } from "@/core/response";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page") || 1);
    const limit = Number(url.searchParams.get("limit") || 20);
    const search = url.searchParams.get("search") || undefined;

    const { invoices, total } = await gstReportService.listInvoices({
      page,
      limit,
      search,
    });

    return successResponse(invoices, {
      page,
      limit,
      total,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return errorResponse(error);
  }
}
