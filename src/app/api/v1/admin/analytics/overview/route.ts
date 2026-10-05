import { NextRequest } from "next/server";
import { adminOrderService } from "@/modules/order/services/admin-order.service";
import { successResponse, errorResponse } from "@/core/response";

export async function GET() {
  try {
    const analytics = await adminOrderService.getDashboardAnalytics();
    return successResponse(analytics);
  } catch (error) {
    return errorResponse(error);
  }
}
