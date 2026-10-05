import { z } from "zod";
import { LeadSource, LeadStatus } from "@prisma/client";

export const LeadCreateDtoSchema = z.object({
  email: z.string().email("Invalid email format"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number")
    .optional(),
  name: z.string().optional(),
  source: z.nativeEnum(LeadSource).default(LeadSource.WEBSITE_SIGNUP),
  cartData: z.record(z.string(), z.any()).optional(),
});

export type LeadCreateDto = z.infer<typeof LeadCreateDtoSchema>;

export const LeadActivityCreateDtoSchema = z.object({
  note: z.string().min(2, "Note must be at least 2 characters"),
  activityType: z.enum(["CALL", "EMAIL_SENT", "WHATSAPP", "NOTE"]),
});

export type LeadActivityCreateDto = z.infer<typeof LeadActivityCreateDtoSchema>;

export const LeadUpdateStatusDtoSchema = z.object({
  status: z.nativeEnum(LeadStatus),
  assignedTo: z.string().uuid().optional(),
});

export type LeadUpdateStatusDto = z.infer<typeof LeadUpdateStatusDtoSchema>;
