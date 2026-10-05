import { NextRequest } from "next/server";
import { adminOrderService } from "@/modules/order/services/admin-order.service";
import { OrderStatus } from "@prisma/client";
import { successResponse, errorResponse } from "@/core/response";
import { ValidationError } from "@/core/errors";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!body.status || !Object.values(OrderStatus).includes(body.status)) {
      throw new ValidationError("Invalid order status value provided");
    }

    const updated = await adminOrderService.updateOrderStatus(id, body.status);
    return successResponse(updated);
  } catch (error) {
    return errorResponse(error);
  }
}
