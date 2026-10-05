import { z } from "zod";

export const CategoryCreateDtoSchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  parentId: z.string().uuid().optional().nullable(),
});

export type CategoryCreateDto = z.infer<typeof CategoryCreateDtoSchema>;

export const VariantInputSchema = z.object({
  colorName: z.string().min(1, "Color name is required"),
  colorHex: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Invalid Hex color code"),
  size: z.string().min(1, "Size is required"),
  sku: z.string().min(3, "SKU must be at least 3 characters").optional(), // If omitted, generated automatically
  barcode: z.string().optional(),
  basePrice: z.number().positive("Base price must be greater than 0"),
  salePrice: z.number().positive().optional().nullable(),
  costPrice: z.number().positive().optional().nullable(),
  weightGrams: z.number().int().positive().default(250),
  imageUrls: z.array(z.string().url()).default([]),
  initialStock: z.number().int().nonnegative().default(0),
});

export type VariantInput = z.infer<typeof VariantInputSchema>;

export const ProductCreateDtoSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  categoryId: z.string().uuid("Please select a valid category"),
  brandId: z.string().uuid().optional().nullable(),
  hsnCode: z.string().regex(/^\d{6,8}$/, "HSN code must be 6 or 8 digits").default("61091000"),
  gstRate: z.number().nonnegative().default(5.0),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  collectionIds: z.array(z.string().uuid()).default([]),
  variants: z.array(VariantInputSchema).min(1, "At least one product variant is required"),
});

export type ProductCreateDto = z.infer<typeof ProductCreateDtoSchema>;

export const ProductQueryDtoSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  categorySlug: z.string().optional(),
  collectionSlug: z.string().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  size: z.string().optional(),
  color: z.string().optional(),
  search: z.string().optional(),
  sort: z.enum(["newest", "price_asc", "price_desc", "featured"]).default("newest"),
});

export type ProductQueryDto = z.infer<typeof ProductQueryDtoSchema>;
