import { NextRequest } from "next/server";
import { WarehouseCreateDtoSchema } from "@/modules/inventory/dtos/inventory.dto";
import { inventoryService } from "@/modules/inventory/services/inventory.service";
import { successResponse, errorResponse } from "@/core/response";
import { ValidationError } from "@/core/errors";

export async function GET() {
  try {
    const warehouses = await inventoryService.listWarehouses();
    return successResponse(warehouses);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = WarehouseCreateDtoSchema.safeParse(body);

    if (!parsed.success) {
      const formattedErrors: Record<string, string[]> = {};
      parsed.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!formattedErrors[path]) formattedErrors[path] = [];
        formattedErrors[path].push(issue.message);
      });
      throw new ValidationError("Invalid warehouse information", formattedErrors);
    }

    const warehouse = await inventoryService.createWarehouse(parsed.data);
    return successResponse(warehouse, undefined, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
