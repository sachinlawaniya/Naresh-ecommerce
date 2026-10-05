import { NextRequest } from "next/server";
import { LeadUpdateStatusDtoSchema } from "@/modules/crm/dtos/crm.dto";
import { crmService } from "@/modules/crm/services/crm.service";
import { successResponse, errorResponse } from "@/core/response";
import { ValidationError } from "@/core/errors";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = LeadUpdateStatusDtoSchema.safeParse(body);

    if (!parsed.success) {
      throw new ValidationError("Invalid lead status update parameters");
    }

    const updated = await crmService.updateLeadStatus(id, parsed.data);
    return successResponse(updated);
  } catch (error) {
    return errorResponse(error);
  }
}
