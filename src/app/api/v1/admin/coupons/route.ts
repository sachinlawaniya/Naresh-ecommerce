import { NextRequest } from "next/server";
import { CouponCreateDtoSchema } from "@/modules/coupon/dtos/coupon.dto";
import { couponService } from "@/modules/coupon/services/coupon.service";
import { successResponse, errorResponse } from "@/core/response";
import { ValidationError } from "@/core/errors";

export async function GET() {
  try {
    const coupons = await couponService.listCoupons();
    return successResponse(coupons);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CouponCreateDtoSchema.safeParse(body);

    if (!parsed.success) {
      const formattedErrors: Record<string, string[]> = {};
      parsed.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!formattedErrors[path]) formattedErrors[path] = [];
        formattedErrors[path].push(issue.message);
      });
      throw new ValidationError("Invalid coupon parameters", formattedErrors);
    }

    const created = await couponService.createCoupon(parsed.data);
    return successResponse(created, undefined, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
