import { NextRequest } from "next/server";
import { auditLogService } from "@/modules/audit/services/audit-log.service";
import { successResponse, errorResponse } from "@/core/response";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page") || 1);
    const limit = Number(url.searchParams.get("limit") || 25);
    const action = url.searchParams.get("action") || undefined;
    const entityType = url.searchParams.get("entityType") || undefined;

    const { logs, total } = await auditLogService.listLogs({
      page,
      limit,
      action,
      entityType,
    });

    return successResponse(logs, {
      page,
      limit,
      total,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return errorResponse(error);
  }
}
