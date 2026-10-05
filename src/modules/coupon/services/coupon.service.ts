import { couponRepository, ICouponRepository } from "../repositories/coupon.repository";
import { CouponCreateDto, ValidateCouponDto } from "../dtos/coupon.dto";
import { NotFoundError, ValidationError, ConflictError } from "@/core/errors";
import { DiscountType } from "@prisma/client";
import { logAudit } from "@/core/logger";

export interface CouponValidationResult {
  valid: boolean;
  couponId: string;
  code: string;
  discountType: DiscountType;
  discountAmount: number;
  finalSubtotal: number;
  message: string;
}

export class CouponService {
  constructor(private couponRepo: ICouponRepository = couponRepository) {}

  async listCoupons() {
    return this.couponRepo.listAll();
  }

  async createCoupon(dto: CouponCreateDto, operatorId?: string) {
    const existing = await this.couponRepo.findByCode(dto.code);
    if (existing) {
      throw new ConflictError(`Coupon with code '${dto.code}' already exists`);
    }

    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    if (endDate <= startDate) {
      throw new ValidationError("End date must be after start date");
    }

    const coupon = await this.couponRepo.create({
      code: dto.code,
      discountType: dto.discountType,
      discountValue: dto.discountValue,
      minOrderValue: dto.minOrderValue,
      maxDiscount: dto.maxDiscount,
      usageLimit: dto.usageLimit,
      startDate,
      endDate,
      isActive: dto.isActive,
    });

    logAudit("COUPON_CREATED", { code: coupon.code, discountType: coupon.discountType, operatorId });
    return coupon;
  }

  async validateCoupon(dto: ValidateCouponDto): Promise<CouponValidationResult> {
    const coupon = await this.couponRepo.findByCode(dto.code);
    if (!coupon) {
      throw new NotFoundError("Coupon code is invalid");
    }

    if (!coupon.isActive) {
      throw new ValidationError("This coupon is no longer active");
    }

    const now = new Date();
    if (now < coupon.startDate) {
      throw new ValidationError("This promo offer has not started yet");
    }

    if (now > coupon.endDate) {
      throw new ValidationError("This coupon code has expired");
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      throw new ValidationError("This promo code has reached its maximum redemption limit");
    }

    if (dto.cartSubtotal < Number(coupon.minOrderValue)) {
      throw new ValidationError(
        `Minimum order value of ₹${coupon.minOrderValue} required for this coupon`
      );
    }

    let calculatedDiscount = 0;
    if (coupon.discountType === DiscountType.PERCENTAGE) {
      calculatedDiscount = (dto.cartSubtotal * Number(coupon.discountValue)) / 100;
      if (coupon.maxDiscount && calculatedDiscount > Number(coupon.maxDiscount)) {
        calculatedDiscount = Number(coupon.maxDiscount);
      }
    } else {
      // FLAT_AMOUNT
      calculatedDiscount = Math.min(dto.cartSubtotal, Number(coupon.discountValue));
    }

    calculatedDiscount = Number(calculatedDiscount.toFixed(2));
    const finalSubtotal = Number((dto.cartSubtotal - calculatedDiscount).toFixed(2));

    return {
      valid: true,
      couponId: coupon.id,
      code: coupon.code,
      discountType: coupon.discountType,
      discountAmount: calculatedDiscount,
      finalSubtotal,
      message: `Coupon applied! You saved ₹${calculatedDiscount}`,
    };
  }
}

export const couponService = new CouponService();
