import { NextRequest } from "next/server";
import { inventoryService } from "@/modules/inventory/services/inventory.service";
import { successResponse, errorResponse } from "@/core/response";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page") || 1);
    const limit = Number(url.searchParams.get("limit") || 50);
    const warehouseId = url.searchParams.get("warehouseId") || undefined;
    const lowStockOnly = url.searchParams.get("lowStockOnly") === "true";
    const search = url.searchParams.get("search") || undefined;

    const { items, total } = await inventoryService.listInventory({
      page,
      limit,
      warehouseId,
      lowStockOnly,
      search,
    });

    return successResponse(items, {
      page,
      limit,
      total,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return errorResponse(error);
  }
}
