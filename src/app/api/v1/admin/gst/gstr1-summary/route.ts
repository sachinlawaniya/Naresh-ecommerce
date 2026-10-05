import { NextRequest } from "next/server";
import { gstReportService } from "@/modules/gst/services/gst-report.service";
import { successResponse, errorResponse } from "@/core/response";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const month = Number(url.searchParams.get("month") || new Date().getMonth() + 1);
    const year = Number(url.searchParams.get("year") || new Date().getFullYear());

    const summary = await gstReportService.getGSTR1MonthlySummary(month, year);
    return successResponse(summary);
  } catch (error) {
    return errorResponse(error);
  }
}
