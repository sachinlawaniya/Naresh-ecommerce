import { NextRequest } from "next/server";
import { ProductQueryDtoSchema } from "@/modules/catalog/dtos/catalog.dto";
import { catalogService } from "@/modules/catalog/services/catalog.service";
import { successResponse, errorResponse } from "@/core/response";
import { ValidationError } from "@/core/errors";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const params = Object.fromEntries(url.searchParams.entries());

    const parsed = ProductQueryDtoSchema.safeParse(params);
    if (!parsed.success) {
      const formattedErrors: Record<string, string[]> = {};
      parsed.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!formattedErrors[path]) formattedErrors[path] = [];
        formattedErrors[path].push(issue.message);
      });
      throw new ValidationError("Invalid product query filters", formattedErrors);
    }

    const { products, total } = await catalogService.getProducts(parsed.data);

    return successResponse(products, {
      page: parsed.data.page,
      limit: parsed.data.limit,
      total,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return errorResponse(error);
  }
}
