import { z } from "zod";

export const WarehouseCreateDtoSchema = z.object({
  name: z.string().min(2, "Warehouse name must be at least 2 characters"),
  code: z
    .string()
    .min(3)
    .regex(/^[A-Z0-9-]+$/, "Warehouse code must contain uppercase letters, numbers, and hyphens"),
  addressState: z.string().min(2, "Operating state is required for GST origin"),
  city: z.string().min(2, "City is required"),
  postalCode: z
    .string()
    .regex(/^[1-9][0-9]{5}$/, "Valid 6-digit Indian PIN code required"),
  isActive: z.boolean().default(true),
});

export type WarehouseCreateDto = z.infer<typeof WarehouseCreateDtoSchema>;

export const InventoryAdjustDtoSchema = z.object({
  variantId: z.string().uuid("Valid variant ID required"),
  warehouseId: z.string().uuid("Valid warehouse ID required"),
  adjustmentQuantity: z.number().int("Quantity must be an integer"), // Positive for restock, negative for deduction
  reason: z.enum([
    "RESTOCK_INWARD",
    "STOCK_COUNT_AUDIT",
    "DAMAGED_DISPOSAL",
    "RETURN_RESTOCK",
    "SAMPLE_DISPATCH",
  ]),
  notes: z.string().optional(),
});

export type InventoryAdjustDto = z.infer<typeof InventoryAdjustDtoSchema>;

export const ReserveStockItemSchema = z.object({
  variantId: z.string().uuid(),
  quantity: z.number().int().positive("Reservation quantity must be at least 1"),
});

export type ReserveStockItem = z.infer<typeof ReserveStockItemSchema>;
