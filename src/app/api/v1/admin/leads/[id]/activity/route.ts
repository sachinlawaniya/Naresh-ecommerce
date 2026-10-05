import { NextRequest } from "next/server";
import { LeadActivityCreateDtoSchema } from "@/modules/crm/dtos/crm.dto";
import { crmService } from "@/modules/crm/services/crm.service";
import { successResponse, errorResponse } from "@/core/response";
import { ValidationError } from "@/core/errors";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = LeadActivityCreateDtoSchema.safeParse(body);

    if (!parsed.success) {
      throw new ValidationError("Invalid activity log parameters");
    }

    const activity = await crmService.addActivity(id, parsed.data);
    return successResponse(activity, undefined, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
