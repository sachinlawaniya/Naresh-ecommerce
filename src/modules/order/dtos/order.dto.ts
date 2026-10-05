import { z } from "zod";

export const CheckoutItemDtoSchema = z.object({
  variantId: z.string().uuid("Valid variant ID required"),
  quantity: z.number().int().positive("Quantity must be at least 1"),
});

export type CheckoutItemDto = z.infer<typeof CheckoutItemDtoSchema>;

export const CreateCheckoutOrderDtoSchema = z.object({
  shippingAddressId: z.string().uuid("Please select a shipping address"),
  billingAddressId: z.string().uuid().optional(), // If omitted, defaults to shipping address
  couponCode: z.string().optional(),
  items: z.array(CheckoutItemDtoSchema).min(1, "Cart cannot be empty"),
  notes: z.string().optional(),
});

export type CreateCheckoutOrderDto = z.infer<typeof CreateCheckoutOrderDtoSchema>;

export const VerifyPaymentDtoSchema = z.object({
  orderId: z.string().uuid("Valid order ID required"),
  razorpayOrderId: z.string().min(1, "Razorpay order ID required"),
  razorpayPaymentId: z.string().min(1, "Razorpay payment ID required"),
  razorpaySignature: z.string().min(1, "Razorpay signature required"),
});

export type VerifyPaymentDto = z.infer<typeof VerifyPaymentDtoSchema>;
