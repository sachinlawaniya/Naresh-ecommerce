import { NextRequest } from "next/server";
import { InventoryAdjustDtoSchema } from "@/modules/inventory/dtos/inventory.dto";
import { inventoryService } from "@/modules/inventory/services/inventory.service";
import { successResponse, errorResponse } from "@/core/response";
import { ValidationError } from "@/core/errors";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = InventoryAdjustDtoSchema.safeParse(body);

    if (!parsed.success) {
      const formattedErrors: Record<string, string[]> = {};
      parsed.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!formattedErrors[path]) formattedErrors[path] = [];
        formattedErrors[path].push(issue.message);
      });
      throw new ValidationError("Invalid inventory adjustment parameters", formattedErrors);
    }

    const updated = await inventoryService.adjustStock(parsed.data);
    return successResponse(updated);
  } catch (error) {
    return errorResponse(error);
  }
}
