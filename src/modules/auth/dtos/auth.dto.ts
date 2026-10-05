import { z } from "zod";
import { RoleType } from "@prisma/client";

export const RegisterDtoSchema = z.object({
  email: z.string().email("Invalid email address format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().optional(),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian phone number")
    .optional(),
});

export type RegisterDto = z.infer<typeof RegisterDtoSchema>;

export const LoginDtoSchema = z.object({
  email: z.string().email("Invalid email address format"),
  password: z.string().min(1, "Password is required"),
});

export type LoginDto = z.infer<typeof LoginDtoSchema>;

export const AddressDtoSchema = z.object({
  recipientName: z.string().min(2, "Recipient name is required"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
  streetLine1: z.string().min(5, "Street address must be at least 5 characters"),
  streetLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required for GST compliance"),
  postalCode: z
    .string()
    .regex(/^[1-9][0-9]{5}$/, "Please enter a valid 6-digit PIN code"),
  country: z.string().default("India"),
  isDefaultBilling: z.boolean().default(false),
  isDefaultShipping: z.boolean().default(false),
});

export type AddressDto = z.infer<typeof AddressDtoSchema>;

export const UpdateProfileDtoSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().optional(),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian phone number")
    .optional(),
  avatarUrl: z.string().url().optional(),
});

export type UpdateProfileDto = z.infer<typeof UpdateProfileDtoSchema>;

export const UpdateRoleDtoSchema = z.object({
  role: z.nativeEnum(RoleType),
});

export type UpdateRoleDto = z.infer<typeof UpdateRoleDtoSchema>;
