import { NextRequest } from "next/server";
import { crmService } from "@/modules/crm/services/crm.service";
import { LeadStatus, LeadSource } from "@prisma/client";
import { successResponse, errorResponse } from "@/core/response";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page") || 1);
    const limit = Number(url.searchParams.get("limit") || 20);
    const status = (url.searchParams.get("status") as LeadStatus) || undefined;
    const source = (url.searchParams.get("source") as LeadSource) || undefined;
    const search = url.searchParams.get("search") || undefined;

    const { leads, total } = await crmService.listLeads({
      page,
      limit,
      status,
      source,
      search,
    });

    return successResponse(leads, {
      page,
      limit,
      total,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return errorResponse(error);
  }
}
