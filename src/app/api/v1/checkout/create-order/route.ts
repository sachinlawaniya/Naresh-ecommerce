import { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { authService } from "@/modules/auth/services/auth.service";
import { orderService } from "@/modules/order/services/order.service";
import { CreateCheckoutOrderDtoSchema } from "@/modules/order/dtos/order.dto";
import { successResponse, errorResponse } from "@/core/response";
import { UnauthorizedError, ValidationError } from "@/core/errors";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      throw new UnauthorizedError("Please login to proceed with checkout");
    }

    const profile = await authService.getProfileByAuthId(authUser.id);
    const body = await req.json();
    const parsed = CreateCheckoutOrderDtoSchema.safeParse(body);

    if (!parsed.success) {
      const formattedErrors: Record<string, string[]> = {};
      parsed.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!formattedErrors[path]) formattedErrors[path] = [];
        formattedErrors[path].push(issue.message);
      });
      throw new ValidationError("Invalid checkout details", formattedErrors);
    }

    const checkoutSession = await orderService.initiateCheckout(profile.id, parsed.data);
    return successResponse(checkoutSession, undefined, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
