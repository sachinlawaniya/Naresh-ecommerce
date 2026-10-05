import { NextRequest } from "next/server";
import { ValidateCouponDtoSchema } from "@/modules/coupon/dtos/coupon.dto";
import { couponService } from "@/modules/coupon/services/coupon.service";
import { successResponse, errorResponse } from "@/core/response";
import { ValidationError } from "@/core/errors";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ValidateCouponDtoSchema.safeParse(body);

    if (!parsed.success) {
      throw new ValidationError("Invalid coupon validation request");
    }

    const result = await couponService.validateCoupon(parsed.data);
    return successResponse(result);
  } catch (error) {
    return errorResponse(error);
  }
}
