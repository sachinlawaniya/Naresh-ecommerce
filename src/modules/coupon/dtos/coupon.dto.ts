import { z } from "zod";
import { DiscountType } from "@prisma/client";

export const CouponCreateDtoSchema = z.object({
  code: z
    .string()
    .min(3, "Coupon code must be at least 3 characters")
    .regex(/^[A-Z0-9_-]+$/, "Code can only contain uppercase letters, numbers, hyphens, and underscores"),
  discountType: z.nativeEnum(DiscountType),
  discountValue: z.number().positive("Discount value must be positive"),
  minOrderValue: z.number().nonnegative().default(0),
  maxDiscount: z.number().positive().optional().nullable(),
  usageLimit: z.number().int().positive().optional().nullable(),
  startDate: z.string().datetime().or(z.date()),
  endDate: z.string().datetime().or(z.date()),
  isActive: z.boolean().default(true),
});

export type CouponCreateDto = z.infer<typeof CouponCreateDtoSchema>;

export const ValidateCouponDtoSchema = z.object({
  code: z.string().min(1, "Please enter a coupon code"),
  cartSubtotal: z.number().positive("Cart subtotal must be greater than 0"),
});

export type ValidateCouponDto = z.infer<typeof ValidateCouponDtoSchema>;
