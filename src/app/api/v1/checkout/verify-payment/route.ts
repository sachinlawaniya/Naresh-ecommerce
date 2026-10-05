import { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { authService } from "@/modules/auth/services/auth.service";
import { orderService } from "@/modules/order/services/order.service";
import { VerifyPaymentDtoSchema } from "@/modules/order/dtos/order.dto";
import { successResponse, errorResponse } from "@/core/response";
import { UnauthorizedError, ValidationError } from "@/core/errors";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      throw new UnauthorizedError("Unauthorized payment verification request");
    }

    const profile = await authService.getProfileByAuthId(authUser.id);
    const body = await req.json();
    const parsed = VerifyPaymentDtoSchema.safeParse(body);

    if (!parsed.success) {
      throw new ValidationError("Invalid payment confirmation parameters");
    }

    const confirmedOrder = await orderService.verifyAndConfirmOrder(profile.id, parsed.data);
    return successResponse(confirmedOrder);
  } catch (error) {
    return errorResponse(error);
  }
}
