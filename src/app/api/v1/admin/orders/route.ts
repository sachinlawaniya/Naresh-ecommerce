import { NextRequest } from "next/server";
import { adminOrderService } from "@/modules/order/services/admin-order.service";
import { OrderStatus } from "@prisma/client";
import { successResponse, errorResponse } from "@/core/response";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page") || 1);
    const limit = Number(url.searchParams.get("limit") || 20);
    const status = (url.searchParams.get("status") as OrderStatus) || undefined;
    const search = url.searchParams.get("search") || undefined;

    const { orders, total } = await adminOrderService.listOrders({
      page,
      limit,
      status,
      search,
    });

    return successResponse(orders, {
      page,
      limit,
      total,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return errorResponse(error);
  }
}
